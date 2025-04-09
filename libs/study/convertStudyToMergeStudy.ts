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

export const findStudyById = (
  studyVoteData: StudyVoteDataProps,
  id: string,
): StudyMergeResultProps => {
  return (
    studyVoteData.results?.find((result) => result.place._id === id) ||
    convertRealTimesToResultFormat(studyVoteData?.realTimes.userList).find(
      (result) => result.place._id === id,
    )
  );
};
