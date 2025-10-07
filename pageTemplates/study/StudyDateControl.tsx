import { Box, Flex } from "@chakra-ui/react";
import dayjs, { Dayjs } from "dayjs";

import { DispatchType } from "../../types/hooks/reactTypes";
import { dayjsToFormat, getHour } from "../../utils/dateTimeUtils";

function StudyDateControl({ date, setDate }: { date: Dayjs; setDate: DispatchType<Dayjs> }) {
  const leftMinDayjs = dayjs().add(getHour() < 9 ? 0 : 1, "day");
  const rightMaxDayjs = dayjs().add(getHour() < 9 ? 6 : 7, "day");

  return (
    <Flex
      my={3}
      justify="center"
      align="center"
      fontSize="16px"
      fontWeight={800}
      alignItems="center"
      color="gray.800"
    >
      <Box as="button" px={1} onClick={() => setDate((old) => old.subtract(1, "day"))}>
        <LeftArrowIcon isActive={date.isAfter(leftMinDayjs)} />
      </Box>
      <Box>{dayjsToFormat(date, "M월 D일")}</Box>
      <Box as="button" px={1} onClick={() => setDate((old) => old.add(1, "day"))}>
        <RightArrowIcon isActive={date.isBefore(rightMaxDayjs)} />
      </Box>
    </Flex>
  );
}

function LeftArrowIcon({ isActive }: { isActive: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="28px"
      viewBox="0 -960 960 960"
      width="28px"
      fill={isActive ? "var(--gray-900)" : "var(--gray-500)"}
    >
      <path d="M526-314 381-459q-5-5-7-10t-2-11q0-6 2-11t7-10l145-145q3-3 6.5-4.5t7.5-1.5q8 0 14 5.5t6 14.5v304q0 9-6 14.5t-14 5.5q-2 0-14-6Z" />
    </svg>
  );
}

function RightArrowIcon({ isActive }: { isActive: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="28px"
      viewBox="0 -960 960 960"
      width="28px"
      fill={isActive ? "var(--gray-900)" : "var(--gray-500)"}
    >
      <path d="M420-308q-8 0-14-5.5t-6-14.5v-304q0-9 6-14.5t14-5.5q2 0 14 6l145 145q5 5 7 10t2 11q0 6-2 11t-7 10L434-314q-3 3-6.5 4.5T420-308Z" />
    </svg>
  );
}

export default StudyDateControl;
