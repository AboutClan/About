import { Box, Flex, Grid } from "@chakra-ui/react";
import { Dayjs } from "dayjs";

import { getCalendarDates } from "../../utils/dateTimeUtils";

interface CalendarProps {
  type: "week" | "month";
  selectedDate: Dayjs;
  func: (date: number) => void;
}

function Calendar({ type, selectedDate, func }: CalendarProps) {
  const calendarArr = getCalendarDates(type, selectedDate);

  return (
    <>
      {/* <BetweenTextSwitcher left={textSwitcherProps.left} right={textSwitcherProps.right} /> */}

      <>
        {type === "week" ? (
          <Flex overflow="auto">
            {calendarArr.map((date, idx) => (
              <Box key={idx} mr="2px">
                {/* <CalendarDayBox date={date} selectedDate={dayjsToStr(selectedDate)} func={func} /> */}
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
        ) : (
          <Grid templateColumns="repeat(7,1fr)" rowGap="12px">
            {calendarArr.map((dateStr, idx) => {
              // const date = dayjs(dateStr).date();
              return (
                <Flex key={idx} w="100%" justify="center" align="center">
                  {/* <DatePointButton
                    date={date}
                    func={() => func(date)}
                    isSelected={date === selectedDate.date()}
                  /> */}
                </Flex>
              );
            })}
          </Grid>
        )}
      </>
    </>
  );
}

export default Calendar;
