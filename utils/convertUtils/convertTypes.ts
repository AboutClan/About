import dayjs from "dayjs";

import { getStudyStandardDate } from "../../libs/study/date/getStudyStandardDate";
import { ActiveLocation, LocationEn } from "../../types/services/locationTypes";
import { convertLocationLangTo } from "./convertDatas";

export const createUrlWithLocation = (url: string, locationParam: LocationEn) =>
  url + `?location=${locationParam}`;

dayjs.locale("ko");

export const getUrlWithLocationAndDate = (
  locationParam: LocationEn,
  dateParam: string,
  userLocation: ActiveLocation = "수원",
) => {
  const location = locationParam || convertLocationLangTo(userLocation || "suw", "en");

  const locationBaseUrl = `/home?location=${location}`;
  const dateQuery = !dateParam ? `&date=${getStudyStandardDate()}` : "";

  return locationBaseUrl + dateQuery;
};

// 생년월일 to 만 나이
export const birthToAge = (birth: string) => {
  if (!birth) return;
  const yearSlice = birth?.slice(0, 2);
  const birthYear = +yearSlice < 50 ? "20" + yearSlice : "19" + yearSlice;
  const currentYear = dayjs().year();
  const birthDate = dayjs(birth.slice(2, 4) + "-" + birth.slice(4)).year(dayjs().year());
  const age = currentYear - +birthYear;
  if (birthDate < dayjs()) return age;
  else return age - 1;
};

//생년월일 to Dayjs
export const birthToDayjs = (birth: string) => dayjs(birth.slice(2, 4) + "-" + birth.slice(4, 6));
