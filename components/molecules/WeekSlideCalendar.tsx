import { Box, css, Flex } from "@chakra-ui/react";
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
      <Flex
        className="about_calendar"
        overflow="auto"
        pb="12px"
        w="240px"
        ref={containerRef}
        css={css`
          @media (max-width: 400px) {
            &::-webkit-scrollbar {
              display: none;
            }
          }
          @media (min-width: 400px) {
            &::-webkit-scrollbar {
              height: 8px; /* for horizontal scrollbar */
            }
            &::-webkit-scrollbar-thumb {
              background: var(--gray-400);
            }
          }
        `}
      >
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
      </Flex>
    </>
  );
}

export default WeekSlideCalendar;
