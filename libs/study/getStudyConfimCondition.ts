import { StudyStatus } from "../../types/models/studyTypes/studyDetails";
import { StudyDateStatus } from "../../types/models/studyTypes/studyInterActions";
import { getHour } from "../../utils/dateTimeUtils";

export const getStudyConfimCondition = (
  studyDateStatus: StudyDateStatus,
  studyStatus: StudyStatus,
) => {
  if (studyDateStatus === "today" && studyStatus === "pending" && getHour() === 16) {
    return true;
  }
  return false;
};
