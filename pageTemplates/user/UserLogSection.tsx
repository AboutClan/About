import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import Image from "next/image";
import { useState } from "react";
import Select from "../../components/atoms/Select";
import TabNav, { ITabNavOptions } from "../../components/molecules/navs/TabNav";
import { usePointSystemLogQuery, useUserInfoQuery } from "../../hooks/user/queries";
import { dayjsToFormat, dayjsToStr } from "../../utils/dateTimeUtils";

interface UserLogSectionProps {}

function UserLogSection({}: UserLogSectionProps) {
  const [tab, setTab] = useState<"score" | "point" | "deposit">("score");
  const [filter, setFilter] = useState("시간 순");

  const { data: userInfo } = useUserInfoQuery();

  const { data: logsData } = usePointSystemLogQuery(tab);

  const options: ITabNavOptions[] = [
    { text: "동아리 점수", func: () => setTab("score") },
    { text: "포인트", func: () => setTab("point") },
    { text: "보증금", func: () => setTab("deposit") },
  ];

  let stepDate: string;
  console.log(logsData);
  return (
    <Box>
      <Box px={5} mb={2} borderBottom="var(--border)">
        <TabNav tabOptionsArr={options} isFullSize isBlack />
      </Box>
      <Box px={5}>
        <Box py={3}>
          <Box fontSize="11px">
            {userInfo?.name.slice(1)}님의 보유{" "}
            {tab === "score" ? "점수" : tab === "point" ? "포인트" : "보증금"}
          </Box>
          <Box fontSize="20px" fontWeight="semibold">
            {userInfo?.[tab]}
            {tab === "score" ? "점" : tab === "point" ? " Point" : "원"}
          </Box>
        </Box>
        <Box fontWeight="regular" fontSize="12px" lineHeight="16px" color="gray.400">
          Transaction History
        </Box>
        <Flex mt={1} justify="space-between">
          <Box fontWeight="semibold" fontSize="18px" lineHeight="28px">
            재화 사용 기록
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
        {logsData?.map((log) => {
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
                >
                  {dayjsToFormat(dayjs(log.timestamp).locale("ko"), "M월 D일 (ddd)")}
                </Box>
                <Block
                  text={log.message}
                  time={dayjsToFormat(dayjs(timeStr), "HH:mm")}
                  iconType="store"
                  value={log.meta.value}
                  currentValue={userInfo?.[tab]}
                  type={tab}
                />
              </>
            );
          } else {
            return (
              <Block
                text={log.message}
                time={dayjsToFormat(timeStamp, "HH:mm")}
                iconType="store"
                value={log.meta.value}
                currentValue={userInfo?.[tab]}
                type={tab}
              />
            );
          }
        })}
      </Box>
    </Box>
  );
}

interface BlockProps {
  text: string;
  time: string;
  iconType: "store";
  value: number;
  currentValue: number;
  type: "score" | "point" | "deposit";
}

const Block = ({ text, time, iconType, value, currentValue, type }: BlockProps) => {
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
          bgColor={"var(--color-gray)"}
          borderRadius="50%"
        ></Box>
        <Image
          src={
            "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%95%84%EC%9D%B4%EC%BD%98/%EA%B9%83%EB%B0%9C2.png"
          }
          width={36}
          height={36}
          alt={"test"}
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
};

export default UserLogSection;
