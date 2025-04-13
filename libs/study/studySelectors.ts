import { StudyMemberProps, StudyVoteDataProps } from "../../types/models/studyTypes/baseTypes";
import { StudyMergeResultProps } from "../../types/models/studyTypes/derivedTypes";
import { convertStudyToMergeStudy } from "./studyConverters";

//내 스터디 결과 찾기

export const findMyStudyByUserId = (
  studyVoteData: StudyVoteDataProps,
  userId: string,
): StudyMergeResultProps => {
  if (!studyVoteData || !userId) return;
  const convertedResults = convertStudyToMergeStudy(studyVoteData);

  return convertedResults.find((result) =>
    result.members.some((member) => member?.user._id === userId),
  );
};

export const findMyStudyInfo = (
  studyResult: StudyMergeResultProps,
  userId: string,
): StudyMemberProps => {
  if (!studyResult) return;
  return studyResult.members.find((member) => member.user._id === userId);
};

export const findStudyByPlaceId = (
  studyVoteData: StudyVoteDataProps,
  placeId: string,
): StudyMergeResultProps => {
  if (!studyVoteData || !placeId) return;
  const convertedResults = convertStudyToMergeStudy(studyVoteData);

  return convertedResults.find((result) => result.place._id === placeId);
};
