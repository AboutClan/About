import { Box, Flex } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import Avatar from "../../components/atoms/Avatar";
import { MainLoadingAbsolute } from "../../components/atoms/loaders/MainLoading";
import Select from "../../components/atoms/Select";
import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
import InfoModalButton from "../../components/modalButtons/InfoModalButton";
import TabNav from "../../components/molecules/navs/TabNav";
import TextSlider from "../../components/organisms/TextSlider";
import { useAllUserDataQuery, UserStudyDataProps } from "../../hooks/admin/quries";
import { useTypeToast } from "../../hooks/custom/CustomToast";
import { useUserInfoQuery } from "../../hooks/user/queries";
import RankingMembers from "../../pageTemplates/ranking/RankingMembers";

export type RankingTab = "월간 활동 랭킹" | "인기 랭킹" | "스터디 랭킹";

interface RankingProps {
  rank: number;
  value: number;
}

export interface UserRankingProps extends RankingProps {
  user: UserStudyDataProps;
}

type MedalType = "골드" | "실버" | "브론즈";

export const RANK_MAP = {
  gold: "골드",
  silver: "실버",
  bronze: "브론즈",
};

function Ranking() {
  const { data: session } = useSession();
  const typeToast = useTypeToast();

  const [myRanking, setMyRanking] = useState<RankingProps>();
  const [sortedUsers, setSortedUsers] = useState<UserRankingProps[]>();
  const [commentText, setCommentText] = useState<{ first: string; value: number }>();

  const [tab, setTab] = useState<RankingTab>("월간 활동 랭킹");
  const [medal, setMedal] = useState<MedalType>("골드");

  const { data: userInfo } = useUserInfoQuery();

  const [isLoading, setIsLoading] = useState(false);

  const fieldName =
    tab === "스터디 랭킹" ? "study" : tab === "월간 활동 랭킹" ? "monthScore" : "temperature";

  const { data: allUserData } = useAllUserDataQuery(fieldName, {
    enabled: !!session && !!fieldName,
  });

  useEffect(() => {
    setSortedUsers(null);

    setIsLoading(true);
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 200);
    return () => clearTimeout(timeout);
  }, [tab]);

  useEffect(() => {
    if (!allUserData || !session || tab === "스터디 랭킹") return;

    const sortUserByTab = (users: UserStudyDataProps[], tab: RankingTab) => {
      const temp = [...users];

      return temp.sort((a, b) => {
        if (tab === "스터디 랭킹") {
          return b.studyRecord.monthMinutes - a.studyRecord.monthMinutes; // 숫자가 클수록 앞에 오게
        } else if (tab === "월간 활동 랭킹") {
          return b.monthScore - a.monthScore;
        } else {
          return b.temperature.temperature - a.temperature.temperature;
        }
      });
    };

    const sortedData = sortUserByTab(allUserData, tab);

    const valueToRank = new Map<number, number>();
    let currentRank = 1;

    const rankedUsers: UserRankingProps[] = [...sortedData]
      .sort((a, b) => {
        const aValue =
          fieldName === "monthScore"
            ? a.monthScore
            : fieldName === "temperature"
            ? a.temperature.temperature
            : a.studyRecord.monthMinutes;
        const bValue =
          fieldName === "monthScore"
            ? b.monthScore
            : fieldName === "temperature"
            ? b.temperature.temperature
            : b.studyRecord.monthMinutes;

        return bValue - aValue;
      })
      .map((data) => {
        const value =
          fieldName === "monthScore"
            ? data.monthScore
            : fieldName === "temperature"
            ? data.temperature.temperature
            : data.studyRecord.monthMinutes;
        console.log(13, value, fieldName);
        if (!valueToRank.has(value)) {
          valueToRank.set(value, currentRank);
        }
        currentRank++;

        return {
          user: { ...data },
          value,
          rank: valueToRank.get(value)!,
        };
      });
    const findMyInfo = rankedUsers.find((who) => who.user._id === session?.user.id);
    let temp = [...rankedUsers];
    if (tab === "월간 활동 랭킹") {
      temp = [...rankedUsers].filter((user) => RANK_MAP[user.user.rank] === medal);
    }

    setSortedUsers(temp);
    {
      tab === "월간 활동 랭킹" &&
        setMyRanking({ rank: findMyInfo?.rank, value: findMyInfo?.value });
    }
  }, [allUserData, session, tab, medal]);

  const tabOptionsArr: { text: RankingTab; func: () => void }[] = [
    {
      text: "월간 활동 랭킹",
      func: () => {
        setTab("월간 활동 랭킹");
        setSortedUsers(null);
      },
    },
    {
      text: "인기 랭킹",
      func: () => {
        setTab("인기 랭킹");
        setSortedUsers(null);
      },
    },
    {
      text: "스터디 랭킹",
      func: () => {
        setTab("스터디 랭킹");
        setSortedUsers(null);
        typeToast("not-yet");
      },
    },
  ];

  useEffect(() => {
    if (
      tab !== "월간 활동 랭킹" ||
      !myRanking?.rank ||
      !sortedUsers?.length ||
      myRanking?.rank === 1
    ) {
      return;
    }

    const getCommentText = (
      myRanking: RankingProps,
      users: UserRankingProps[],
    ): { first: string; value: number } => {
      const myRankNum = myRanking.rank;

      const diffValue = users[myRankNum - 2].value - myRanking.value;

      if (myRankNum <= 5) {
        return {
          first: `랭킹 ${myRankNum - 1}위까지`,
          value: diffValue,
        };
      } else {
        return {
          first: "상품 획득까지",
          value: users[4].value - myRanking.value,
        };
      }
    };
    setCommentText(getCommentText(myRanking, sortedUsers));
  }, [myRanking, sortedUsers, tab]);

  return (
    <>
      <Header title="랭킹">
        <InfoModalButton type="ranking" />
        {/* <RuleIcon setIsModal={setIsModal} /> */}
      </Header>
      <Slide isNoPadding>
        <Flex flexDir="column" align="center" mx="auto" mt={2} mb={6}>
          <Avatar user={userInfo} size="xl2" />
          <Box mt={2} fontSize="15px" fontWeight="bold">
            {userInfo?.name}
          </Box>
          <Box fontSize="12px" color="gray.600" mt={1}>
            {!myRanking?.rank ? (
              "첫 활동으로 랭킹에 도전해보세요!"
            ) : myRanking?.rank === 1 ? (
              "랭킹 1위 달성을 축하합니다."
            ) : (
              <>
                {commentText?.first} <b>{commentText?.value}점</b> 남았어요
              </>
            )}
          </Box>
        </Flex>
        <Flex mx={5} mb={2}>
          <Flex
            border="var(--border-main)"
            borderRadius="8px"
            flex={1}
            mr={2}
            p={4}
            justify="space-between"
            align="center"
          >
            <Flex flexDir="column" align="flex-start">
              <Box color="gray.600" fontSize="12px">
                내 랭킹
              </Box>
              <Flex align="center">
                {myRanking?.rank ? (
                  <>
                    <Box fontSize="16px" lineHeight="24px" mr={1} fontWeight="bold">
                      {RANK_MAP[userInfo?.rank]} {myRanking.rank}위
                    </Box>
                    <Box color="mint" fontSize="13px" mt="1px" lineHeight="18px" fontWeight="bold">
                      {myRanking.value}점
                    </Box>
                  </>
                ) : (
                  <>
                    <Box fontSize="16px" fontWeight="bold">
                      --
                    </Box>
                  </>
                )}
              </Flex>
            </Flex>
            <Box>
              <TrophyIcon />
            </Box>
          </Flex>
          <Flex
            border="var(--border-main)"
            borderRadius="8px"
            flex={1}
            p={4}
            justify="space-between"
          >
            <Flex flexDir="column">
              <Box color="gray.600" fontSize="12px">
                지난 시즌
              </Box>
              <Box fontSize="16px" fontWeight="bold">
                {userInfo?.score <= 10 ? "순위권 외" : "브론즈 10위"}
              </Box>
            </Flex>
            <Box>
              <BronzeMedalIcon />
            </Box>
          </Flex>
        </Flex>
        <Flex
          onClick={() => {
            typeToast("inspection");
          }}
          mb={4}
          px={4}
          py={5}
          h="64px"
          mx={5}
          bg="rgba(0, 194, 179, 0.1)"
          borderRadius="8px"
        >
          <Box
            fontWeight="medium"
            w="max-content"
            borderRadius="full"
            color="white"
            bg="mint"
            fontSize="11px"
            px="6px"
            py="5px"
            mr={2}
          >
            당첨자 기록
          </Box>
          <Flex overflow="hidden" flex={1}>
            <TextSlider
              textArr={[
                { name: "이승주", gift: "배달의민족 10,000원권" },
                { name: "강태원", gift: "올리브영 10,000원권" },
                { name: "김현지", gift: "다이소 10,000원권" },
                {
                  name: "함정민",
                  gift: "스타벅스 기프티콘",
                },
                { name: "정한준", gift: "베스킨라빈스 기프티콘" },
              ]}
            />
          </Flex>
        </Flex>
        <Box borderBottom="var(--border)" px={5}>
          <TabNav tabOptionsArr={tabOptionsArr} isBlack isMain />
        </Box>
        {tab === "월간 활동 랭킹" ? (
          <Flex flex={1} justify="space-between" h="52px">
            <Select
              size="lg"
              isThick
              options={["골드", "실버", "브론즈"]}
              defaultValue={medal}
              setValue={setMedal}
              isBorder={false}
            />
          </Flex>
        ) : tab === "인기 랭킹" ? (
          <Flex h="52px" align="center" mx={5} color="gray.500" fontSize="12px">
            ※ 인기 랭킹은 상위 100명까지만 보여집니다.
          </Flex>
        ) : (
          <Flex h="52px" align="center" mx={5} color="gray.500" fontSize="12px">
            ※ 8월 중 출시 예정
          </Flex>
        )}
        {tab === "스터디 랭킹" ? (
          <Box></Box>
        ) : (
          <Box>
            <>
              {sortedUsers && !isLoading ? (
                <RankingMembers users={sortedUsers} fieldName={fieldName} />
              ) : (
                <Box pos="relative" mt="80px">
                  <MainLoadingAbsolute size="sm" />
                </Box>
              )}
            </>
          </Box>
        )}
      </Slide>
      {/* {isModal && <RuleModal content={CONTENT} setIsModal={setIsModal} />} */}
    </>
  );
}

function TrophyIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
      <path
        d="M33.1992 6.40063C35.4201 6.5995 36.8382 8.55696 36.9808 10.7076C37.3024 15.5621 33.5486 19.4639 29.109 20.5209C28.8038 20.5935 27.7315 20.7277 27.5674 20.8362C27.4181 20.9344 26.8444 21.7633 26.6401 21.9836C25.4293 23.287 23.8049 24.3247 22.1588 24.9636C22.1881 26.9571 22.7197 29.0163 24.0153 30.5421C24.8525 30.6742 25.8822 30.4528 26.7034 30.5818C27.2277 30.6642 27.572 31.1168 27.6183 31.6372C27.68 32.3372 27.7119 34.4246 27.6039 35.0719C27.5159 35.6002 27.041 35.9995 26.512 36L13.3366 35.9979C12.7392 35.9212 12.3415 35.478 12.2828 34.8746C12.2241 34.2712 12.2066 31.8157 12.3481 31.3402C12.4619 30.9581 12.7871 30.6287 13.1874 30.5734C14.0014 30.4612 15.0532 30.6788 15.8611 30.5713C16.0499 30.5463 16.2243 30.2754 16.3386 30.1161C17.0903 29.0716 17.5843 27.5375 17.7299 26.2555C17.7567 26.0191 17.8375 25.1901 17.7793 25.0179C17.75 24.9307 16.7564 24.5617 16.5696 24.4703C14.8952 23.655 13.4591 22.3077 12.3538 20.8127C7.3219 20.2125 2.67283 16.2354 3.0181 10.7571C3.14159 8.79916 4.60346 6.40063 6.75073 6.40063H9.45218V4.96516C9.45218 4.93332 9.62971 4.55957 9.66676 4.50424C9.87207 4.19418 10.2004 4.04228 10.559 4H29.4424C29.834 4.05063 30.2029 4.2469 30.3799 4.6149C30.5081 4.88164 30.5441 5.38275 30.5518 5.69333C30.5549 5.82696 30.4458 6.40063 30.575 6.40063C31.3998 6.40063 32.3991 6.32911 33.1992 6.40063ZM9.45218 8.59298H6.80219C5.68765 8.59298 5.17617 10.1036 5.12729 11.0176C4.94822 14.3782 7.67334 17.413 10.8147 18.0937C10.8894 18.0619 10.8183 17.9945 10.7998 17.9522C9.60192 15.1935 9.24482 12.8044 9.3467 9.76484L9.45167 8.59246L9.45218 8.59298ZM33.1478 8.59298C32.3373 8.50268 31.3761 8.66032 30.5492 8.59298C30.6717 11.4363 30.6949 14.3636 29.6482 17.0487L29.1867 18.0942C31.9756 17.4553 34.4362 15.1058 34.8139 12.1623C34.9822 10.8511 34.8093 8.77881 33.1483 8.5935L33.1478 8.59298Z"
        fill="url(#paint0_linear_2026_556)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_2026_556"
          x1="20"
          y1="4"
          x2="20"
          y2="36"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#FFAB04" />
          <stop offset="1" stop-color="#FFE6B4" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// const GoldMedalIcon = (
