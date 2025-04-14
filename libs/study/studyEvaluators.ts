import dayjs from "dayjs";

import { StudyMergeResultProps } from "../../types/models/studyTypes/derivedTypes";
import { MyStudyStatus } from "../../types/models/studyTypes/helperTypes";
import { findMyStudyInfo } from "./studySelectors";

export const evaluateMyStudyStatus = (
  findStudy: StudyMergeResultProps,

  userId: string,
  date: string,
): Exclude<MyStudyStatus, "voting"> => {
  if (dayjs(date).startOf("day").isBefore(dayjs().startOf("day"))) {
    return "expired";
  }
  if (!findStudy) {
    return "pending";
  }

  const myStudyInfo = findMyStudyInfo(findStudy, userId);
  if (myStudyInfo) {
    const type = myStudyInfo?.attendance.type;
    if (type) return type;
    else {
      return findStudy.status === "open" ? "open" : "free";
    }
  } else return "todayPending";
};
