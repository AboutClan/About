import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import styled from "styled-components";

import RuleIcon from "../../components/atoms/Icons/RuleIcon";
import { MainLoadingAbsolute } from "../../components/atoms/loaders/MainLoading";
import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
import { useAdminUsersLocationControlQuery } from "../../hooks/admin/quries";
import { useTypeToast } from "../../hooks/custom/CustomToast";
import { useUserAttendRateQuery } from "../../hooks/user/sub/studyRecord/queries";
import { IUserRankings, sortUserRanking } from "../../libs/userEventLibs/userHelpers";
import RuleModal, { IRuleModalContent } from "../../modals/RuleModal";
import RankingMembers from "../../pageTemplates/ranking/RankingMembers";
import RankingOverview from "../../pageTemplates/ranking/RankingOverview";
import StatisticsFilterBar from "../../pageTemplates/ranking/StatisticsFilterBar";
import StatisticsMine from "../../pageTemplates/ranking/StatisticsMine";
import StatisticsTabNav from "../../pageTemplates/ranking/StatisticsTabNav";

export type RankingCategoryProp = "활동 랭킹" | "스터디 랭킹" | "누적 랭킹";
export type RankingCategorySource = "monthScore" | "cnt" | "score";

const CATEGORY_ARR: RankingCategoryProp[] = ["활동 랭킹", "스터디 랭킹", "누적 랭킹"];

const CATEGORY_SOURCE: { [key in RankingCategoryProp]: RankingCategorySource } = {
  "활동 랭킹": "monthScore",
  "스터디 랭킹": "cnt",
  "누적 랭킹": "score",
};

export interface RankingFilterOptionProps {
  category: RankingCategoryProp;
  isLocationFilter: boolean;
}

const CONTENT: IRuleModalContent = {
  headerContent: {
    title: "ABOUT 랭킹",
    text: "동아리 내의 랭킹 또는 내 통계를 확인할 수 있습니다.",
  },
  mainContent: [
    {
      title: "카테고리 설명",
      texts: [
        "활동 랭킹은 이번 달 동아리 활동 점수입니다. 매달 초기화 됩니다.",
        "스터디 랭킹은 이번 달 스터디 참여 횟수입니다. 매달 초기화 됩니다.",
        "누적 랭킹은 동아리 점수입니다. 등급을 나타내는 지표입니다.",
      ],
    },
    {
      title: "메달",
      texts: ["공개 예정 컨텐츠"],
    },
  ],
};

function Ranking() {
  const typeToast = useTypeToast();
  const { data: session } = useSession();

  const [usersRanking, setUsersRanking] = useState<IUserRankings>({ users: [], mine: null });
  const [tabValue, setTabValue] = useState<"전체 랭킹" | "내 통계">("전체 랭킹");
  const [filterOptions, setFilterOptions] = useState<RankingFilterOptionProps>({
    category: "활동 랭킹",
    isLocationFilter: false,
  });
  const [isModal, setIsModal] = useState(false);

  const categorySource = CATEGORY_SOURCE[filterOptions.category];

  const { data: attendRecords } = useUserAttendRateQuery(
    dayjs().startOf("month"),
    dayjs(),
    false,
    true,
    !filterOptions.isLocationFilter ? null : session?.user.location,
    {
      onError: () => typeToast("error"),
      enabled: filterOptions.category === "스터디 랭킹" && !!session,
    },
  );

  const { data: usersAll } = useAdminUsersLocationControlQuery(
    !filterOptions.isLocationFilter ? null : session?.user.location,
    categorySource,
    true,
    {
      enabled: !!session,
    },
  );

  useEffect(() => {
    if (filterOptions.category === "스터디 랭킹" && !attendRecords) return;
    if (filterOptions.category !== "스터디 랭킹" && !usersAll) return;

    const users =
      filterOptions.category !== "스터디 랭킹"
        ? usersAll
        : attendRecords.map((record) => ({
            ...record.userSummary,
            cnt: record.cnt,
          }));

    setUsersRanking(sortUserRanking(users, categorySource, session?.user.uid));
  }, [session?.user, attendRecords, filterOptions, usersAll]);

  return (
    <>
      <Header title="ABOUT 랭킹">
        <RuleIcon setIsModal={setIsModal} />
      </Header>
      <Slide>
        <Layout>
          <RankingOverview myRankInfo={usersRanking?.mine} />

          <StatisticsTabNav setTabValue={setTabValue} />
          {tabValue === "전체 랭킹" ? (
            <>
              <StatisticsFilterBar
                setUsersRanking={setUsersRanking}
                filterOption={filterOptions}
                categoryArr={CATEGORY_ARR}
                setFilterOption={setFilterOptions}
              />
              <Box
                h="calc(100vh - 364px)"
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
          ) : (
            <StatisticsMine />
          )}
        </Layout>
      </Slide>
      {isModal && <RuleModal content={CONTENT} setIsModal={setIsModal} />}
    </>
  );
}

const Layout = styled.div`
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

export default Ranking;
