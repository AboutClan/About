import "dayjs/locale/ko";

import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";

import { dayjsToFormat, dayjsToStr } from "../../utils/dateTimeUtils";
import DatePointButton from "../molecules/DatePointButton";

interface CalendarDayBoxProps {
  date: string;
  value: number;
  func: (date: string) => void;
  selectedDate: string;
  pointType?: "mint";
}

function CalendarDayBox({ date, value, func, selectedDate, pointType }: CalendarDayBoxProps) {
  const dayjsDate = dayjs(date);
  return (
    <Flex direction="column" align="center" w="48px">
      <Box
        px="6px"
        fontSize="12px"
        textAlign="center"
        mb="4px"
        color={
          dayjsDate.day() === 0
            ? "var(--color-red)"
            : dayjsDate.day() === 6
              ? "var(--color-blue)"
              : "var(--gray-800)"
        }
      >
        {dayjsToFormat(dayjsDate, "ddd")}
      </Box>
      <DatePointButton
        date={dayjsToStr(dayjsDate)}
        value={value}
        func={() => func(dayjsToStr(dayjsDate))}
        isSelected={date === selectedDate}
        pointType={pointType}
      />
    </Flex>
  );
}

export default CalendarDayBox;
