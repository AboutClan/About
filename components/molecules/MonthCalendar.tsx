import { Box, Flex, Grid } from "@chakra-ui/react";
import dayjs from "dayjs";

import { dayjsToStr, getCalendarDates } from "../../utils/dateTimeUtils";
import DatePointButton from "./DatePointButton";

interface CalendarProps {
  selectedDate: string;
  standardDate: string;
  func: (date: string) => void;
}

const DAY = ["일", "월", "화", "수", "목", "금", "토"];

function MonthCalendar({ standardDate, selectedDate, func }: CalendarProps) {
  const calendarArr = getCalendarDates("month", dayjs(standardDate));

  return (
    <>
      <Flex mb="12px">
        {DAY.map((day) => (
          <Box
            fontSize="13px"
            flex={1}
            textAlign="center"
            key={day}
            color={
              day === "일"
                ? "var(--color-red)"
                : day === "토"
                ? "var(--color-blue)"
                : "var(--gray-800)"
            }
          >
            {day}
          </Box>
        ))}
      </Flex>
      <Grid templateColumns="repeat(7,1fr)" rowGap="6px" color="gray.800">
        {calendarArr.map((item, idx) => {
          return (
            <Box key={idx}>
              <DatePointButton
                date={item ? dayjsToStr(dayjs(item.date)) : null}
                func={item ? () => func(dayjsToStr(dayjs(item.date))) : null}
                isSelected={item && dayjsToStr(dayjs(item.date)) === selectedDate}
                pointType="mint"
                isDisabled={item?.isDisabled}
              />
            </Box>
          );
        })}
      </Grid>
    </>
  );
}

export default MonthCalendar;
