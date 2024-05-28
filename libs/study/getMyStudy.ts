import dayjs, { Dayjs } from "dayjs";

import { IParticipation } from "../../types/models/studyTypes/studyDetails";

export const getMyStudy = (
  participations: IParticipation[],
  myUid: string,
): IParticipation | null => {
  let myStudy: IParticipation | null = null;
  participations.forEach((par) =>
    par.attendences.forEach((who) => {
      if (who.user.uid === myUid && who.firstChoice && par.status !== "dismissed") {
        myStudy = par;
      }
    }),
  );
  console.log(34, participations, myStudy);
  return myStudy;
};

interface IMyStudyVoteInfo {
  placeId: string;
  start: Dayjs;
  end: Dayjs;
  arrived?: Date;
  startTime?: Dayjs;
}

export const getMyStudyVoteInfo = (myStudy: IParticipation, myUid: string): IMyStudyVoteInfo => {
  if (!myStudy) return null;
  const {
    time: { start, end },
    arrived = null,
  } = myStudy.attendences.find((who) => who.user.uid === myUid);

  return {
    placeId: myStudy.place._id,
    startTime: myStudy?.startTime ? dayjs(myStudy.startTime) : null,
    start,
    end,
    arrived,
  };
};
