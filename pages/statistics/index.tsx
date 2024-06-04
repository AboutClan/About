import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import styled from "styled-components";

import { MainLoadingAbsolute } from "../../components/atoms/loaders/MainLoading";
import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
import { useAdminUsersLocationControlQuery } from "../../hooks/admin/quries";
import { useTypeToast } from "../../hooks/custom/CustomToast";
import { useUserInfoQuery } from "../../hooks/user/queries";
import { useUserAttendRateQuery } from "../../hooks/user/sub/studyRecord/queries";
import { sortUserRanking, sortUserScoreRanking } from "../../libs/userEventLibs/userHelpers";
import RankingMembers from "../../pageTemplates/ranking/RankingMembers";
import RankingOverview from "../../pageTemplates/ranking/RankingOverview";
import StatisticsFilterBar from "../../pageTemplates/ranking/StatisticsFilterBar";
import StatisticsMine from "../../pageTemplates/ranking/StatisticsMine";
import StatisticsTabNav from "../../pageTemplates/ranking/StatisticsTabNav";
import { IUserRankings } from "../../types/models/ranking";

const categoryArr = [
  `${dayjs().month()}월 랭킹`,
  `${dayjs().add(1, "month").month()}월 랭킹`,
  "점수 랭킹",
];

function Ranking() {
  const typeToast = useTypeToast();
  const { data: session } = useSession();

  const [usersRanking, setUsersRanking] = useState<IUserRankings>();
  const [tabValue, setTabValue] = useState<"전체 랭킹" | "내 통계">("전체 랭킹");
  const [filterOptions, setFilterOptions] = useState<{
    category: string;
    isSwitchOn: boolean;
  }>({
    category: `점수 랭킹`,
    isSwitchOn: true,
  });

  const categoryIdx = categoryArr.findIndex((item) => item === filterOptions.category);

  const { data: userInfo } = useUserInfoQuery();

  const { data: attendRecords, isLoading } = useUserAttendRateQuery(
    dayjs()
      .date(0)
      .subtract(categoryIdx === 0 ? 1 : 0, "month"),
    dayjs().subtract(categoryIdx === 0 ? 1 : 0, "month"),
    false,
    true,
    filterOptions?.isSwitchOn ? null : session.user.location,
    {
      onError: () => typeToast("error"),
      enabled: categoryIdx !== 2,
    },
  );

  const { data: usersAll } = useAdminUsersLocationControlQuery(
    filterOptions.isSwitchOn ? null : session.user.location,
  );

  useEffect(() => {
    if (categoryIdx !== 2) {
      setUsersRanking(sortUserRanking(attendRecords, session?.user.uid));
    } else {
      if (usersAll) setUsersRanking(sortUserScoreRanking(usersAll, userInfo.score));
    }
  }, [attendRecords, filterOptions, categoryIdx, usersAll]);

  return (
    <>
      <Header title="About 랭킹" />

      <Slide>
        <Layout>
          {usersRanking && (
            <>
              <RankingOverview myRankInfo={usersRanking.mine} isScore={categoryIdx === 2} />
              <StatisticsTabNav setTabValue={setTabValue} />
              {tabValue === "전체 랭킹" ? (
                <>
                  
                  <StatisticsFilterBar setFilterOptions={setFilterOptions} />
                  <Box
                    h="calc(100vh - 338px)"
                    position="relative"
                    m="0 16px"
                    rounded="lg"
                    border="var(--border-mint)"
                    bgColor="white"
                  >
                    {!isLoading ? (
                      <RankingMembers
                        rankingUsers={usersRanking.users}
                        isScore={categoryIdx === 2}
                      />
                    ) : (
                      <MainLoadingAbsolute />
                    )}
                  </Box>
                </>
              ) : (
                <StatisticsMine />
              )}
            </>
          )}
        </Layout>
      </Slide>
    </>
  );
}

const Layout = styled.div`
  height: calc(100vh - 96px);
  overflow-y: auto;
  background-color: var(--gray-200);
  display: flex;
  flex-direction: column;
`;

export default Ranking;
