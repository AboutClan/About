import { Box, Flex } from "@chakra-ui/react";
import { Dayjs } from "dayjs";

import { getTextSwitcherProps } from "../../pageTemplates/home/studyController/StudyController";
import { dayjsToStr, getCalendarDates } from "../../utils/dateTimeUtils";
import CalendarDayBox from "../atoms/CalendarDayBox";

interface CalendarProps {
  selectedDate: Dayjs;
  func: (date: number) => void;
}

const DAYS = ["일", "월", "화", "수", "목", "금", "토"];

function WeekSlideCalendar({ selectedDate, func }: CalendarProps) {
  const textSwitcherProps = getTextSwitcherProps(selectedDate, func);

  const calendarArr = getCalendarDates("week", selectedDate);

  return (
    <>
      {/* <BetweenTextSwitcher left={textSwitcherProps.left} right={textSwitcherProps.right} /> */}

      <>
        <Flex overflow="auto" flex={1}>
          {calendarArr.map((date, idx) => (
            <Box key={idx} mr="14px">
              <CalendarDayBox date={date} selectedDate={dayjsToStr(selectedDate)} func={func} />
            </Box>
          ))}
          {/* <Flex h="42px" align="center" color="var(--gray-500)" fontWeight={500}>
              {DAYS.map((day, idx) => (
                <Flex justify="center" align="center" flex={1} h="30px" key={idx}>
                  {day}
                </Flex>
              ))}
            </Flex>
            <Flex h="58px">
              {calendarArr.map((dateStr, idx) => {
                const date = dayjs(dateStr).date();
                return (
                  <Flex mr="14px" key={idx} justify="center" align="center">
                    <DatePointButton
                      date={date}
                      func={func}
                      isSelected={date === selectedDate.date()}
                    />
                  </Flex>
                );
              })}
            </Flex> */}
        </Flex>
      </>
    </>
  );
}

export default WeekSlideCalendar;
