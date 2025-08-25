import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";

import Select from "../../../components/atoms/Select";
import { DispatchType } from "../../../types/hooks/reactTypes";
import { StudySortedOption } from "../StudyPagePlaceSection";

interface StudyPagePlaceSectionFilterBarProps {
  placeCnt: number;
  sortedOption: StudySortedOption;
  setSortedOption: DispatchType<StudySortedOption>;
  date: string;
}

function StudyPagePlaceSectionFilterBar({
  placeCnt,
  sortedOption,
  setSortedOption,
  date,
}: StudyPagePlaceSectionFilterBarProps) {
  const sortedOptionArr: StudySortedOption[] = ["날짜순", "거리순", "인원순"];

  const lastStudyHours = dayjs(date).hour(9).startOf("hour").diff(dayjs(), "m");

  return (
    <Flex justify="space-between" lineHeight="16px" my={4}>
      <Flex fontSize="12px">
        <Box mr={1}>{dayjs(date).startOf("day").isBefore(dayjs()) ? "진행" : "예정"} 스터디</Box>
        <b>{placeCnt}개</b>
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
        <Flex fontSize="11px" color="gray.600" fontWeight="medium">
          <ClockIcon />
          <Box as="span" mx={0.5}>
            매칭까지
          </Box>
          <Box as="span" color="gray.600" fontWeight="semibold">
            {Math.floor(lastStudyHours / 60)}시간 {Math.floor(lastStudyHours % 60)}분
          </Box>
        </Flex>
      )}
    </Flex>
  );
}

function ClockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="14px"
      viewBox="0 -960 960 960"
      width="14px"
      fill="var(--gray-600)"
    >
      <path d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z" />
    </svg>
  );
}

export default StudyPagePlaceSectionFilterBar;
