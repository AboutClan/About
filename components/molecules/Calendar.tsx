import { Flex, Grid } from "@chakra-ui/react";
import dayjs, { Dayjs } from "dayjs";
import { getTextSwitcherProps } from "../../pageTemplates/home/studyController/StudyController";
import { getCalendarDates } from "../../utils/dateTimeUtils";
import DatePointButton from "./DatePointButton";
import BetweenTextSwitcher from "./navs/BetweenTextSwitcher";

interface CalendarProps {
  type: "week" | "month";
  selectedDate: Dayjs;

  func: (date: number) => void;
}

const DAYS = ["일", "월", "화", "수", "목", "금", "토"];

function Calendar({ type, selectedDate, func }: CalendarProps) {
  const textSwitcherProps = getTextSwitcherProps(selectedDate, func);

  const calendarArr = getCalendarDates(type, selectedDate);

  return (
    <>
      <BetweenTextSwitcher left={textSwitcherProps.left} right={textSwitcherProps.right} />
      <Flex
        justify="space-between"
        h="42px"
        align="center"
        color="var(--gray-500)"
        fontWeight={500}
      >
        {DAYS.map((day, idx) => (
          <Flex justify="center" align="center" w="30px" h="30px" key={idx}>
            {day}
          </Flex>
        ))}
      </Flex>
      <>
        {type === "week" ? (
          <Flex h="60px" justify="space-between">
            {calendarArr.map((dateStr) => {
              const date = dayjs(dateStr).date();
              return (
                <DatePointButton
                  date={date}
                  func={() => func(date)}
                  isSelected={date === selectedDate.date()}
                />
              );
            })}
          </Flex>
        ) : (
          <Grid templateColumns="repeat(7,1fr)" rowGap="12px">
            {calendarArr.map((dateStr) => {
              if (!dateStr) return null;
              const date = dayjs(dateStr).date();
              return (
                <Flex w="inherit">
                  <DatePointButton
                    date={date}
                    func={() => func(date)}
                    isSelected={date === selectedDate.date()}
                  />
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
