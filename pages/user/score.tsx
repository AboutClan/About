import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import styled from "styled-components";

import { MainLoading } from "../../components/atoms/loaders/MainLoading";
import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
import SummaryTable from "../../components/organisms/tables/SummaryTable";
import { usePointSystemLogQuery, usePointSystemQuery } from "../../hooks/user/queries";
import EventBadge from "../../pageTemplates/event/EventBadge";
import PointScoreBar from "../../pageTemplates/point/pointScore/PointScoreBar";

function ScoreLog() {
  const { data: score } = usePointSystemQuery("score");
  const { data: scoreLog } = usePointSystemLogQuery("score");

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
          {score && scoreLog ? (
            <>
              <Box mx="16px">
                <PointScoreBar myScore={score} />
              </Box>
              <EventBadge />
              <Box
                mt="4px"
                mx="16px"
                border="var(--border)"
                rounded="md"
                minHeight="calc(100vh - 176px)"
              >
                <SummaryTable headerInfos={headerInfos} tableInfosArr={tableInfosArr} size="lg" />
              </Box>
            </>
          ) : (
            <MainLoading />
          )}
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
