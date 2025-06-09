import dayjs from "dayjs";

import { getStudyStandardDate } from "../../libs/study/date/getStudyStandardDate";
import { Location, LocationEn } from "../../types/services/locationTypes";
import { convertLocationLangTo } from "./convertDatas";

export const createUrlWithLocation = (url: string, locationParam: LocationEn) =>
  url + `?location=${locationParam}`;

dayjs.locale("ko");

export const getUrlWithLocationAndDate = (
  locationParam: LocationEn,
  dateParam: string,
  userLocation: Location = "수원",
) => {
  const location = locationParam || convertLocationLangTo(userLocation || "suw", "en");

  const locationBaseUrl = `/home?location=${location}`;
  const dateQuery = !dateParam ? `&date=${getStudyStandardDate()}` : "";

  return locationBaseUrl + dateQuery;
};

// 생년월일 to 만 나이
export const birthToAge = (birth: string) => {
  if (!birth) return;

  const yearSlice = birth.slice(0, 2); // '01'
  const birthYear = +yearSlice < 50 ? 2000 + +yearSlice : 1900 + +yearSlice; // 2001

  const current = dayjs();
  const currentYear = current.year(); // 2025

  const month = parseInt(birth.slice(2, 4), 10) - 1; // 0-based month
  const date = parseInt(birth.slice(4, 6), 10);

  const birthDateThisYear = dayjs().set("year", currentYear).set("month", month).set("date", date);
  const age = currentYear - birthYear;

  return birthDateThisYear.isAfter(current.startOf("day")) ? age - 1 : age;
};

//생년월일 to Dayjs
export const birthToDayjs = (birth: string) => dayjs(birth.slice(2, 4) + "-" + birth.slice(4, 6));

export const convertTimeStringToDayjs = (timeString: string) => {
  const [hour, minute] = timeString.split(":").map(Number); // '18'과 '00'을 숫자로 변환
  return dayjs().hour(hour).minute(minute).second(0);
};
