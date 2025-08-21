import { Box, Button } from "@chakra-ui/react";
import { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import styled from "styled-components";

import Avatar from "../../components/atoms/Avatar";
import UserBadge from "../../components/atoms/badges/UserBadge";
import { MainLoading } from "../../components/atoms/loaders/MainLoading";
import { AlphabetIcon } from "../../components/Icons/AlphabetIcon";
import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
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
  
  const [members, setMembers] = useState<ICollectionAlphabet[]>();
  const [isChangeModal, setIsChangeModal] = useState(false);
  const [hasAlphabetAll, setHasAlphabetAll] = useState(false);
  const [opponentAlphabets, setOpponentAlphabets] = useState<{
    user: string;
    alphabets: Alphabet[];
  }>();

  const friends = userInfo?.friend;
  useEffect(() => {
    if (isLoading || !userInfo) return;
    const findItem = userAlphabetAll.find((who) => who?.user?.uid === session?.user.uid);

    if (ALPHABET_COLLECTION.every((item) => findItem?.collects.includes(item))) {
      setHasAlphabetAll(true);
    }
    const myUid = userInfo.uid;

    if (findItem) {
      userAlphabetAll.sort((a, b) => {
        const isMeA = a?.user?.uid === myUid;
        const isMeB = b?.user?.uid === myUid;

        if (isMeA) return -1; // 내가 최우선
        if (isMeB) return 1;

        const isFriendA = friends.includes(a?.user?.uid);
        const isFriendB = friends.includes(b?.user?.uid);

        if (isFriendA && !isFriendB) return -1; // 친구가 우선
        if (!isFriendA && isFriendB) return 1;

        return Math.random() - 0.5; // 그 외는 랜덤
      });
    }
    setMembers(userAlphabetAll);
  }, [isLoading, userInfo, userAlphabetAll]);

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
                      <Box as="span" mr={1}>
                        {user.name}
                      </Box>
                      <UserBadge badgeIdx={user?.badge?.badgeIdx} />
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

                  {who.user.uid === userInfo?.uid ? (
                    <Button
                      colorScheme="mint"
                      size="xs"
                      isDisabled={!hasAlphabetAll}
                      isLoading={completeLoading}
                      onClick={() => handleChangePromotion()}
                      fontSize="10px"
                    >
                      상품 교환
                    </Button>
                  ) : (
                    <Button
                      fontSize="10px"
                      size="xs"
                      colorScheme={friends?.includes(who.user.uid) ? "orange" : "gray"}
                      onClick={() => onClickChangeBtn(user, alphabets)}
                      isDisabled={!friends?.includes(who.user.uid)}
                    >
                      {friends?.includes(who.user.uid) ? "교환 신청" : "교환 불가"}
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
  margin: 0 var(--gap-5);
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
  font-size: 6px;
  align-items: center;
  > div {
    display: flex;
    align-items: center;
    margin-right: var(--gap-3);

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
