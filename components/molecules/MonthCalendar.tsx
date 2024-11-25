import { Box, Flex, Grid } from "@chakra-ui/react";
import dayjs, { Dayjs } from "dayjs";

import { VoteCntProps } from "../../types/models/studyTypes/studyRecords";
import { dayjsToStr, getCalendarDates } from "../../utils/dateTimeUtils";
import DatePointButton from "./DatePointButton";

interface CalendarProps {
  voteCntArr: VoteCntProps[];
  selectedDate: Dayjs;
  standardDate: Dayjs;
  func: (date: string) => void;
}

const DAY = ["일", "월", "화", "수", "목", "금", "토"];

function MonthCalendar({ standardDate, selectedDate, func }: CalendarProps) {
  const calendarArr = getCalendarDates("month", standardDate);
 
  return (
    <>
      <Flex mb="12px">
        {DAY.map((day) => (
          <Box
            flex={1}
            textAlign="center"
            key={day}
            color={
              day === "일" ? "var(--color-red)" : day === "토" ? "var(--color-blue)" : "inherit"
            }
          >
            {day}
          </Box>
        ))}
      </Flex>
      <Grid templateColumns="repeat(7,1fr)" rowGap="6px">
        {calendarArr.map((item, idx) => {
         
          return (
            <Box key={idx}>
              <DatePointButton
                date={item ? dayjsToStr(dayjs(item.date)) : null}
                value={item ? item.value : null}
                func={item ? () => func(dayjsToStr(dayjs(item.date))) : null}
                isSelected={item && dayjsToStr(dayjs(item.date)) === dayjsToStr(selectedDate)}
                pointType="mint"
              />
            </Box>
          );
        })}
      </Grid>
    </>
  );
}

export default MonthCalendar;
