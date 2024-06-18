import { Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import Link from "next/link";
import styled from "styled-components";

import DiffTwoBlockCol from "../../components/atoms/blocks/DiffTwoBlockCol";
import { MainLoading } from "../../components/atoms/loaders/MainLoading";
import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
import SummaryTable from "../../components/organisms/tables/SummaryTable";
import { usePointSystemLogQuery, usePointSystemQuery } from "../../hooks/user/queries";

function PointLog() {
  const { data: point } = usePointSystemQuery("point");
  const { data: pointLog } = usePointSystemLogQuery("point");

  const filterLog = pointLog?.filter((item) => item.meta.value);

  const headerInfos = ["날짜", "내용", "점수"];
  const tableInfosArr = filterLog?.map((log) => [
    dayjs(log.timestamp).format("M.DD"),
    log.message,
    log.meta.value + "",
  ]);

  return (
    <>
      <Header title="포인트 기록" />
      <Slide>
        <Layout>
          {point && pointLog ? (
            <>
              <Flex justify="space-between" mb="16px">
                <DiffTwoBlockCol subText="내 포인트" text={`${point} POINT`} />
                <Link href="/store">
                  <Button colorScheme="mintTheme">스토어로 이동</Button>
                </Link>
              </Flex>
              <Box border="var(--border)" rounded="md" minHeight="calc(100vh - 176px)">
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
  margin: 0 var(--gap-4);
  margin-top: var(--gap-5);
  font-weight: 600;
  min-height: 100dvh;
`;

export default PointLog;
