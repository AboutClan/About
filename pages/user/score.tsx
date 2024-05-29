import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import styled from "styled-components";

import { MainLoading } from "../../components/atoms/loaders/MainLoading";
import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
import SummaryTable from "../../components/organisms/tables/SummaryTable";
import { usePointSystemLogQuery, usePointSystemQuery } from "../../hooks/user/queries";

function ScoreLog() {
  const { data: point } = usePointSystemQuery("score");
  const { data: pointLog } = usePointSystemLogQuery("score");

  const filterLog = pointLog?.filter((item) => item.meta.value);

  const headerInfos = ["날짜", "내용", "점수"];
  const tableInfosArr = filterLog?.map((log) => [
    dayjs(log.timestamp).format("M.DD"),
    log.message,
    log.meta.value + "",
  ]);

  return (
    <>
      <Header title="동아리 점수 기록" />
      {point ? (
        <Slide>
          <Layout>
            <MyPoint>
              <span>내 점수</span>
              <i className="fa-solid fa-arrow-right" />
              <span>{point} 점</span>
            </MyPoint>
            <Box border="var(--border)" rounded="md" minHeight="calc(100vh - 176px)">
              {pointLog && (
                <SummaryTable headerInfos={headerInfos} tableInfosArr={tableInfosArr} size="lg" />
              )}
            </Box>
          </Layout>
        </Slide>
      ) : (
        <MainLoading />
      )}
    </>
  );
}

const Layout = styled.div`
  margin: 0 var(--gap-4);
  margin-top: var(--gap-5);
  font-weight: 600;
`;

const MyPoint = styled.div`
  padding: 0 var(--gap-2);
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 160px;
  height: 40px;
  border-radius: var(--rounded-lg);
  border: var(--border-mint);
  color: var(--gray-700);
  font-size: 14px;
  margin-bottom: 20px;
  > span:first-child {
    flex: 1;
  }
  > span:last-child {
    flex: 1;
    text-align: end;
    font-size: 15px;
    color: var(--gray-800);
    font-weight: 700;
  }
`;

export default ScoreLog;
