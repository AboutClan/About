import { Badge, Button } from "@chakra-ui/react";
import { faX } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { AlphabetIcon } from "../../../components/common/Icon/AlphabetIcon";
import { MainLoading } from "../../../components/common/loaders/MainLoading";
import ProfileIcon from "../../../components/common/user/Profile/ProfileIcon";
import Header from "../../../components/layout/Header";
import PageLayout from "../../../components/layout/PageLayout";
import { BADGE_COLOR } from "../../../constants/contentsValue/badge";
import { getUserBadge } from "../../../helpers/userHelpers";
import {
  useAlphabetCompletedMutation,
  useCollectionAlphabetMutation,
} from "../../../hooks/user/sub/collection/mutations";
import {
  useCollectionAlphabetAllQuery,
  useCollectionAlphabetQuery,
} from "../../../hooks/user/sub/collection/queries";
import AlphabetChangeModal from "../../../modals/user/collection/AlphabetChangeModal";
import { prevPageUrlState } from "../../../recoil/previousAtoms";
import { transferUserDataState } from "../../../recoil/transferDataAtoms";
import { isGuestState } from "../../../recoil/userAtoms";
import { Alphabet, ICollectionAlphabet } from "../../../types/user/collections";
import { IUser } from "../../../types/user/user";

const ALPHABET_COLLECTION: Alphabet[] = ["A", "B", "O", "U", "T"];

function CollectionAlphabet() {
  const router = useRouter();
  const { data: session } = useSession();
  const isGuest = useRecoilValue(isGuestState);

  const setUserData = useSetRecoilState(transferUserDataState);
  const setBeforePage = useSetRecoilState(prevPageUrlState);

  const { data: alphabets } = useCollectionAlphabetQuery({
    enabled: !isGuest,
  });

  const { mutate } = useCollectionAlphabetMutation();

  const { mutate: mutate2 } = useAlphabetCompletedMutation({
    onError(err: AxiosError<{ message: string }, any>) {
      const res = err.response.data;
      if (res.message === "not completed") {
        //다 모으지 못했음
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

  useEffect(() => {
    if (isLoading) return;
    const findItem = userAlphabetAll.find(
      (who) => who.user.uid === session?.uid
    );

    if (
      ALPHABET_COLLECTION.every((item) => findItem?.collects.includes(item))
    ) {
      setHasAlphabetAll(true);
    }

    if (findItem) {
      console.log(userAlphabetAll);
      userAlphabetAll.sort((a, b) => {
        if (!a?.user?.uid) {
          console.log(a);
        }
        if (a.user.uid === session?.uid) return -1;
        if (b.user.uid === session?.uid) return 1;
        return 0;
      });
    }
    setMembers(userAlphabetAll);
  }, [isLoading, session?.uid, userAlphabetAll]);

  const onClickProfile = (user: IUser) => {
    setUserData(user);
    setBeforePage(router?.asPath);
    router.push(`/profile/${user.uid}`);
  };

  const onClickChangeBtn = (user, alphabets: Alphabet[]) => {
    setOpponentAlphabets({ user, alphabets });
    setIsChangeModal(true);
  };

  return (
    <>
      <PageLayout>
        <Header title="전체 수집 현황" url="/user/collection" />
        {!isLoading ? (
          <>
            <Members>
              {members?.map((who) => {
                const user = who.user;
                const userBadge = getUserBadge(user.score, user.uid);
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
                    <ProfileWrapper onClick={() => onClickProfile(user)}>
                      <ProfileIcon user={user} size="sm" />
                    </ProfileWrapper>
                    <Info>
                      <Name>
                        <span>{user.name}</span>
                        <Badge
                          fontSize={10}
                          colorScheme={BADGE_COLOR[userBadge]}
                          ml="var(--margin-md)"
                        >
                          {userBadge}
                        </Badge>
                      </Name>
                      <UserAlphabets>
                        <div>
                          <AlphabetIcon
                            alphabet="A"
                            isDuotone={!alphabets?.includes("A")}
                          />
                          <FontAwesomeIcon icon={faX} />
                          <AlphabetCnt hasAlphabet={alphabetsCnt.A !== 0}>
                            {alphabetsCnt.A}
                          </AlphabetCnt>
                        </div>
                        <div>
                          <AlphabetIcon
                            alphabet="B"
                            isDuotone={!alphabets?.includes("B")}
                          />{" "}
                          <FontAwesomeIcon icon={faX} />
                          <AlphabetCnt hasAlphabet={alphabetsCnt.B !== 0}>
                            {alphabetsCnt.B}
                          </AlphabetCnt>
                        </div>
                        <div>
                          <AlphabetIcon
                            alphabet="O"
                            isDuotone={!alphabets?.includes("O")}
                          />{" "}
                          <FontAwesomeIcon icon={faX} />
                          <AlphabetCnt hasAlphabet={alphabetsCnt.O !== 0}>
                            {alphabetsCnt.O}
                          </AlphabetCnt>
                        </div>
                        <div>
                          <AlphabetIcon
                            alphabet="U"
                            isDuotone={!alphabets?.includes("U")}
                          />{" "}
                          <FontAwesomeIcon icon={faX} />
                          <AlphabetCnt hasAlphabet={alphabetsCnt.U !== 0}>
                            {alphabetsCnt.U}
                          </AlphabetCnt>
                        </div>
                        <div>
                          <AlphabetIcon
                            alphabet="T"
                            isDuotone={!alphabets?.includes("T")}
                          />{" "}
                          <FontAwesomeIcon icon={faX} />
                          <AlphabetCnt hasAlphabet={alphabetsCnt.T !== 0}>
                            {alphabetsCnt.T}
                          </AlphabetCnt>
                        </div>
                      </UserAlphabets>
                    </Info>
                    {who.user.uid === session?.uid ? (
                      <Button
                        colorScheme="telegram"
                        size="xs"
                        disabled={!hasAlphabetAll}
                      >
                        상품 교환
                      </Button>
                    ) : (
                      <Button
                        size="xs"
                        colorScheme="mintTheme"
                        onClick={() => onClickChangeBtn(user.uid, alphabets)}
                      >
                        교환 신청
                      </Button>
                    )}
                  </Item>
                );
              })}
            </Members>
          </>
        ) : (
          <MainLoading />
        )}
      </PageLayout>
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
  margin: 0 var(--margin-main);
`;

const Item = styled.div`
  padding: var(--padding-sub) 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: var(--border-sub);
  border-bottom: var(--border-sub);
`;
const ProfileWrapper = styled.div``;

const Info = styled.div`
  height: 100%;
  margin-left: var(--margin-sub);
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
  margin-bottom: var(--margin-min);
`;

const UserAlphabets = styled.div`
  display: flex;
  justify-content: center;
  font-size: 8px;
  align-items: center;
  > div {
    display: flex;
    align-items: center;
    margin-right: var(--margin-md);

    > *:nth-child(2) {
      margin: 0 var(--margin-min);
    }
  }
`;

const AlphabetCnt = styled.span<{ hasAlphabet: boolean }>`
  font-size: 12px;
  color: ${(props) =>
    props.hasAlphabet ? "var(--font-h2)" : "var(--font-h3)"};
`;

export default CollectionAlphabet;
