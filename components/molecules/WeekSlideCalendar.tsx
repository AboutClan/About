import { Box, Flex } from "@chakra-ui/react";
import { Dayjs } from "dayjs";
import { RefObject, useEffect, useRef } from "react";

import { VoteCntProps } from "../../types/models/studyTypes/studyRecords";
import { dayjsToStr, getCalendarDates } from "../../utils/dateTimeUtils";
import CalendarDayBox from "../atoms/CalendarDayBox";

interface CalendarProps {
  selectedDate: Dayjs;
  voteCntArr: VoteCntProps[];
  func: (date: number) => void;
}

function WeekSlideCalendar({ voteCntArr, selectedDate, func }: CalendarProps) {
  // const textSwitcherProps = getTextSwitcherProps(selectedDate, func);

  const containerRef: RefObject<HTMLDivElement> = useRef(null);
  const dateRefs: React.MutableRefObject<(HTMLDivElement | null)[]> = useRef([]);
  const calendarArr = getCalendarDates("week", selectedDate, voteCntArr);

  useEffect(() => {
    const dateIndex = calendarArr.findIndex((item) => item.date === dayjsToStr(selectedDate));
    if (dateIndex !== -1 && containerRef.current && dateRefs.current[dateIndex]) {
      const scrollLeft = dateRefs.current[dateIndex].clientWidth * (dateIndex - 2);
      containerRef.current.scrollLeft = scrollLeft;
    }
  }, [calendarArr]);

  
  return (
    <>
      {/* <BetweenTextSwitcher left={textSwitcherProps.left} right={textSwitcherProps.right} /> */}

      <>
        <Flex overflow="auto" pb="12px" w="240px" ref={containerRef}>
          {calendarArr.map((item, idx) => (
            <Box key={idx} ref={(el) => (dateRefs.current[idx] = el)}>
              <CalendarDayBox
                date={item.date}
                value={item.value}
                selectedDate={dayjsToStr(selectedDate)}
                func={func}
              />
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
