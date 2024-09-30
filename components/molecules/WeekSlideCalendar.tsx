import { Box, css, Flex } from "@chakra-ui/react";
import { Dayjs } from "dayjs";
import { useEffect, useRef } from "react";

import { dayjsToStr, getCalendarDates } from "../../utils/dateTimeUtils";
import CalendarDayBox from "../atoms/CalendarDayBox";

interface CalendarProps {
  selectedDate: Dayjs;
  // voteCntArr: VoteCntProps[];
  func: (date: string) => void;
}

function WeekSlideCalendar({  selectedDate, func }: CalendarProps) {
  const dateRefs: React.MutableRefObject<(HTMLDivElement | null)[]> = useRef([]);
  const containerRef = useRef<HTMLDivElement>();
  const calendarArr = getCalendarDates("week", selectedDate);

  useEffect(() => {
    if (!calendarArr || !selectedDate) return;
    const selectedIdx = calendarArr.findIndex((obj) => obj.date === dayjsToStr(selectedDate));

    if (selectedIdx !== -1 && containerRef.current) {
      const selectedElement = dateRefs.current[selectedIdx];
      if (selectedElement) {
        containerRef.current.scrollLeft = selectedElement.clientWidth * (selectedIdx - 2);
      }
    }
  }, [calendarArr, selectedDate]);

  return (
    <>
      <Flex
        ref={containerRef}
        className="about_calendar"
        overflow="auto"
        pb={2}
        w="240px"
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
