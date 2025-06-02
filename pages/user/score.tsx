import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import styled from "styled-components";

import { MainLoading } from "../../components/atoms/loaders/MainLoading";
import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
import SummaryTable from "../../components/organisms/tables/SummaryTable";
import { usePointSystemLogQuery, usePointSystemQuery } from "../../hooks/user/queries";

function ScoreLog() {
  const { data: session } = useSession();
  const { data: score } = usePointSystemQuery("score");
  const { data: scoreLog } = usePointSystemLogQuery("score");

  const isGuest = session?.user.role === "guest";
  const filterLog = scoreLog?.filter((item) => item.meta.value);

  const headerInfos = ["날짜", "내용", "점수"];
  const tableInfosArr = filterLog?.map((log) => [
    dayjs(log.timestamp).format("M.DD"),
    log.message,
    log.meta.value + "",
  ]);

  return (
    <>
      <Header title="동아리 점수 기록" />
      <Slide>
        <Layout>
          {!isGuest &&
            (score && scoreLog ? (
              <>
                {/* <PointScoreBar /> */}
                {/* <EventBadge /> */}
                <Box mt={3} border="var(--border)" rounded="md" minHeight="calc(100vh - 176px)">
                  <SummaryTable headerInfos={headerInfos} tableInfosArr={tableInfosArr} size="lg" />
                </Box>
              </>
            ) : (
              <MainLoading />
            ))}
        </Layout>
      </Slide>
    </>
  );
}

const Layout = styled.div`
  display: flex;
  flex-direction: column;

  margin-top: var(--gap-5);
  font-weight: 600;
  min-height: 100dvh;
`;

export default ScoreLog;
