import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import Image from "next/image";
import { useState } from "react";

import MonthNav from "../components/atoms/MonthNav";
import Header from "../components/layouts/Header";
import Slide from "../components/layouts/PageSlide";
import { CALENDAR_IMAGES } from "../constants/contents/calendarSchedule";

function CalendarPage() {
  const [monthFirstDate, setMonthFirstDate] = useState(dayjs().startOf("month"));
  const monthNum = monthFirstDate.month();

  console.log(monthNum);
  return (
    <>
      <Header title="동아리 캘린더" />
      <Slide isNoPadding>
        <Box>
          <Flex align="center" justify="space-between" my={3} mr={3} ml={2}>
            <MonthNav monthNum={monthNum} changeMonth={setMonthFirstDate} />
            {/* <ColorLabelRow props={SCHEDULE_CATEGORIES} /> */}
          </Flex>
          <Box position="relative" aspectRatio={4 / 5}>
            <Image
              alt=""
              src={
                monthNum === 10 ? CALENDAR_IMAGES[0] : monthNum === 11 ? CALENDAR_IMAGES[1] : null
              }
              fill
              sizes="500px"
              priority
            />
          </Box>
          {/* <Calendar monthFirstDate={monthFirstDate} calendarContents={calendarContents} /> */}
          {/* <Box p="16px" mt="8px" fontSize="18px" fontWeight={800}>
          일정 상세정보
        </Box>
        <Accordion contentArr={ACCORDION_CONTENT_EVENT(monthNum + 1)} isQ={false} isFull={true} /> */}
        </Box>
      </Slide>
    </>
  );
}

export default CalendarPage;
