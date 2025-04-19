import { Box, Flex, Tooltip } from "@chakra-ui/react";
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

  const lastStudyHours = dayjs(date).hour(9).startOf("hour").diff(dayjs(), "m");

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
            <b>{placeCnt - 1}개</b>
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
          <Tooltip
            label="20분 이내 거리에 신청자가 3명 이상 있는 경우 매칭됩니다."
            fontSize="md"
            mr={2}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 20 20"
              fill="none"
            >
              <g clipPath="url(#clip0_2444_1052)">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10 7.66671C9.73479 7.66671 9.48044 7.56135 9.2929 7.37381C9.10537 7.18628 9.00001 6.93192 9.00001 6.66671C9.00001 6.40149 9.10537 6.14714 9.2929 5.9596C9.48044 5.77206 9.73479 5.66671 10 5.66671C10.2652 5.66671 10.5196 5.77206 10.7071 5.9596C10.8947 6.14714 11 6.40149 11 6.66671C11 6.93192 10.8947 7.18628 10.7071 7.37381C10.5196 7.56135 10.2652 7.66671 10 7.66671ZM10.8333 13.8625C10.8333 14.0836 10.7455 14.2955 10.5893 14.4518C10.433 14.6081 10.221 14.6959 10 14.6959C9.779 14.6959 9.56704 14.6081 9.41076 14.4518C9.25447 14.2955 9.16668 14.0836 9.16668 13.8625V9.69587C9.16668 9.47486 9.25447 9.2629 9.41076 9.10662C9.56704 8.95034 9.779 8.86254 10 8.86254C10.221 8.86254 10.433 8.95034 10.5893 9.10662C10.7455 9.2629 10.8333 9.47486 10.8333 9.69587V13.8625ZM10 0.833374C4.93751 0.833374 0.833344 4.93754 0.833344 10C0.833344 15.0625 4.93751 19.1667 10 19.1667C15.0625 19.1667 19.1667 15.0625 19.1667 10C19.1667 4.93754 15.0625 0.833374 10 0.833374Z"
                  fill="var(--color-icon)"
                />
              </g>
              <defs>
                <clipPath id="clip0_2444_1052">
                  <rect width="20" height="20" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </Tooltip>
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
