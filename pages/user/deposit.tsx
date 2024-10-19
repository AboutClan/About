import { Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useQueryClient } from "react-query";
import styled from "styled-components";

import DiffTwoBlockCol from "../../components/atoms/blocks/DiffTwoBlockCol";
import { MainLoading } from "../../components/atoms/loaders/MainLoading";
import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
import SummaryTable from "../../components/organisms/tables/SummaryTable";
import { USER_INFO, USER_POINT_SYSTEM } from "../../constants/keys/queryKeys";
import { useResetStudyQuery } from "../../hooks/custom/CustomHooks";
import { useToast } from "../../hooks/custom/CustomToast";
import { usePointSystemMutation } from "../../hooks/user/mutations";
import { usePointSystemLogQuery, useUserInfoQuery } from "../../hooks/user/queries";

function DepositLog() {
  const { data: session } = useSession();

  const { data: depositLog } = usePointSystemLogQuery("deposit");

  const filterLog = depositLog?.filter((item) => item.meta.value);

  const isGuest = session?.user.role === "guest";
  const headerInfos = ["날짜", "내용", "점수"];
  const tableInfosArr = filterLog?.map((log) => [
    dayjs(log.timestamp).format("M.DD"),
    log.message,
    log.meta.value + "",
  ]);
  const queryClient = useQueryClient();
  const toast = useToast();

  const { data: userInfo } = useUserInfoQuery();
  const deposit = userInfo?.deposit;
  useResetStudyQuery;
  const { mutate: getDeposit } = usePointSystemMutation("deposit", {
    onSuccess() {
      toast("success", "충전되었습니다");
      queryClient.invalidateQueries([USER_INFO]);
      queryClient.invalidateQueries({ queryKey: [USER_POINT_SYSTEM], exact: false });
    },
  });

  const onClick = () => {
    if (deposit >= 3000) {
      toast("info", "최대 금액입니다.");
      return;
    }
    getDeposit({ value: 3000 - deposit, message: "보증금 리필" });
  };

  return (
    <>
      <Header title="보증금 기록" />
      <Slide isNoPadding>
        <Layout>
          {!isGuest &&
            (deposit && depositLog ? (
              <>
                <Flex justify="space-between" mb="16px">
                  <DiffTwoBlockCol subText="내 보증금" text={`${deposit}원`} />
                  <Button colorScheme="mint" onClick={onClick}>
                    보증금 충전
                  </Button>
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
