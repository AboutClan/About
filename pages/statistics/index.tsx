import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import styled from "styled-components";

import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
import { useAdminUsersLocationControlQuery } from "../../hooks/admin/quries";
import { useTypeToast } from "../../hooks/custom/CustomToast";
import { useUserInfoQuery } from "../../hooks/user/queries";
import { useUserAttendRateQuery } from "../../hooks/user/sub/studyRecord/queries";
import { IUserRankings } from "../../types/models/ranking";

const categoryArr = ["활동 랭킹", `스터디 랭킹`, "누적 랭킹"] as const;

function Ranking() {
  const typeToast = useTypeToast();
  const { data: session } = useSession();

  const [usersRanking, setUsersRanking] = useState<IUserRankings>({ users: [], mine: null });
  const [tabValue, setTabValue] = useState<"전체 랭킹" | "내 통계">("전체 랭킹");
  const [filterOptions, setFilterOptions] = useState<{
    category: (typeof categoryArr)[number];
    isLocationFilter: boolean;
  }>({
    category: "활동 랭킹",
    isLocationFilter: false,
  });

  const { data: userInfo } = useUserInfoQuery();

  const { data: attendRecords, isLoading } = useUserAttendRateQuery(
    dayjs().startOf("month"),
    dayjs(),
    false,
    true,
    filterOptions.isLocationFilter ? null : session?.user.location,
    {
      onError: () => typeToast("error"),
      enabled: true && !!session,
    },
  );

  const { data: usersAll } = useAdminUsersLocationControlQuery(
    filterOptions.isLocationFilter ? null : session?.user.location,
    "score",
    true,
    {
      enabled: !!session,
    },
  );

  useEffect(() => {
    if (filterOptions.category !== "스터디 랭킹") {
      const rankingUsers = attendRecords.map((record) => ({
        ...record.userSummary,
        cnt: record.cnt,
      }));
      // sortUserRanking(rankingUsers, session?.user.uid);
    }

    // if (categoryIdx !== 2) {
    //   if (attendRecords) setUsersRanking(sortUserRanking(attendRecords, session?.user.uid));
    // } else {
    //   if (usersAll) setUsersRanking(sortUserScoreRanking(usersAll, userInfo.score));
    // }
  }, [attendRecords, filterOptions, usersAll]);
  console.log(usersAll);

  return (
    <>
      <Header title="ABOUT 랭킹" />
      <Slide>
        {/* <Layout>
          <RankingOverview
            totalCnt={usersRanking?.users.length}
            myRankInfo={usersRanking?.mine}
            isScore={categoryIdx === 2}
          />
          {usersRanking && (
            <>
              <StatisticsTabNav setTabValue={setTabValue} />
              {tabValue === "전체 랭킹" ? (
                <>
                  <StatisticsFilterBar setFilterOptions={setFilterOptions} />
                  <Box
                    h="calc(100vh - 358px)"
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
        </Layout> */}
      </Slide>
    </>
  );
}

const Layout = styled.div`
  overflow-y: auto;

  display: flex;
  flex-direction: column;
`;

export default Ranking;
