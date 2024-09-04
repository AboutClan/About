import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useState } from "react";

import { ColorLabelProps } from "../../components/atoms/ColorLabel";
import MonthNav from "../../components/atoms/MonthNav";
import Accordion from "../../components/molecules/Accordion";
import ColorLabelRow from "../../components/molecules/rows/ColorLabelRow";
import Calendar from "../../components/organisms/Calendar";
import { COLOR_TABLE } from "../../constants/colorConstants";
import { EVENT_CONTENT_2024 } from "../../constants/contents/calendarSchedule";
import { ACCORDION_CONTENT_EVENT } from "../../constants/contentsText/accordionContents";

const SCHEDULE_CATEGORIES: ColorLabelProps[] = [
  {
    text: "공식 행사",
    colorText: COLOR_TABLE[0],
  },
  {
    text: "이벤트",
    colorText: COLOR_TABLE[3],
  },
  {
    text: "일정",
    colorText: COLOR_TABLE[5],
  },
];

function HomeCalendarSection() {
  const [monthFirstDate, setMonthFirstDate] = useState(dayjs().startOf("month"));
  const monthNum = monthFirstDate.month();

  const calendarContents =
    monthFirstDate.year() === 2024 ? EVENT_CONTENT_2024[monthFirstDate.month() + 1] : null;
  return (
    <>
      <Flex align="center" justify="space-between" my={4} mr={4} ml={2}>
        <MonthNav monthNum={monthNum} changeMonth={setMonthFirstDate} />

        <ColorLabelRow props={SCHEDULE_CATEGORIES} />
      </Flex>
      <Calendar monthFirstDate={monthFirstDate} calendarContents={calendarContents} />
      <Box p="16px" mt="8px" fontSize="18px" fontWeight={800}>
        일정 상세정보
      </Box>
      <Accordion contentArr={ACCORDION_CONTENT_EVENT(monthNum + 1)} isQ={false} isFull={true} />
    </>
  );
}

export default HomeCalendarSection;