//   <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
//     <g clip-path="url(#clip0_2026_443)">
//       <path
//         d="M13.9787 16.7793C13.9817 16.7839 14.0525 16.7701 14.0812 16.8154C14.3238 17.191 14.5813 17.5589 14.7993 17.9497V20.7486C15.9431 20.0855 17.2064 19.5802 18.5246 19.3817C20.0469 19.1522 21.5738 19.2998 23.0294 19.7797C23.7942 20.0321 24.5297 20.3756 25.2108 20.8V17.9502C25.3724 17.8164 25.8176 17.0215 25.9807 16.7798C26.35 17.1136 26.5921 17.6999 26.6413 18.1853C26.7588 19.3461 26.5582 20.656 26.6583 21.8325C31.0262 25.8084 30.9631 32.5512 26.5721 36.4747C22.6022 40.0216 16.5529 39.8074 12.8492 35.9912C8.91831 31.9415 9.17322 25.5856 13.3016 21.7816C13.496 20.142 12.8236 18.1406 13.9787 16.7793Z"
//         fill="url(#paint0_linear_2026_443)"
//       />
//       <path
//         d="M13.9785 16.7793C11.0068 12.1851 8.09651 7.50077 5.13652 2.88111C4.73389 2.13254 5.2709 1.18957 6.10592 1.10612C6.93324 1.02368 7.96829 1.12138 8.82587 1.10764C10.3374 1.08322 12.1562 0.924952 13.6467 1.05268C14.055 1.0878 14.4237 1.28982 14.6961 1.58905L20.0047 10.2655L24.8307 2.43278C25.1933 1.87555 25.5621 1.13868 26.3135 1.05421C27.8404 0.882715 29.6797 1.18499 31.24 1.05217C32.6351 1.33664 35.2965 0.366196 34.9724 2.72488C31.9924 7.4163 29.0893 12.1708 25.9801 16.7793C25.817 17.021 25.3718 17.8159 25.2107 17.9497C25.1307 18.0164 24.9861 18.0556 24.8799 18.054H15.1295L14.7987 17.9497C14.5807 17.5589 14.3237 17.191 14.0806 16.8154C14.0514 16.7701 13.9806 16.7839 13.978 16.7793H13.9785Z"
//         fill="url(#paint1_linear_2026_443)"
//       />
//       <path
//         d="M19.9998 22.3184L22.3196 25.7971L26.3711 26.9111L23.7532 30.175L23.9374 34.3423L19.9998 32.8808L16.0622 34.3423L16.2463 30.175L13.6284 26.9111L17.6799 25.7971L19.9998 22.3184Z"
//         fill="white"
//       />
//     </g>
//     <defs>
//       <linearGradient
//         id="paint0_linear_2026_443"
//         x1="19.9737"
//         y1="16.7793"
//         x2="19.9737"
//         y2="39.0003"
//         gradientUnits="userSpaceOnUse"
//       >
//         <stop stop-color="#FFAB04" />
//         <stop offset="1" stop-color="#FFE6B4" />
//       </linearGradient>
//       <linearGradient
//         id="paint1_linear_2026_443"
//         x1="19.9998"
//         y1="1"
//         x2="19.9998"
//         y2="18.0541"
//         gradientUnits="userSpaceOnUse"
//       >
//         <stop stop-color="#00C2B3" />
//         <stop offset="1" stop-color="#00A79A" />
//       </linearGradient>
//       <clipPath id="clip0_2026_443">
//         <rect width="30" height="38" fill="white" transform="translate(5 1)" />
//       </clipPath>
//     </defs>
//   </svg>
// );

