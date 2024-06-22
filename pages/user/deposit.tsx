import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import styled from "styled-components";

import DiffTwoBlockCol from "../../components/atoms/blocks/DiffTwoBlockCol";
import { MainLoading } from "../../components/atoms/loaders/MainLoading";
import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
import SummaryTable from "../../components/organisms/tables/SummaryTable";
import { usePointSystemLogQuery, usePointSystemQuery } from "../../hooks/user/queries";

function DepositLog() {
  const { data: session } = useSession();
  const { data: deposit } = usePointSystemQuery("deposit");
  const { data: depositLog } = usePointSystemLogQuery("deposit");

  const filterLog = depositLog?.filter((item) => item.meta.value);

  const isGuest = session?.user.role === "guest";
  const headerInfos = ["날짜", "내용", "점수"];
  const tableInfosArr = filterLog?.map((log) => [
    dayjs(log.timestamp).format("M.DD"),
    log.message,
    log.meta.value + "",
  ]);

  return (
    <>
      <Header title="보증금 기록" />
      <Slide>
        <Layout>
          {!isGuest &&
            (deposit && depositLog ? (
              <>
                <Flex justify="space-between" mb="16px">
                  <DiffTwoBlockCol subText="내 보증금" text={`${deposit}원`} />
                </Flex>
                <Box border="var(--border)" rounded="md" minHeight="calc(100vh - 176px)">
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
  margin: 0 var(--gap-4);
  margin-top: var(--gap-5);
  font-weight: 600;
  min-height: 100dvh;
`;

export default DepositLog;
