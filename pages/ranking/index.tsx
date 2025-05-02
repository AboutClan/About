import { Box } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import styled from "styled-components";

import { MainLoadingAbsolute } from "../../components/atoms/loaders/MainLoading";
import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
import TabNav from "../../components/molecules/navs/TabNav";
import { useAllUserDataQuery, UserStudyDataProps } from "../../hooks/admin/quries";
import RankingMembers from "../../pageTemplates/ranking/RankingMembers";
import RankingOverview from "../../pageTemplates/ranking/RankingOverview";

export type RankingTab = "월간 스터디 기록" | "월간 동아리 점수" | "동아리 누적 랭킹";

interface RankingProps {
  rank: number;
  value: number;
}

export interface UserRankingProps extends RankingProps {
  user: UserStudyDataProps;
}

function Ranking() {
  const { data: session } = useSession();

  const [myRanking, setMyRanking] = useState<RankingProps>();
  const [sortedUsers, setSortedUsers] = useState<UserRankingProps[]>();

  const [tab, setTab] = useState<RankingTab>("월간 동아리 점수");

  const [isLoading, setIsLoading] = useState(false);

  const { data: allUserData } = useAllUserDataQuery("study", {
    enabled: !!session,
  });

  const fieldName =
    tab === "월간 스터디 기록"
      ? "studyRecord"
      : tab === "월간 동아리 점수"
      ? "monthScore"
      : "score";

  const sortUserByTab = (users: UserStudyDataProps[], tab: RankingTab) => {
    return [...users].sort((a, b) => {
      if (tab === "월간 스터디 기록") {
        return b.studyRecord.monthMinutes - a.studyRecord.monthMinutes; // 숫자가 클수록 앞에 오게
      } else if (tab === "월간 동아리 점수") {
        return b.monthScore - a.monthScore;
      } else {
        return b.score - a.score;
      }
    });
  };

  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timeout);
  }, [tab]);

  useEffect(() => {
    if (!allUserData || !session) return;
    const sortedData = sortUserByTab(allUserData, tab);

    const valueToRank = new Map<number, number>();
    let currentRank = 1;

    const rankedUsers: UserRankingProps[] = [...sortedData]
      .sort((a, b) => {
        const aValue = fieldName !== "studyRecord" ? a[fieldName] : a[fieldName].monthMinutes;
        const bValue = fieldName !== "studyRecord" ? b[fieldName] : b[fieldName].monthMinutes;
        return bValue - aValue;
      })
      .map((data) => {
        const value = fieldName !== "studyRecord" ? data[fieldName] : data[fieldName].monthMinutes;

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
    setSortedUsers(rankedUsers);
    setMyRanking({ rank: findMyInfo?.rank, value: findMyInfo?.value });

    // const findIndex = sortedData.findIndex((user) => user._id === session?.user.id);
    // if (findIndex !== -1) {
    //   setMyRanking({ rank: findIndex + 1, value: sortedData[findi] });
    // }
  }, [allUserData, session, tab]);

  // useEffect(() => {
  //   setUsersRanking(sortUserRanking(users, categorySource, session?.user.uid));
  // }, [session?.user, filterOptions, usersAll]);

  const tabOptionsArr: { text: RankingTab; func: () => void }[] = [
    {
      text: "월간 동아리 점수",
      func: () => setTab("월간 동아리 점수"),
    },
    {
      text: "월간 스터디 기록",
      func: () => setTab("월간 스터디 기록"),
    },
    {
      text: "동아리 누적 랭킹",
      func: () => setTab("동아리 누적 랭킹"),
    },
  ];

  return (
    <>
      <Header title="랭킹">{/* <RuleIcon setIsModal={setIsModal} /> */}</Header>
      <Slide isNoPadding>
        <Layout>
          <RankingOverview {...myRanking} />
          <>
            <Box px={5} borderBottom="var(--border)">
              <TabNav tabOptionsArr={tabOptionsArr} isFullSize isMain />
            </Box>
            <Box
              h="calc(100vh - 262px)"
              position="relative"
              m="0 20px"
              mt={5}
              borderRadius="var(--rounded-lg)"
              border="var(--border-main)"
              bgColor="white"
            >
              {sortedUsers && !isLoading ? (
                <RankingMembers users={sortedUsers} fieldName={fieldName} />
              ) : (
                <MainLoadingAbsolute />
              )}
            </Box>
          </>
        </Layout>
      </Slide>
      {/* {isModal && <RuleModal content={CONTENT} setIsModal={setIsModal} />} */}
    </>
  );
}

const Layout = styled.div`
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

export default Ranking;
