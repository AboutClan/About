import { Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";

import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import PointGuideModalButton from "../../../components/modalButtons/PointGuideModalButton";
import IconRowBlock2 from "../../../components/molecules/IconRowBlock2";
import { usePointSystemLogQuery, useUserInfoQuery } from "../../../hooks/user/queries";
import { dayjsToFormat, dayjsToStr } from "../../../utils/dateTimeUtils";

function UserLogSection() {
  const { data: userInfo } = useUserInfoQuery();

  const { data: logsData } = usePointSystemLogQuery("point");

  let stepDate: string;
  let stepValue: number = userInfo?.point;

  return (
    <>
      <Header title="포인트 기록">
        <PointGuideModalButton type="store" />
      </Header>
      <Slide isNoPadding>
        <Box px={5} mt={16}>
          <Flex align="center" justify="space-between">
            <Box py={3}>
              <Box fontSize="11px">{userInfo?.name.slice(1)}님의 보유 포인트</Box>
              <Box fontSize="20px" fontWeight="semibold">
                {userInfo?.point} Point
              </Box>
            </Box>
            <Link href="/user/point/charge">
              <Button colorScheme="mint" size="md">
                <div>포인트 충전하기</div>
              </Button>
            </Link>
          </Flex>
        </Box>
        <Box mb={10}>
          {logsData?.map((log, idx) => {
            const timeStamp = dayjs(log.timestamp);
            const timeStr = dayjsToStr(timeStamp);

            if (!stepDate || timeStr !== stepDate) {
              const isFirst = !stepDate;
              stepDate = timeStr;
              const valueText = " Point";
              const value = log.meta.value;
              const block = (
                <Fragment key={idx + stepValue}>
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
                  <IconRowBlock2
                    text={log.message}
                    time={dayjsToFormat(timeStamp, "HH:mm")}
                    leftChildren={
                      <Image
                        src="https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%95%84%EC%9D%B4%EC%BD%98/%EA%B9%83%EB%B0%9C2.png"
                        width={36}
                        height={36}
                        alt="test"
                        priority
                        style={{ width: "36px", height: "36px", objectFit: "contain" }}
                      />
                    }
                    rightChildren={
                      <Box textAlign="end">
                        <Box
                          mb={1}
                          fontWeight="bold"
                          fontSize="13px"
                          lineHeight="20px"
                          color="mint"
                        >
                          {value > 0 && "+"}
                          {value} {valueText}
                        </Box>
                        <Box color="gray.500" fontSize="11px" lineHeight="12px">
                          {stepValue}
                          {valueText}
                        </Box>
                      </Box>
                    }
                  />
                </Fragment>
              );

              stepValue -= log.meta.value;
              return block;
            } else {
              const valueText = " Point";
              const value = log.meta.value;
              const block = (
                <IconRowBlock2
                  key={idx + stepValue}
                  text={log.message}
                  time={dayjsToFormat(timeStamp, "HH:mm")}
                  leftChildren={
                    <Image
                      src="https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%95%84%EC%9D%B4%EC%BD%98/%EA%B9%83%EB%B0%9C2.png"
                      width={36}
                      height={36}
                      alt="test"
                      priority
                      style={{ width: "36px", height: "36px", objectFit: "contain" }}
                    />
                  }
                  rightChildren={
                    <Box textAlign="end">
                      <Box mb={1} fontWeight="bold" fontSize="13px" lineHeight="20px" color="mint">
                        {value > 0 && "+"}
                        {value} {valueText}
                      </Box>
                      <Box color="gray.500" fontSize="11px" lineHeight="12px">
                        {stepValue}
                        {valueText}
                      </Box>
                    </Box>
                  }
                />
              );
              stepValue -= log.meta.value;
              return block;
            }
          })}
        </Box>
      </Slide>
    </>
  );
}

export default UserLogSection;
