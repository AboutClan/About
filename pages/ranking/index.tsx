import { Box } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import styled from "styled-components";

import { MainLoadingAbsolute } from "../../components/atoms/loaders/MainLoading";
import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
import TabNav, { ITabNavOptions } from "../../components/molecules/navs/TabNav";
import { useAllUserDataQuery, UserStudyDataProps } from "../../hooks/admin/quries";
import { useTypeToast } from "../../hooks/custom/CustomToast";
import { sortUserRanking } from "../../libs/userEventLibs/userHelpers";
import RankingMembers from "../../pageTemplates/ranking/RankingMembers";
import RankingOverview from "../../pageTemplates/ranking/RankingOverview";

type RankingTab = "스터디 랭킹" | "활동 점수 랭킹" | "누적 랭킹";

const CATEGORY_SOURCE: { [key in RankingCategoryProp]: RankingCategorySource } = {
  "월간 랭킹": "monthScore",
  "스터디 랭킹": "cnt",
  "누적 랭킹": "score",
};

export interface RankingFilterOptionProps {
  category: RankingCategoryProp;
  isLocationFilter: boolean;
}

function Ranking() {
  const typeToast = useTypeToast();
  const { data: session } = useSession();

  const [myRanking, setMyRanking] = useState<number>();
  const [filteredUsers, setFilteredUsers] = useState<UserStudyDataProps[]>();
  const [tabValue, setTabValue] = useState<"전체 랭킹" | "내 통계">("전체 랭킹");

  const [filterOptions, setFilterOptions] = useState<RankingFilterOptionProps>({
    category: "월간 랭킹",
    isLocationFilter: false,
  });
  // const [isModal, setIsModal] = useState(false);

  const categorySource = CATEGORY_SOURCE[filterOptions.category];

  const { data: usersAll } = useAllUserDataQuery("study", {
    enabled: !!session,
  });
  console.log(usersAll);

  useEffect(() => {
    if (filterOptions.category === "스터디 랭킹") return;
    if (filterOptions.category !== "스터디 랭킹" && !usersAll) return;

    const users =
      filterOptions.category !== "스터디 랭킹"
        ? usersAll
        : [].map((record) => ({
            ...record.userSummary,
            cnt: record.cnt,
          }));

    setUsersRanking(sortUserRanking(users, categorySource, session?.user.uid));
  }, [session?.user, filterOptions, usersAll]);

  const tabOptionsArr: ITabNavOptions[] = [
    { text: "스터디 랭킹" },
    { text: "활동 점수 랭킹" },
    { text: "누적 랭킹" },
  ];
  return (
    <>
      <Header title="ABOUT 랭킹">{/* <RuleIcon setIsModal={setIsModal} /> */}</Header>
      <Slide isNoPadding>
        <Layout>
          <RankingOverview myRankInfo={usersRanking?.mine} />
          <>
            <TabNav tabOptionsArr={tabOptionsArr} isFullSize />

            <Box
              h="calc(100vh - 292px)"
              position="relative"
              m="0 20px"
              borderRadius="var(--rounded-lg)"
              border="var(--border-main)"
              bgColor="white"
            >
              {usersRanking ? (
                <RankingMembers
                  categorySource={categorySource}
                  rankingUsers={usersRanking.users}
                  isScore={filterOptions.category !== "스터디 랭킹"}
                />
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
