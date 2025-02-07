import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";

import Select from "../../../components/atoms/Select";
import { DispatchType } from "../../../types/hooks/reactTypes";

interface StudyPageDrawerFilterBarProps {
  placeCnt: number;

  selectOption: "인원순" | "거리순" | "선호순";
  setSelectOption: DispatchType<"인원순" | "거리순" | "선호순">;
  isStudyCompleted: boolean;
  date: string;
}

function StudyPageDrawerFilterBar({
  placeCnt,
  selectOption,
  setSelectOption,
  isStudyCompleted,
  date,
}: StudyPageDrawerFilterBarProps) {
  const selectOptionArr = ["인원순", "거리순", "선호순"];
  console.log(date);
  return (
    <Flex justify="space-between" lineHeight="16px" my={4}>
      <Box fontSize="12px">
        {isStudyCompleted ? (
          <>
            전체 <b>{placeCnt}개</b>
          </>
        ) : (
          <Flex>
            <Box mr={1}>오픈 예정 스터디</Box>
            <b>3개</b>
          </Flex>
        )}
      </Box>
      {isStudyCompleted ? (
        <Select
          options={selectOptionArr}
          defaultValue={selectOption}
          size="xs"
          setValue={setSelectOption}
          isBorder={false}
        />
      ) : (
        <Flex fontSize="11px" color="gray.600">
          <Box as="span" mr="2px">
            매칭까지 남은 시간:
          </Box>
          <Box as="span" fontWeight="semibold">
            {Math.floor(dayjs(date).diff(dayjs(), "m") / 60)}시간{" "}
            {Math.floor(dayjs(date).diff(dayjs(), "m") % 60)}분
          </Box>
        </Flex>
      )}
    </Flex>
  );
}

export default StudyPageDrawerFilterBar;
