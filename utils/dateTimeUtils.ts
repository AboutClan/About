import "dayjs/locale/ko";

import dayjs, { Dayjs } from "dayjs";
import weekday from "dayjs/plugin/weekday";

dayjs.extend(weekday);

export const dayjsToStr = (date: Dayjs) => date?.format("YYYY-MM-DD");

export const dayjsToFormat = (date: Dayjs, text: string) => date.format(text);

export const dayjsToTime = (date: Dayjs) => date.format("HH:mm");

export const dayjsToKr = (date: Dayjs) => date.locale("ko").format("M월 D일(ddd)");

export const getToday = () => dayjs().startOf("day");

export const createTimeArr = (startHour: number, endHour: number, offset = 0) => {
  const timeArr = [];
  for (let i = startHour; i <= endHour; i++) {
    timeArr.push(String(i + offset) + ":00");
    if (i !== endHour) timeArr.push(i + offset + ":30");
  }
  return timeArr;
};

export const parseTimeToDayjs = (timeString: string) => {
  const [hours, minutes] = timeString.split(":").map(Number); // "14:00"을 시간과 분으로 분리하고 숫자로 변환
  const now = new Date(); // 현재 날짜와 시간의 Date 객체
  now.setHours(hours, minutes, 0, 0); // 시간과 분 설정 (초와 밀리초는 0으로 설정)

  return dayjs(now);
};

export const getCurrentDate = () => dayjs().startOf("day");

export const now = () => dayjs();
export const getHour = () => dayjs().hour();
export const getMonth = () => dayjs().month();

export const strToDate = (dateStr: string) => {
  return dayjs(dateStr, "YYYY-MM-DD").startOf("day");
};

export const toDate = (raw: string | Date) => {
  let dayjsDate: Dayjs;
  if (typeof raw === "string") dayjsDate = strToDate(raw);
  else dayjsDate = dayjs(raw).startOf("day");

  return dayjs(dayjsDate).startOf("day");
};

export const getWeekNumber = (date: Dayjs) => {
  const startDay = date.startOf("month").day();
  const currentDate = date.date();
  return Math.ceil((currentDate - startDay) / 7);
};

export const getDateDiff = (date: Dayjs) => {
  const daysDiff = dayjs().diff(date, "day");

  if (daysDiff < 1) {
    const hoursDiff = dayjs().diff(date, "hour");

    if (hoursDiff < 1) return "방금 전";
    return `${dayjs().diff(date, "hours")}시간 전`;
  }
  return `${daysDiff}일 전`;
};

export const getDateWeek = (date: Dayjs) => {
  const firstDayOfMonth = date.startOf("month");
  const differenceInDays = date.diff(firstDayOfMonth, "day");
  return Math.floor(differenceInDays / 7) + 1;
};

export interface CalendarDateProps {
  date: string;
  isDisabled: boolean;
  isMint: boolean;
}

export const getCalendarDates = (
  type: "week" | "month",
  selectedDate: Dayjs,
  passedDisabled: boolean,
  mintDateArr: string[],
) => {
  const calendar: CalendarDateProps[] = [];

  if (type === "week") {
    const startDate = selectedDate.startOf("month");
    for (let i = 0; i < selectedDate.endOf("month").date(); i++) {
      const date = startDate.add(i, "day");
      calendar.push({
        date: dayjsToStr(date),
        isDisabled: dayjs().add(6, "day").isAfter(date) ? false : true,
        isMint: false,
      });
    }
  } else {
    const startOfMonth = selectedDate.startOf("month");
    const endOfMonth = selectedDate.endOf("month");
    const startCalendar = startOfMonth.weekday(0);
    const endCalendar = endOfMonth.weekday(6);

    let current = startCalendar;
    while (current.isBefore(endCalendar) || current.isSame(endCalendar)) {
      if (current.isBefore(startOfMonth) || current.isAfter(endOfMonth)) {
        calendar.push(null);
      } else {
        calendar.push({
          date: dayjsToStr(current),
          isDisabled: dayjs().add(6, "day").isAfter(current)
            ? passedDisabled && dayjs().subtract(1, "day").isAfter(current)
              ? true
              : false
            : true,

          isMint: mintDateArr.includes(dayjsToStr(current)),
        });
      }

      current = current.add(1, "day");
    }
    const maxDays = calendar.length <= 35 ? 35 : 42;
    while (calendar.length < maxDays) {
      calendar.push(null);
    }
  }

  return calendar;
};

export const formatMinutesToTime = (totalMinutes: number): string => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const hourPart = hours > 0 ? `${hours}시간` : "";
  const minutePart = minutes > 0 ? `${minutes}분` : "";

  if (!hourPart && !minutePart) return "0분";
  return `${hourPart} ${minutePart}`.trim();
};
