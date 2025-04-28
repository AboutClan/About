import { Badge, Button } from "@chakra-ui/react";
import { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import styled from "styled-components";

import Avatar from "../../components/atoms/Avatar";
import { MainLoading } from "../../components/atoms/loaders/MainLoading";
import { AlphabetIcon } from "../../components/Icons/AlphabetIcon";
import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
import { BADGE_COLOR_MAPPINGS } from "../../constants/serviceConstants/badgeConstants";
import { useFailToast, useToast } from "../../hooks/custom/CustomToast";
import { useUserInfoQuery } from "../../hooks/user/queries";
import { useAlphabetCompletedMutation } from "../../hooks/user/sub/collection/mutations";
import {
  useCollectionAlphabetAllQuery,
  useCollectionAlphabetQuery,
} from "../../hooks/user/sub/collection/queries";
import AlphabetChangeModal from "../../modals/user/collection/AlphabetChangeModal";
import { Alphabet, ICollectionAlphabet } from "../../types/models/collections";
import { IUserSummary } from "../../types/models/userTypes/userInfoTypes";
import { getUserBadge } from "../../utils/convertUtils/convertDatas";

const ALPHABET_COLLECTION: Alphabet[] = ["A", "B", "O", "U", "T"];

function CollectionAlphabet() {
  const failToast = useFailToast();
  const toast = useToast();

  const { data: session } = useSession();

  const { data: userInfo } = useUserInfoQuery();

  const { data: alphabets } = useCollectionAlphabetQuery();

  const { mutate: mutate2, isLoading: completeLoading } = useAlphabetCompletedMutation({
    onSuccess() {
      toast("success", "교환이 완료되었어요! 상품은 확인하는대로 보내드려요!");
    },
    /* eslint-disable @typescript-eslint/no-explicit-any */
    onError(err: AxiosError<{ message: string }, any>) {
      const res = err.response.data;
      if (res.message === "not completed") {
        failToast("free", "알파벳이 모두 있지 않습니다.");
      }
    },
  });
  const { data: userAlphabetAll, isLoading } = useCollectionAlphabetAllQuery();
  console.log(userAlphabetAll);

  const [members, setMembers] = useState<ICollectionAlphabet[]>();
  const [isChangeModal, setIsChangeModal] = useState(false);
  const [hasAlphabetAll, setHasAlphabetAll] = useState(false);
  const [opponentAlphabets, setOpponentAlphabets] = useState<{
    user: string;
    alphabets: Alphabet[];
  }>();

  useEffect(() => {
    if (isLoading) return;
    const findItem = userAlphabetAll.find((who) => who?.user?.uid === session?.user.uid);

    if (ALPHABET_COLLECTION.every((item) => findItem?.collects.includes(item))) {
      setHasAlphabetAll(true);
    }

    if (findItem) {
      userAlphabetAll.sort((a, b) => {
        if (a?.user?.uid === session?.user?.uid) return -1;
        if (b?.user?.uid === session?.user?.uid) return 1;
        return 0;
      });
    }
    setMembers(userAlphabetAll);
  }, [isLoading, session?.user?.uid, userAlphabetAll]);

  const onClickChangeBtn = (user: IUserSummary, alphabets: Alphabet[]) => {
    const myFriends = userInfo?.friend;
    if (!myFriends?.includes(user.uid)) {
      failToast("free", "친구끼리만 교환 신청이 가능합니다.");
      return;
    }
    setOpponentAlphabets({ user: user.uid, alphabets });
    setIsChangeModal(true);
  };

  const handleChangePromotion = () => {
    mutate2();
  };

  return (
    <>
      <Header title="전체 수집 현황" />

      {!isLoading ? (
        <Slide isNoPadding>
          <Members>
            {members?.map((who) => {
              if (!who?.user) return null;
              const user = who.user;
              const badge = getUserBadge(user.score, user.uid);
              const alphabets = who.collects;
              const alphabetsCnt = {
                A: 0,
                B: 0,
                O: 0,
                U: 0,
                T: 0,
              };
              alphabets.forEach((alphabet) => {
                alphabetsCnt[alphabet]++;
              });
              return (
                <Item key={user.uid}>
                  <ProfileWrapper>
                    <Avatar size="md1" user={user} />
                  </ProfileWrapper>
                  <Info>
                    <Name>
                      <span>{user.name}</span>
                      <Badge
                        fontSize={10}
                        colorScheme={BADGE_COLOR_MAPPINGS[badge]}
                        ml="var(--gap-2)"
                      >
                        {badge}
                      </Badge>
                    </Name>
                    <UserAlphabets>
                      <div>
                        <AlphabetIcon alphabet="A" isDuotone={!alphabets?.includes("A")} />
                        <i className="fa-solid fa-x" />

                        <AlphabetCnt hasAlphabet={alphabetsCnt.A !== 0}>
                          {alphabetsCnt.A}
                        </AlphabetCnt>
                      </div>
                      <div>
                        <AlphabetIcon alphabet="B" isDuotone={!alphabets?.includes("B")} />{" "}
                        <i className="fa-solid fa-x" />
                        <AlphabetCnt hasAlphabet={alphabetsCnt.B !== 0}>
                          {alphabetsCnt.B}
                        </AlphabetCnt>
                      </div>
                      <div>
                        <AlphabetIcon alphabet="O" isDuotone={!alphabets?.includes("O")} />{" "}
                        <i className="fa-solid fa-x" />
                        <AlphabetCnt hasAlphabet={alphabetsCnt.O !== 0}>
                          {alphabetsCnt.O}
                        </AlphabetCnt>
                      </div>
                      <div>
                        <AlphabetIcon alphabet="U" isDuotone={!alphabets?.includes("U")} />{" "}
                        <i className="fa-solid fa-x" />
                        <AlphabetCnt hasAlphabet={alphabetsCnt.U !== 0}>
                          {alphabetsCnt.U}
                        </AlphabetCnt>
                      </div>
                      <div>
                        <AlphabetIcon alphabet="T" isDuotone={!alphabets?.includes("T")} />{" "}
                        <i className="fa-solid fa-x" />
                        <AlphabetCnt hasAlphabet={alphabetsCnt.T !== 0}>
                          {alphabetsCnt.T}
                        </AlphabetCnt>
                      </div>
                    </UserAlphabets>
                  </Info>

                  {who.user.uid === session?.user?.uid ? (
                    <Button
                      colorScheme="telegram"
                      size="xs"
                      disabled={!hasAlphabetAll}
                      isLoading={completeLoading}
                      onClick={() => handleChangePromotion()}
                    >
                      상품 교환
                    </Button>
                  ) : (
                    <Button
                      size="xs"
                      colorScheme="mint"
                      onClick={() => onClickChangeBtn(user, alphabets)}
                    >
                      교환 신청
                    </Button>
                  )}
                </Item>
              );
            })}
          </Members>
        </Slide>
      ) : (
        <MainLoading />
      )}
      {isChangeModal && (
        <AlphabetChangeModal
          myAlphabets={alphabets?.collects || []}
          opponentAlpabets={opponentAlphabets.alphabets}
          setIsModal={setIsChangeModal}
          toUid={opponentAlphabets.user}
        />
      )}
    </>
  );
}

const Members = styled.div`
  margin: 0 var(--gap-4);
  margin-top: 56px;
`;

const Item = styled.div`
  padding: var(--gap-3) 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: var(--border-main);
`;
const ProfileWrapper = styled.div``;

const Info = styled.div`
  height: 100%;
  margin-left: var(--gap-3);
  margin-right: auto;
  display: flex;
  flex-direction: column;

  justify-content: space-between;
`;
const Name = styled.div`
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 13px;
  margin-bottom: var(--gap-1);
`;

const UserAlphabets = styled.div`
  display: flex;
  justify-content: center;
  font-size: 8px;
  align-items: center;
  > div {
    display: flex;
    align-items: center;
    margin-right: var(--gap-2);

    > *:nth-child(2) {
      margin: 0 var(--gap-1);
    }
  }
`;

const AlphabetCnt = styled.span<{ hasAlphabet: boolean }>`
  font-size: 12px;
  color: ${(props) => (props.hasAlphabet ? "var(--gray-700)" : "var(--gray-600)")};
`;

export default CollectionAlphabet;
