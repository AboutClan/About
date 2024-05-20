import "dayjs/locale/ko";

import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";

import { dayjsToFormat } from "../../utils/dateTimeUtils";
import DatePointButton from "../molecules/DatePointButton";

interface CalendarDayBoxProps {
  date: string;
  func: (date: number) => void;
  selectedDate: string;
  pointType?: "mint";
}

function CalendarDayBox({ date, func, selectedDate, pointType }: CalendarDayBoxProps) {
  const dayjsDate = dayjs(date);
  return (
    <Flex direction="column">
      <Box textAlign="center">{dayjsToFormat(dayjsDate, "ddd")}</Box>
      <DatePointButton
        date={dayjsDate.date()}
        func={() => func(dayjsDate.date())}
        isSelected={date === selectedDate}
        pointType={pointType}
      />
    </Flex>
  );
}

export default CalendarDayBox;
