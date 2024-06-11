import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { Fragment, useState } from "react";
import styled from "styled-components";

import MonthNav from "../components/atoms/MonthNav";
import { PointCircleTextProps } from "../components/atoms/PointCircleText";
import Header from "../components/layouts/Header";
import Slide from "../components/layouts/PageSlide";
import Accordion from "../components/molecules/Accordion";
import PointCircleTextRow from "../components/molecules/PointCircleTextRow";
import { ACCORDION_CONTENT_EVENT } from "../constants/contentsText/accordionContents";
import { EVENT_CONTENT_2024 } from "../constants/settingValue/eventContents";
import { DAYS_OF_WEEK } from "../constants/util/util";
const DAYS_TITLE = ["포인트 2배", null, null, null, null, null, "점수 2배"];

interface IEventContent {
  content: string;
  color: string;
  isFirst: boolean;
  isLast: boolean;
  blockIdx?: number;
}

function EventCalendar() {
  const [navMonth, setNavMonth] = useState(dayjs().startOf("month"));

  const getFilledDates = (navMonth: dayjs.Dayjs) => {
    const daysInMonth = navMonth.daysInMonth();
    const frontBlankDate = navMonth.day();
    const totalDate = daysInMonth + frontBlankDate;
    const rowsInMonth = totalDate <= 35 ? 5 : 6;
    return Array.from({ length: 7 * rowsInMonth }, (_, idx) =>
      idx < frontBlankDate || idx >= totalDate ? null : idx - frontBlankDate + 1,
    );
  };

  const filledDates = getFilledDates(navMonth);

  const eventBlocks: { [key: string]: string } = {
    first: null,
    second: null,
    third: null,
  };

  let endBlocks = [];

  const filledContents = (date: number) => {
    const eventArr = navMonth.year() === 2024 ? EVENT_CONTENT_2024[navMonth.month() + 1] : null;

    if (!eventArr) return;
    return eventArr.reduce((acc: IEventContent[], event) => {
      const isFirstDay = date === event.start;
      const isEndDay = date === event.end;
      if (event.start <= date && date <= event.end) {
        acc.push({
          content: event.content,
          color: event.color,
          isFirst: isFirstDay,
          isLast: isEndDay,
          blockIdx: event?.blockIdx,
        });
        if (isFirstDay) fillEventDate(event.content);
        if (isEndDay) endBlocks.push(event.content);
      }
      return acc;
    }, []);
  };

  const fillEventDate = (content: string) => {
    const availableKey = Object.keys(eventBlocks).find((key) => !eventBlocks[key]);
    if (availableKey) eventBlocks[availableKey] = content;
  };

  const deleteEventDate = (content: string) => {
    for (const key in eventBlocks) {
      if (eventBlocks[key] === content) eventBlocks[key] = null;
    }
  };

  const textRowObj: PointCircleTextProps[] = [
    {
      text: "공식 행사",
      color: "mint",
    },
    {
      text: "이벤트",
      color: "blue",
    },
    {
      text: "일정",
      color: "orange",
    },
  ];

  return (
    <>
      <Header title="이벤트 캘린더" url="/home" />
      <Slide>
        <Flex align="center" justify="space-between" m="16px 16px">
          <MonthNav month={navMonth.month()} setNavMonth={setNavMonth} />
          <PointCircleTextRow props={textRowObj} />
        </Flex>
        <Calendar>
          <WeekTitleHeader>
            {DAYS_TITLE.map((day, idx) => (
              <div key={idx}>{day}</div>
            ))}
          </WeekTitleHeader>
          <DayOfWeek>
            {DAYS_OF_WEEK.map((day) => (
              <div key={day}>{day}</div>
            ))}
          </DayOfWeek>
          <CalendarDates>
            {filledDates?.map((item, idx) => {
              const day = idx % 7 === 0 ? "sun" : idx % 7 === 6 ? "sat" : null;
              const isToday = navMonth.date(item).isSame(dayjs(), "day");

              const contentArr = filledContents(item);
              const dateInfo = Object.values(eventBlocks).map((title) =>
                contentArr?.find((c) => c.content === title),
              );

              endBlocks.forEach((item) => deleteEventDate(item));
              endBlocks = [];

              return (
                <DateBlock key={idx} isToday={isToday}>
                  <Date day={day} isToday={isToday}>
                    {!isToday ? item : <TodayCircle>{item}</TodayCircle>}
                  </Date>
                  <DateContent>
                    {dateInfo.map((item, idx2) => {
                      return (
                        <Fragment key={idx2}>
                          {item?.blockIdx !== undefined && (
                            <EventBlock isFirst={item?.isFirst} isLast={item?.isLast} color={null}>
                              &nbsp;
                            </EventBlock>
                          )}
                          <EventBlock
                            isFirst={item?.isFirst}
                            isLast={item?.isLast}
                            color={item?.color}
                          >
                            {item?.isFirst ? item?.content : "\u00A0"}
                          </EventBlock>
                        </Fragment>
                      );
                    })}
                  </DateContent>
                </DateBlock>
              );
            })}
          </CalendarDates>
        </Calendar>
        <Box p="16px" mt="8px" fontSize="18px" fontWeight={800}>
          이벤트 상세정보
        </Box>
        <Accordion
          contentArr={ACCORDION_CONTENT_EVENT(navMonth.month() + 1)}
          isQ={false}
          isFull={true}
        />
      </Slide>
    </>
  );
}

const Calendar = styled.div`
  width: 364px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`;

const WeekTitleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: var(--color-mint);

  margin-bottom: var(--gap-1);
  font-weight: 600;
  > div {
    flex: 1;
    text-align: center;
  }
`;

const DayOfWeek = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: var(--gray-200);
  padding: var(--gap-1) 0;
  font-size: 12px;
  > div {
    flex: 1;
    text-align: center;
  }
  > div:first-child {
    color: var(--color-red);
  }
  > div:last-child {
    color: #6bafff;
  }
`;

const CalendarDates = styled.div`
  display: grid;
  background-color: white;
  grid-template-columns: repeat(7, 1fr);
  border: var(--border);
  border-radius: var(--rounded);
  > div:first-child {
    color: var(--color-red);
  }
`;

const DateBlock = styled.div<{ isToday: boolean }>`
  width: 52px;
  padding-top: var(--gap-1);
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  flex: 1;
  border-top: var(--border);
  background-color: ${(props) => (props.isToday ? "var(--gray-200)" : null)};
`;

const Date = styled.div<{ day: "sun" | "sat"; isToday: boolean }>`
  position: relative;
  height: 18px;
  margin-bottom: var(--gap-1);
  color: ${(props) =>
    props.isToday
      ? "white"
      : props.day === "sun"
        ? "var(--color-red)"
        : props.day === "sat"
          ? "var(--color-blue)"
          : null};
`;

const DateContent = styled.div``;

const EventBlock = styled.div<{
  color: string;
  isFirst: boolean;
  isLast: boolean;
}>`
  font-size: 10px;
  margin-bottom: 2px;
  font-weight: 400;
  white-space: nowrap;
  color: white;
  background-color: ${(props) => props.color};
  position: relative;

  z-index: ${(props) => (props.isFirst ? 4 : 0)};
  padding-left: ${(props) => (props.isFirst ? "var(--gap-1)" : 0)};
  padding-right: ${(props) => (props.isLast ? "var(--gap-1)" : 0)};
`;

const TodayCircle = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--gray-800);
  color: white;
`;

export default EventCalendar;
