import "dayjs/locale/ko";

import { Box, Button } from "@chakra-ui/react";
import dayjs from "dayjs";

import { dayjsToFormat } from "../../utils/dateTimeUtils";

interface CalendarDayBoxProps {
  date: string;
  value: number;
  func: (date: string) => void;
  selectedDate: string;
}

function CalendarDayBox({ date, value, func, selectedDate }: CalendarDayBoxProps) {
  const dayjsDate = dayjs(date);
  const isSelected = date === selectedDate;
  return (
    <Button
      variant="unstyled"
      display="flex"
      w="38px"
      py="6px"
      h="54px"
      justifyContent="space-between"
      flexDirection="column"
      alignItems="center"
      borderRadius={isSelected ? "12px" : 0}
      bgColor={isSelected ? "var(--color-mint)" : "inherit"}
      opacity={
        isSelected ? 1 : dayjs(date).isBefore(dayjs(selectedDate)) ? "0.4" : "var(--gray-800)"
      }
      onClick={() => func(date)}
    >
      <Box
        px="6px"
        fontSize="12px"
        textAlign="center"
        fontWeight={400}
        color={
          isSelected
            ? "white"
            : dayjsDate.day() === 0
              ? "var(--color-red)"
              : dayjsDate.day() === 6
                ? "var(--color-blue)"
                : "var(--gray-500)"
        }
      >
        {dayjsToFormat(dayjsDate, "ddd")}
      </Box>
      <Box fontSize="13px" fontWeight={500} color={isSelected ? "white" : "var(--gray-800)"}>
        {value}
      </Box>
      {/* <DatePointButton
        date={dayjsToStr(dayjsDate)}
        value={value}
        func={() => func(dayjsToStr(dayjsDate))}
        isSelected={date === selectedDate}
        pointType={pointType}
      /> */}
    </Button>
  );
}

export default CalendarDayBox;
