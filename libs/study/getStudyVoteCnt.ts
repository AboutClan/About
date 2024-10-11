import { StudyParticipationProps } from "../../types/models/studyTypes/studyDetails";

export const getStudyVoteCnt = (studyVoteData: StudyParticipationProps[], filterUid?: string) => {
  if (!studyVoteData) return undefined;
  const temp = new Set();

  studyVoteData?.forEach((par) => {
    if (par.place.brand === "자유 신청") return;
    par?.members.forEach((who) => {
      if (who?.user.uid === filterUid) return;
      if (who.firstChoice) temp.add(who.user.uid);
    });
  });

  return temp.size;
};
