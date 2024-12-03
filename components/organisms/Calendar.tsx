import { Box, Flex, Grid } from "@chakra-ui/react";
import { Dayjs } from "dayjs";
import styled from "styled-components";

import { COLOR_TABLE } from "../../constants/colorConstants";
import { CalendarContentProps } from "../../constants/contents/calendarSchedule";
import { DAYS_OF_WEEK } from "../../constants/util/util";

interface CalendarProps {
  monthFirstDate: Dayjs;
  calendarContents: CalendarContentProps[];
}

export interface CalendarScheduleProps {
  content: string;
  color: string;
  isFirst: boolean;
  isLast: boolean;
  blockIdx: number;

  textPosition: "start" | "end";
}

export interface DaySchedules {
  first: string | null;
  second: string | null;
  third: string | null;
}

const CALENDAR_DAY_COLOR = {
  sun: "var(--color-red)",
  sat: "var(--color-blue)",
};

const SCHEDULE_TYPE_TO_COLOR = {
  main: COLOR_TABLE[0],
  schedule: COLOR_TABLE[5],
  event: COLOR_TABLE[3],
};

const generateCalendarDates = (monthFirstDate: Dayjs) => {
  const daysInMonth = monthFirstDate.daysInMonth();
  const frontBlankDate = monthFirstDate.day();
  const totalDate = daysInMonth + frontBlankDate;
  const rowsInMonth = totalDate <= 35 ? 5 : 6;
  return Array.from({ length: 7 * rowsInMonth }, (_, idx) =>
    idx < frontBlankDate || idx >= totalDate ? null : idx - frontBlankDate + 1,
  );
};

function Calendar({ monthFirstDate, calendarContents }: CalendarProps) {
  const calendarDates = generateCalendarDates(monthFirstDate);
  let endingSchedules = [];

  const daySchedules: DaySchedules = {
    first: null,
    second: null,
    third: null,
  };

  const getDaySchedules = (date: number): CalendarScheduleProps[] => {
    return calendarContents
      .sort((a, b) =>
        a.type === "main" ? -1 : b.type === "main" ? 1 : a.type === "event" ? -1 : 1,
      )
      .reduce((acc: CalendarScheduleProps[], schedule) => {
        const isFirstDay = date === schedule.start;
        const isEndDay = date === schedule.end;
        if (schedule.start <= date && date <= schedule.end) {
          acc.push({
            content: schedule.content,
            color: schedule?.color || SCHEDULE_TYPE_TO_COLOR[schedule.type],
            isFirst: isFirstDay,
            isLast: isEndDay,
            blockIdx: schedule?.blockIdx,
            textPosition: schedule?.textPosition,
          });
          if (isFirstDay) fillSchedule(schedule.content);
          if (isEndDay) endingSchedules.push(schedule.content);
        }
        return acc;
      }, []);
  };

  const deleteSchedule = (content: string) => {
    for (const key in daySchedules) {
      if (daySchedules[key] === content) daySchedules[key] = null;
    }
  };

  const fillSchedule = (content: string) => {
    const availableKey = Object.keys(daySchedules).find((key) => !daySchedules[key]);
    if (availableKey) daySchedules[availableKey] = content;
  };

  return (
    <Box mx="auto">
      <Flex bgColor="var(--gray-100)" py={1} fontSize="12px" justifyContent="space-between">
        {DAYS_OF_WEEK.map((day) => (
          <Box
            key={day}
            textAlign="center"
            color={
              day === "일"
                ? CALENDAR_DAY_COLOR["sun"]
                : day === "토"
                ? CALENDAR_DAY_COLOR["sat"]
                : "inherit"
            }
            flex={1}
          >
            {day}
          </Box>
        ))}
      </Flex>
      <Grid
        bgColor="white"
        templateColumns="repeat(7,1fr)"
        // border="var(--border)"
        borderRadius="var(--rounded)"
      >
        {calendarDates?.map((item, idx) => {
          const day = idx % 7 === 0 ? "sun" : idx % 7 === 6 ? "sat" : null;
          const isToday = false;
          const contentArr = getDaySchedules(item);

          const dateInfo = Object.values(daySchedules).map((title) => {
            return contentArr?.find((c) => c.content === title);
            // return contentArr[index]; // 순서를 고려하여 index에 해당하는 요소를 선택
          });

          endingSchedules.forEach((item) => deleteSchedule(item));
          endingSchedules = [];

          return (
            <Box pb={1} fontSize="12px" fontWeight="medium" borderTop="var(--border)" key={idx}>
              <Flex
                color={isToday ? "white" : CALENDAR_DAY_COLOR[day]}
                position="relative"
                justify="center"
                align="center"
                py={1}
              >
                {!isToday ? (
                  item
                ) : (
                  <Flex
                    align="center"
                    justify="center"
                    borderRadius="4px"
                    w="20px"
                    h="20px"
                    bgColor="var(--gray-800)"
                    color="white"
                  >
                    {item}
                  </Flex>
                )}
              </Flex>
              <>
                {dateInfo.map((item, idx2) => {
                  return (
                    <EventBlock
                      key={idx2}
                      isFirst={item?.isFirst}
                      isLast={item?.isLast}
                      color={item?.color}
                      position={item?.textPosition}
                    >
                      {item?.isFirst ? item?.content : "\u00A0"}
                    </EventBlock>
                  );
                })}
              </>
            </Box>
          );
        })}
      </Grid>
    </Box>
  );
}

const EventBlock = styled.div<{
  color: string;
  isFirst: boolean;
  isLast: boolean;
  position: "start" | "end";
}>`
  font-size: 10px;
  margin: ${(props) => !props.position && "0 1px"};
  margin-bottom: 2px;

  font-weight: 400;
  border-radius: ${(props) => !props.position && "4px"};
  border-top-left-radius: ${(props) => props.position === "end" && "4px"};
  border-bottom-left-radius: ${(props) => props.position === "end" && "4px"};
  border-top-right-radius: ${(props) => props.position === "start" && "4px"};
  border-bottom-right-radius: ${(props) => props.position === "start" && "4px"};
  white-space: pre;
  color: white;
  background-color: ${(props) => props.color};
  position: relative;
  z-index: ${(props) => (props.isFirst ? 4 : 0)};
  /* padding-left: ${(props) => (props.isFirst ? "var(--gap-1)" : 0)};
  padding-right: ${(props) => (props.isLast ? "var(--gap-1)" : 0)}; */
  text-align: ${(props) => props.position || "center"};
  padding-right: ${(props) => props.position === "end" && "1.5px"};
  padding-left: ${(props) => props.position === "start" && "1.5px"};
`;

export default Calendar;
