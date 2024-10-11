import dayjs, { Dayjs } from "dayjs";

import { StudyParticipationProps } from "../../types/models/studyTypes/studyDetails";

export const getMyStudy = (
  participations: StudyParticipationProps[],
  myUid: string,
): StudyParticipationProps | null => {
  let myStudy: StudyParticipationProps | null = null;
  participations.forEach((par) =>
    par.members.forEach((who) => {
      if (who.user.uid === myUid && who.firstChoice && par.status !== "dismissed") {
        myStudy = par;
      }
    }),
  );

  return myStudy;
};

interface IMyStudyVoteInfo {
  placeId: string;
  start: Dayjs;
  end: Dayjs;
  arrived?: Date;
  startTime?: Dayjs;
  fullname: string;
}

export const getMyStudyVoteInfo = (
  myStudy: StudyParticipationProps,
  myUid: string,
): IMyStudyVoteInfo => {
  if (!myStudy) return null;
  const {
    time: { start, end },
    arrived = null,
  } = myStudy.members.find((who) => who.user.uid === myUid);

  return {
    placeId: myStudy.place._id,
    fullname: myStudy.place.fullname,
    startTime: myStudy?.startTime ? dayjs(myStudy.startTime) : null,
    start,
    end,
    arrived,
  };
};
