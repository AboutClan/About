import { css, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useEffect, useRef } from "react";

import { getCalendarDates } from "../../utils/dateTimeUtils";
import CalendarDayBox from "../atoms/CalendarDayBox";

interface CalendarProps {
  selectedDate: string;
  // voteCntArr: VoteCntProps[];
  func: (date: string) => void;
}

function WeekSlideCalendar({ selectedDate, func }: CalendarProps) {
  const dateRefs: React.MutableRefObject<(HTMLDivElement | null)[]> = useRef([]);
  const containerRef = useRef<HTMLDivElement>();
  const calendarArr = getCalendarDates("week", dayjs(selectedDate));

  useEffect(() => {
    if (!calendarArr || !selectedDate) return;
    const selectedIdx = calendarArr.findIndex((obj) => obj.date === selectedDate);

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
        borderBottom="var(--border)"
        ref={containerRef}
        className="about_calendar"
        overflowX="auto"
        pb={3}
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
          <Flex
            justify="center"
            w="{`calc((100dvw - 40px) / 7)`}"
            minWidth="calc((100dvw - 40px) / 7)"
            key={idx}
            ref={(el) => (dateRefs.current[idx] = el)}
          >
            <CalendarDayBox
              date={item.date}
              value={item.value}
              selectedDate={selectedDate}
              func={func}
            />
          </Flex>
        ))}
      </Flex>
    </>
  );
}

export default WeekSlideCalendar;
