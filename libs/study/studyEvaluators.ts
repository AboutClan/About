import { StudyVoteDataProps } from "../../types/models/studyTypes/baseTypes";
import { MyStudyStatus } from "../../types/models/studyTypes/helperTypes";
import { findMyStudyByUserId, findMyStudyInfo } from "./studySelectors";

export const evaluateMyStudyStatus = (
  studyVoteData: StudyVoteDataProps,
  userId: string,
): MyStudyStatus => {
  const participations = studyVoteData?.participations;
  if (participations) {
    if (participations.find((who) => who?.user?._id === userId)) {
      return "voting";
    } else return "pending";
  }
  const myStudyResult = findMyStudyByUserId(studyVoteData, userId);
  if (myStudyResult) {
    const myStudyInfo = findMyStudyInfo(myStudyResult, userId);
    const type = myStudyInfo?.attendance.type;
    if (type) return type;
    else {
      return myStudyResult.status === "open" ? "open" : "free";
    }
  } else return "todayPending";
};
