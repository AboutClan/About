import { StudyStatus } from "../../types/models/studyTypes/baseTypes";
import { StudyDateStatus } from "../../types/models/studyTypes/studyInterActions";
import { getHour } from "../../utils/dateTimeUtils";

export const getStudyConfimCondition = (
  studyDateStatus: StudyDateStatus,
  studyStatus: StudyStatus,
) => {
  if (studyDateStatus === "today" && studyStatus === "pending" && getHour() === 23) {
    return true;
  }
  return false;
};
