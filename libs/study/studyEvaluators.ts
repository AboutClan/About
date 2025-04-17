import { StudyStatus } from "../../types/models/studyTypes/baseTypes";
import { StudyMergeResultProps } from "../../types/models/studyTypes/derivedTypes";
import { MyStudyStatus } from "../../types/models/studyTypes/helperTypes";
import { findMyStudyInfo } from "./studySelectors";

export const evaluateMyStudyStatus = (
  findStudy: StudyMergeResultProps,
  userId: string,
  pageType: StudyStatus | "recruiting" | "expected",
  isVoting: boolean,
): MyStudyStatus => {
  // if (dayjs(date).startOf("day").isBefore(dayjs().startOf("day"))) {
  //   return "expired";
  // }

  if (pageType === "recruiting" || pageType === "expected") {
    if (isVoting) return "voting";
    return "pending";
  }

  const status = findStudy?.status;

  const myStudyInfo = findMyStudyInfo(findStudy, userId);

  if (myStudyInfo) {
    const type = myStudyInfo?.attendance?.type;
    if (type) return type;
    else {
      return status === "open" ? "open" : "free";
    }
  } else return "todayPending";
};