// const SilverMedalIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
//     <g clip-path="url(#clip0_2026_534)">
//       <path
//         d="M13.9787 16.7793C13.9817 16.7839 14.0525 16.7701 14.0812 16.8154C14.3238 17.191 14.5813 17.5589 14.7993 17.9497V20.7486C15.9431 20.0855 17.2064 19.5802 18.5246 19.3817C20.0469 19.1522 21.5738 19.2998 23.0294 19.7797C23.7942 20.0321 24.5297 20.3756 25.2108 20.8V17.9502C25.3724 17.8164 25.8176 17.0215 25.9807 16.7798C26.35 17.1136 26.5921 17.6999 26.6413 18.1853C26.7588 19.3461 26.5582 20.656 26.6583 21.8325C31.0262 25.8084 30.9631 32.5512 26.5721 36.4747C22.6022 40.0216 16.5529 39.8074 12.8492 35.9912C8.91831 31.9415 9.17322 25.5856 13.3016 21.7816C13.496 20.142 12.8236 18.1406 13.9787 16.7793Z"
//         fill="url(#paint0_linear_2026_534)"
//       />
//       <path
//         d="M13.9785 16.7793C11.0068 12.1851 8.09651 7.50077 5.13652 2.88111C4.73389 2.13254 5.2709 1.18957 6.10592 1.10612C6.93324 1.02368 7.96829 1.12138 8.82587 1.10764C10.3374 1.08322 12.1562 0.924952 13.6467 1.05268C14.055 1.0878 14.4237 1.28982 14.6961 1.58905L20.0047 10.2655L24.8307 2.43278C25.1933 1.87555 25.5621 1.13868 26.3135 1.05421C27.8404 0.882715 29.6797 1.18499 31.24 1.05217C32.6351 1.33664 35.2965 0.366196 34.9724 2.72488C31.9924 7.4163 29.0893 12.1708 25.9801 16.7793C25.817 17.021 25.3718 17.8159 25.2107 17.9497C25.1307 18.0164 24.9861 18.0556 24.8799 18.054H15.1295L14.7987 17.9497C14.5807 17.5589 14.3237 17.191 14.0806 16.8154C14.0514 16.7701 13.9806 16.7839 13.978 16.7793H13.9785Z"
//         fill="url(#paint1_linear_2026_534)"
//       />
//       <path
//         d="M19.9998 22.3184L22.3196 25.7971L26.3711 26.9111L23.7532 30.175L23.9374 34.3423L19.9998 32.8808L16.0622 34.3423L16.2463 30.175L13.6284 26.9111L17.6799 25.7971L19.9998 22.3184Z"
//         fill="white"
//       />
//     </g>
//     <defs>
//       <linearGradient
//         id="paint0_linear_2026_534"
//         x1="19.9737"
//         y1="16.7793"
//         x2="19.9737"
//         y2="39.0003"
//         gradientUnits="userSpaceOnUse"
//       >
//         <stop stop-color="#ADB5BD" />
//         <stop offset="1" stop-color="#D3D3D3" />
//       </linearGradient>
//       <linearGradient
//         id="paint1_linear_2026_534"
//         x1="19.9998"
//         y1="1"
//         x2="19.9998"
//         y2="18.0541"
//         gradientUnits="userSpaceOnUse"
//       >
//         <stop stop-color="#00C2B3" />
//         <stop offset="1" stop-color="#00A79A" />
//       </linearGradient>
//       <clipPath id="clip0_2026_534">
//         <rect width="30" height="38" fill="white" transform="translate(5 1)" />
//       </clipPath>
//     </defs>
//   </svg>
// );

function BronzeMedalIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
      <g clip-path="url(#clip0_2026_540)">
        <path
          d="M13.9787 16.7793C13.9817 16.7839 14.0525 16.7701 14.0812 16.8154C14.3238 17.191 14.5813 17.5589 14.7993 17.9497V20.7486C15.9431 20.0855 17.2064 19.5802 18.5246 19.3817C20.0469 19.1522 21.5738 19.2998 23.0294 19.7797C23.7942 20.0321 24.5297 20.3756 25.2108 20.8V17.9502C25.3724 17.8164 25.8176 17.0215 25.9807 16.7798C26.35 17.1136 26.5921 17.6999 26.6413 18.1853C26.7588 19.3461 26.5582 20.656 26.6583 21.8325C31.0262 25.8084 30.9631 32.5512 26.5721 36.4747C22.6022 40.0216 16.5529 39.8074 12.8492 35.9912C8.91831 31.9415 9.17322 25.5856 13.3016 21.7816C13.496 20.142 12.8236 18.1406 13.9787 16.7793Z"
          fill="url(#paint0_linear_2026_540)"
        />
        <path
          d="M13.9785 16.7793C11.0068 12.1851 8.09651 7.50077 5.13652 2.88111C4.73389 2.13254 5.2709 1.18957 6.10592 1.10612C6.93324 1.02368 7.96829 1.12138 8.82587 1.10764C10.3374 1.08322 12.1562 0.924952 13.6467 1.05268C14.055 1.0878 14.4237 1.28982 14.6961 1.58905L20.0047 10.2655L24.8307 2.43278C25.1933 1.87555 25.5621 1.13868 26.3135 1.05421C27.8404 0.882715 29.6797 1.18499 31.24 1.05217C32.6351 1.33664 35.2965 0.366196 34.9724 2.72488C31.9924 7.4163 29.0893 12.1708 25.9801 16.7793C25.817 17.021 25.3718 17.8159 25.2107 17.9497C25.1307 18.0164 24.9861 18.0556 24.8799 18.054H15.1295L14.7987 17.9497C14.5807 17.5589 14.3237 17.191 14.0806 16.8154C14.0514 16.7701 13.9806 16.7839 13.978 16.7793H13.9785Z"
          fill="url(#paint1_linear_2026_540)"
        />
        <path
          d="M19.9998 22.3184L22.3196 25.7971L26.3711 26.9111L23.7532 30.175L23.9374 34.3423L19.9998 32.8808L16.0622 34.3423L16.2463 30.175L13.6284 26.9111L17.6799 25.7971L19.9998 22.3184Z"
          fill="white"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_2026_540"
          x1="19.9737"
          y1="16.7793"
          x2="19.9737"
          y2="39.0003"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#985948" />
          <stop offset="1" stop-color="#A17800" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_2026_540"
          x1="19.9998"
          y1="1"
          x2="19.9998"
          y2="18.0541"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#00C2B3" />
          <stop offset="1" stop-color="#00A79A" />
        </linearGradient>
        <clipPath id="clip0_2026_540">
          <rect width="30" height="38" fill="white" transform="translate(5 1)" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default Ranking;
