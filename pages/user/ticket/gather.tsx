import { Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";

import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import { useTicketSystemLogQuery, useUserInfoQuery } from "../../../hooks/user/queries";
import { dayjsToFormat, dayjsToStr } from "../../../utils/dateTimeUtils";

function GatherTicketLogSection() {
  const { data: userInfo } = useUserInfoQuery();

  const { data: logsData } = useTicketSystemLogQuery("gather");
  console.log(42, logsData);
  let stepDate: string;
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
            <Link href="/store">
              <Button colorScheme="mint" size="sm">
                <div>포인트 스토어</div>
                <div>
                  <i className="fa-solid fa-chevron-right" />
                </div>
              </Button>
            </Link>
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
      </Slide>
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
          {value > 0 && "+"}
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
