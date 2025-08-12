import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";

import Select from "../../../components/atoms/Select";
import { PopOverIcon } from "../../../components/Icons/PopOverIcon";
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
        <Box mr={1}>개설된 스터디</Box>
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
        <Flex fontSize="11px" color="gray.600">
          <PopOverIcon
            text="20분 이내 위치에, 3명 이상의 멤버가 신청한 경우 매칭됩니다."
            type="info"
          />
          <Box as="span" mr="2px" ml={1}>
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
