import dayjs from "dayjs";

import { STUDY_DATE_START_HOUR } from "../../../constants/serviceConstants/studyConstants/studyTimeConstant";
import { dayjsToStr, getHour } from "../../../utils/dateTimeUtils";

export const getStudyStandardDate = (isPrevView: boolean) => {
  const extraCnt = getHour() > STUDY_DATE_START_HOUR && !isPrevView ? 1 : 0;
  return dayjsToStr(dayjs().add(extraCnt, "day"));
};
