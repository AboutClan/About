import { Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import Image from "next/image";
import { Fragment, useState } from "react";

import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import BottomFlexDrawer from "../../../components/organisms/drawer/BottomFlexDrawer";
import { useToast } from "../../../hooks/custom/CustomToast";
import { usePointSystemMutation, useUserTicketMutation } from "../../../hooks/user/mutations";
import { useTicketSystemLogQuery, useUserInfoQuery } from "../../../hooks/user/queries";
import { dayjsToFormat, dayjsToStr } from "../../../utils/dateTimeUtils";

function GatherTicketLogSection() {
  const toast = useToast();
  const { data: userInfo, refetch: refetch2 } = useUserInfoQuery();

  const [isModal, setIsModal] = useState(false);
  const { data: logsData, refetch } = useTicketSystemLogQuery("gather");

  const { mutate: updatePoint } = usePointSystemMutation("point");
  const { mutate, isLoading } = useUserTicketMutation({
    onSuccess() {
      toast("success", "티켓이 추가되었습니다.");
      setIsModal(false);
      refetch();
      refetch2();
    },
  });

  let stepDate: string;

  const handleBuyTicket = () => {
    if (userInfo?.temperature?.temperature < 38) {
      toast("info", "소셜링 온도 38°C 이상의 멤버만 구매 가능합니다.");
      return;
    }
    if (userInfo?.point < 7000) {
      toast("info", "포인트가 부족합니다. 구매 후 잔액이 5,000 Point 이상이어야 합니다.");
      return;
    }
    mutate({ ticketNum: 1, type: "gather" });
    updatePoint({
      value: -2000,
      message: "번개 참여권 구매",
      sub: "ticket",
    });
  };

  return (
    <>
      <Header title="번개 참여권 사용 기록" />
      <Slide isNoPadding>
        <Box mt="56px">
          <Flex px={5} justify="space-between" align="center">
            <Box py={4}>
              <Box fontSize="11px">{userInfo?.name.slice(1)}님의 보유 티켓</Box>
              <Box fontSize="20px" fontWeight="semibold">
                {userInfo?.ticket?.gatherTicket}개
              </Box>
            </Box>

            <Button colorScheme="mint" size="md" onClick={() => setIsModal(true)}>
              <div>참여권 구매하기</div>
            </Button>
          </Flex>
          <Box>
            {logsData
              ?.slice()
              ?.reverse()
              .map((log, idx) => {
                const timeStamp = dayjs(log.timestamp);
                const timeStr = dayjsToStr(timeStamp);

                if (!stepDate || timeStr !== stepDate) {
                  const isFirst = !stepDate;
                  stepDate = timeStr;
                  return (
                    <Fragment key={idx}>
                      <Box
                        mt={!isFirst && 5}
                        pt={5}
                        borderTop={!isFirst && "var(--border-main)"}
                        fontSize="11px"
                        lineHeight="12px"
                        color="gray.500"
                        px={5}
                      >
                        {dayjsToFormat(dayjs(log.timestamp).locale("ko"), "M월 D일 (ddd)")}
                      </Box>
                      <Block
                        text={log.message}
                        time={dayjsToFormat(timeStamp, "HH:mm")}
                        iconType="store"
                        value={log.meta.value}
                      />
                    </Fragment>
                  );
                } else {
                  return (
                    <Block
                      text={log.message}
                      time={dayjsToFormat(timeStamp, "HH:mm")}
                      iconType="store"
                      value={log.meta.value}
                      key={idx}
                    />
                  );
                }
              })}
          </Box>
        </Box>
      </Slide>{" "}
      {isModal && (
        <BottomFlexDrawer
          isDrawerUp
          isOverlay
          height={400}
          isHideBottom
          setIsModal={() => setIsModal(false)}
        >
          <Box
            py={3}
            pb={0}
            lineHeight="32px"
            w="100%"
            fontWeight="semibold"
            fontSize="20px"
            textAlign="start"
          >
            번개 참여권을 구매하시겠어요?
          </Box>
          <Box color="gray.500" mr="auto" fontSize="12px">
            매월 1일에 참여권이 초기화 됩니다.
          </Box>
          <Box
            mr="auto"
            mt={3}
            fontWeight="extrabold"
            fontSize="20px"
            lineHeight="24px"
            color="mint"
            mb={8}
          >
            비용: 2,000 Point
          </Box>
          <Image
            src="https://studyabout.s3.ap-northeast-2.amazonaws.com/%EA%B8%B0%ED%83%80/%EB%B2%88%EA%B0%9C+%ED%8B%B0%EC%BC%932.png"
            alt="ticket1"
            width={120}
            height={120}
          />
          <Flex py={2} w="full" mt="auto">
            <Button
              color="mint"
              border="var(--border)"
              borderColor="mint"
              size="lg"
              mr={3}
              flex={1}
              onClick={() => setIsModal(false)}
            >
              취 소
            </Button>
            <Button
              onClick={() => {
                handleBuyTicket();
              }}
              size="lg"
              flex={1}
              colorScheme="mint"
              isLoading={isLoading}
            >
              구 매
            </Button>
          </Flex>
        </BottomFlexDrawer>
      )}
    </>
  );
}

interface BlockProps {
  text: string;
  time: string;
  iconType: "store";
  value: number;
}

function Block({ text, time, value }: BlockProps) {
  return (
    <Flex px={5} mt={4} justify="space-between" align="center">
      <Flex
        justify="center"
        align="center"
        w="48px"
        h="48px"
        borderRadius="50%"
        position="relative"
        mr={2}
      >
        <Box
          position="absolute"
          w="100%"
          h="100%"
          opacity={0.08}
          bgColor="var(--color-gray)"
          borderRadius="50%"
        ></Box>
        <Image
          src="https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%95%84%EC%9D%B4%EC%BD%98/%EA%B9%83%EB%B0%9C2.png"
          width={36}
          height={36}
          alt="test"
          priority
          style={{ width: "36px", height: "36px", objectFit: "contain" }}
        />
      </Flex>
      <Box flex={1}>
        <Box mb={1} fontWeight="bold" fontSize="14px" lineHeight="20px">
          {text}
        </Box>
        <Box color="gray.500" fontSize="11px" lineHeight="12px">
          {time}
        </Box>
      </Box>
      <Box textAlign="end">
        <Box mb={1} fontWeight="bold" fontSize="13px" lineHeight="20px" color="mint">
          {value > 0 && "+ "}
          {value}개
        </Box>
        {/* <Box color="gray.500" fontSize="11px" lineHeight="12px">
          {currentValue}개
        </Box> */}
      </Box>
    </Flex>
  );
}

export default GatherTicketLogSection;
