import { Box, Flex, Grid } from "@chakra-ui/react";
import dayjs, { Dayjs } from "dayjs";
import { VoteCntProps } from "../../types/models/studyTypes/studyRecords";

import { dayjsToStr, getCalendarDates } from "../../utils/dateTimeUtils";
import DatePointButton from "./DatePointButton";

interface CalendarProps {
  voteCntArr: VoteCntProps[];
  selectedDate: Dayjs;
  func: (date: number) => void;
}

const DAY = ["일", "월", "화", "수", "목", "금", "토"];

function Calendar({ voteCntArr, selectedDate, func }: CalendarProps) {
  const calendarArr = getCalendarDates("month", selectedDate, voteCntArr);

  return (
    <>
      <Flex mb="16px">
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
      <Grid templateColumns="repeat(7,1fr)" rowGap="12px">
        {calendarArr.map((item, idx) => {
          if (dayjsToStr(dayjs(item?.date)) === dayjsToStr(selectedDate)) {
            console.log(
              item,
              selectedDate,
              dayjsToStr(dayjs(item?.date)),
              dayjsToStr(selectedDate),
            );
          }
          return (
            <Box key={idx}>
              <DatePointButton
                date={item ? dayjs(item.date).date() : null}
                value={item ? item.value : null}
                func={item ? () => func(dayjs(item.date).date()) : null}
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

export default Calendar;
