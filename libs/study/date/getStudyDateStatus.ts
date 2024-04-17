import dayjs from "dayjs";

import { STUDY_RESULT_HOUR } from "../../../constants/serviceConstants/studyConstants/studyTimeConstant";
import { dayjsToStr, getHour, getToday } from "../../../utils/dateTimeUtils";

/**
 * today는 결과 발표난 이후부터 시간, 오늘의 스터디
 */
export const getStudyDateStatus = (date: string) => {
  const selectedDate = dayjs(date).startOf("day");
  const currentDate = getToday();
  const currentHours = getHour();

  const isTodayCondition =
    (currentDate.add(1, "day").isSame(selectedDate) && currentHours >= STUDY_RESULT_HOUR) ||
    (currentDate.isSame(selectedDate) && currentHours < STUDY_RESULT_HOUR);

  if (isTodayCondition) return "today";
  if (
    (dayjsToStr(selectedDate) === dayjsToStr(currentDate) && currentHours >= STUDY_RESULT_HOUR) ||
    selectedDate.isBefore(currentDate)
  ) {
    return "passed";
  }

  return "not passed";
};
