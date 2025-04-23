import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import Image from "next/image";
import { useState } from "react";

import Select from "../../components/atoms/Select";
import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
import { usePointSystemLogQuery, useUserInfoQuery } from "../../hooks/user/queries";
import { dayjsToFormat, dayjsToStr } from "../../utils/dateTimeUtils";

function UserLogSection() {
  const { data: userInfo } = useUserInfoQuery();

  const { data: logsData } = usePointSystemLogQuery("point");

  const [filter, setFilter] = useState();
  console.log(filter);

  let stepDate: string;

  return (
    <>
      <Header title="포인트 기록" />
      <Slide isNoPadding>
        <Box px={5} mt={16}>
          <Flex align="center" justify="space-between">
            <Box py={3}>
              <Box fontSize="11px">{userInfo?.name.slice(1)}님의 보유 포인트</Box>
              <Box fontSize="20px" fontWeight="semibold">
                {userInfo?.point} Point
              </Box>
            </Box>
            <Select
              options={["시간 순", "준비중"]}
              defaultValue="시간 순"
              setValue={setFilter}
              size="xs"
            />
          </Flex>
        </Box>
        <Box>
          {logsData?.map((log, idx) => {
            const timeStamp = dayjs(log.timestamp);
            const timeStr = dayjsToStr(timeStamp);

            if (!stepDate || timeStr !== stepDate) {
              const isFirst = !stepDate;
              stepDate = timeStr;
              return (
                <>
                  <Box
                    mt={!isFirst && 5}
                    pt={5}
                    borderTop={!isFirst && "var(--border-main)"}
                    fontSize="11px"
                    lineHeight="12px"
                    color="gray.500"
                    px={5}
                    key={idx}
                  >
                    {dayjsToFormat(dayjs(log.timestamp).locale("ko"), "M월 D일 (ddd)")}
                  </Box>
                  <Block
                    text={log.message}
                    time={dayjsToFormat(timeStamp, "HH:mm")}
                    value={log.meta.value}
                    currentValue={userInfo?.point}
                    type="point"
                  />
                </>
              );
            } else {
              return (
                <Block
                  text={log.message}
                  time={dayjsToFormat(timeStamp, "HH:mm")}
                  value={log.meta.value}
                  currentValue={userInfo?.point}
                  type="point"
                  key={idx}
                />
              );
            }
          })}
        </Box>
      </Slide>
    </>
  );
}

interface BlockProps {
  text: string;
  time: string;
  value: number;
  currentValue: number;
  type: "score" | "point" | "deposit";
}

function Block({ text, time, value, currentValue, type }: BlockProps) {
  const valueText = type === "point" ? " Point" : type === "score" ? "점" : "원";

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
          {value} {valueText}
        </Box>
        <Box color="gray.500" fontSize="11px" lineHeight="12px">
          {currentValue}
          {valueText}
        </Box>
      </Box>
    </Flex>
  );
}

export default UserLogSection;
