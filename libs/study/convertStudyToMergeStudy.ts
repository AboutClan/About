import {
  StudyMergeResultProps,
  StudyVoteDataProps,
} from "../../types/models/studyTypes/studyDetails";
import { convertRealTimesToResultFormat } from "./getMyStudyMethods";

export const convertStudyToMergeStudy = (
  studyVoteData: StudyVoteDataProps,
): StudyMergeResultProps[] => {
  const convertedRealTimes = studyVoteData?.realTimes
    ? convertRealTimesToResultFormat(studyVoteData.realTimes.userList)
    : [];

  return [...studyVoteData.results, ...convertedRealTimes];
};
