import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";

import Select from "../../../components/atoms/Select";
import { DispatchType } from "../../../types/hooks/reactTypes";

type SortedOption = "인원순" | "거리순";

interface StudyPagePlaceSectionFilterBarProps {
  placeCnt: number;
  sortedOption: SortedOption;
  setSortedOption: DispatchType<SortedOption>;
  date: string;
}

function StudyPagePlaceSectionFilterBar({
  placeCnt,
  sortedOption,
  setSortedOption,
  date,
}: StudyPagePlaceSectionFilterBarProps) {
  const sortedOptionArr: SortedOption[] = ["인원순", "거리순"];

  const lastStudyHours = dayjs(date).subtract(1, "day").hour(23).startOf("hour").diff(dayjs(), "m");

  return (
    <Flex justify="space-between" lineHeight="16px" my={4}>
      <Flex fontSize="12px">
        {lastStudyHours <= -1440 ? (
          <>
            <Box mr={1}>진행된 스터디</Box>
            <b>{placeCnt}개</b>
          </>
        ) : lastStudyHours <= 0 ? (
          <>
            <Box mr={1}>진행중인 스터디</Box>
            <b>{placeCnt}개</b>
          </>
        ) : (
          <Flex>
            <Box mr={1}>오픈 예정 스터디</Box>
            <b>{placeCnt}개</b>
          </Flex>
        )}
      </Flex>
      {lastStudyHours <= 0 ? (
        <Select
          options={sortedOptionArr}
          defaultValue={sortedOption}
          size="xs"
          setValue={setSortedOption}
          isBorder={false}
        />
      ) : (
        <Flex fontSize="11px" color="gray.600">
          <Box as="span" mr="2px">
            매칭까지 남은 시간:
          </Box>
          <Box as="span" fontWeight="semibold">
            {Math.floor(lastStudyHours / 60)}시간 {Math.floor(lastStudyHours % 60)}분
          </Box>
        </Flex>
      )}
    </Flex>
  );
}

export default StudyPagePlaceSectionFilterBar;
