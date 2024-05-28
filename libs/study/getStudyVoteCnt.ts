import { IParticipation } from "../../types/models/studyTypes/studyDetails";

export const getStudyVoteCnt = (studyVoteData: IParticipation[], filterUid?: string) => {
  if (!studyVoteData) return undefined;
  const temp = new Set();

  studyVoteData?.forEach((par) => {
    if (par.place.brand === "자유 신청") return;
    par?.attendences.forEach((who) => {
      if (who?.user.uid === filterUid) return;
      temp.add(who.user.uid);
    });
  });

  return temp.size;
};
