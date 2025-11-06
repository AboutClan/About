import { Box, Button } from "@chakra-ui/react";
import { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import styled from "styled-components";

import { AboutIcon } from "../../components/atoms/AboutIcons";
import Avatar from "../../components/atoms/Avatar";
import UserBadge from "../../components/atoms/badges/UserBadge";
import IconButton from "../../components/atoms/buttons/IconButton";
import { MainLoading } from "../../components/atoms/loaders/MainLoading";
import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
import { useFailToast, useToast } from "../../hooks/custom/CustomToast";
import { useUserInfoQuery } from "../../hooks/user/queries";
import { useAlphabetCompletedMutation } from "../../hooks/user/sub/collection/mutations";
import {
  useCollectionAlphabetAllQuery,
  useCollectionAlphabetQuery,
} from "../../hooks/user/sub/collection/queries";
import { AlphabetChangeGuideModal } from "../../modals/aboutHeader/dailyCheckModal/DailyCheckModal";
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

  const [isModal, setIsModal] = useState(false);
  const [members, setMembers] = useState<ICollectionAlphabet[]>();
  const [isChangeModal, setIsChangeModal] = useState(false);
  const [hasAlphabetAll, setHasAlphabetAll] = useState(false);
  const [opponentAlphabets, setOpponentAlphabets] = useState<{
    user: string;
    alphabets: Alphabet[];
  }>();

  const friends = userInfo?.friend;
  useEffect(() => {
    if (isLoading || !userInfo || !userAlphabetAll) return;
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
      <Header title="전체 수집 현황">
        <IconButton onClick={() => setIsModal(true)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 20 20"
            fill="none"
          >
            <g clipPath="url(#clip0_2444_1052)">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10 7.66671C9.73479 7.66671 9.48044 7.56135 9.2929 7.37381C9.10537 7.18628 9.00001 6.93192 9.00001 6.66671C9.00001 6.40149 9.10537 6.14714 9.2929 5.9596C9.48044 5.77206 9.73479 5.66671 10 5.66671C10.2652 5.66671 10.5196 5.77206 10.7071 5.9596C10.8947 6.14714 11 6.40149 11 6.66671C11 6.93192 10.8947 7.18628 10.7071 7.37381C10.5196 7.56135 10.2652 7.66671 10 7.66671ZM10.8333 13.8625C10.8333 14.0836 10.7455 14.2955 10.5893 14.4518C10.433 14.6081 10.221 14.6959 10 14.6959C9.779 14.6959 9.56704 14.6081 9.41076 14.4518C9.25447 14.2955 9.16668 14.0836 9.16668 13.8625V9.69587C9.16668 9.47486 9.25447 9.2629 9.41076 9.10662C9.56704 8.95034 9.779 8.86254 10 8.86254C10.221 8.86254 10.433 8.95034 10.5893 9.10662C10.7455 9.2629 10.8333 9.47486 10.8333 9.69587V13.8625ZM10 0.833374C4.93751 0.833374 0.833344 4.93754 0.833344 10C0.833344 15.0625 4.93751 19.1667 10 19.1667C15.0625 19.1667 19.1667 15.0625 19.1667 10C19.1667 4.93754 15.0625 0.833374 10 0.833374Z"
                fill="var(--color-icon)"
              />
            </g>
            <defs>
              <clipPath id="clip0_2444_1052">
                <rect width="20" height="20" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </IconButton>
      </Header>

      {!isLoading ? (
        <Slide isNoPadding>
          <Members>
            {members
              ?.filter((member) => member?.user.name !== "어바웃")
              .map((who) => {
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
                      <Avatar size="md1" user={user} />{" "}
                    </ProfileWrapper>
                    <Info>
                      <Name>
                        <Box as="span" mr={1}>
                          {user.name}
                        </Box>
                        <UserBadge badgeIdx={user?.badge?.badgeIdx} />
                      </Name>
                      <AlphabetContainer>
                        <AboutIcon alphabet="A" isActive={alphabets?.includes("A")} size="sm" />
                        <AboutIcon alphabet="B" isActive={alphabets?.includes("B")} size="sm" />
                        <AboutIcon alphabet="O" isActive={alphabets?.includes("O")} size="sm" />
                        <AboutIcon alphabet="U" isActive={alphabets?.includes("U")} size="sm" />
                        <AboutIcon alphabet="T" isActive={alphabets?.includes("T")} size="sm" />
                      </AlphabetContainer>
                    </Info>

                    {who.user.uid === userInfo?.uid ? (
                      <Button
                        colorScheme="mint"
                        size="xs"
                        isLoading={completeLoading}
                        onClick={() => {
                          if (!hasAlphabetAll) {
                            toast("error", "ABOUT 알파벳을 모두 모아야 교환할 수 있습니다.");
                            return;
                          }
                          handleChangePromotion();
                        }}
                        fontSize="10px"
                      >
                        상품 교환
                      </Button>
                    ) : (
                      <Button
                        fontSize="10px"
                        size="xs"
                        colorScheme="orange"
                        onClick={() => {
                          if (!friends.includes(who.user.uid)) {
                            toast("error", "서로 친구인 경우에만 교환이 가능합니다.");
                            return;
                          }
                          onClickChangeBtn(user, alphabets);
                        }}
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
      {isModal && <AlphabetChangeGuideModal setIsModal={setIsModal} />}
    </>
  );
}

const AlphabetContainer = styled.div`
  padding-top: 4px;
  padding-bottom: 4px;
  display: flex;
  justify-content: center;
  font-size: 24px;
  align-items: center;
  > * {
    margin-right: 8px;
  }
`;

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

export default CollectionAlphabet;
