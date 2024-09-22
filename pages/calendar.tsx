import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useState } from "react";

import MonthNav from "../components/atoms/MonthNav";
import Header from "../components/layouts/Header";
import Slide from "../components/layouts/PageSlide";
import Accordion from "../components/molecules/Accordion";
import ColorLabelRow from "../components/molecules/rows/ColorLabelRow";
import Calendar from "../components/organisms/Calendar";
import { EVENT_CONTENT_2024 } from "../constants/contents/calendarSchedule";
import { ACCORDION_CONTENT_EVENT } from "../constants/contentsText/accordionContents";
import { SCHEDULE_CATEGORIES } from "../pageTemplates/home/HomeCalendarSection";

function CalendarPage() {
  const [monthFirstDate, setMonthFirstDate] = useState(dayjs().startOf("month"));
  const monthNum = monthFirstDate.month();

  const calendarContents =
    monthFirstDate.year() === 2024 ? EVENT_CONTENT_2024[monthFirstDate.month() + 1] : null;
  return (
    <>
      <Header title="동아리 캘린더" />
      <Slide>
        <Flex align="center" justify="space-between" my={4} mr={4} ml={2}>
          <MonthNav monthNum={monthNum} changeMonth={setMonthFirstDate} />

          <ColorLabelRow props={SCHEDULE_CATEGORIES} />
        </Flex>
        <Calendar monthFirstDate={monthFirstDate} calendarContents={calendarContents} />
        <Box p="16px" mt="8px" fontSize="18px" fontWeight={800}>
          일정 상세정보
        </Box>
        <Accordion contentArr={ACCORDION_CONTENT_EVENT(monthNum + 1)} isQ={false} isFull={true} />
      </Slide>
    </>
  );
}

export default CalendarPage;
