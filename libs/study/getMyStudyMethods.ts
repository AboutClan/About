import {
  RealTimeInfoProps,
  StudyDailyInfoProps,
  StudyMemberProps,
  StudyMergeParticipationProps,
} from "../../types/models/studyTypes/studyDetails";

//participation은 study의 participations와 realTime을 모두 포함한다.

export const convertStudyToParticipations = (studyVoteData: StudyDailyInfoProps) => {
  if (!studyVoteData) return;
  console.log(3131);
  const temp: StudyMergeParticipationProps[] = [];

  studyVoteData.realTime.forEach((props) => {
    const findParticipationIdx = temp.findIndex(
      (participation) => participation.place._id === props.place._id,
    );

    if (findParticipationIdx !== -1) {
      temp[findParticipationIdx].members.push(props);
    } else {
      temp.push({
        place: props.place,
        status: props.status,
        members: [props],
      });
    }
  });

  return [...studyVoteData.participations, ...temp].sort((a, b) => {
    const aCnt = a.members.length;
    const bCnt = b.members.length;
    if (aCnt > bCnt) return -1;
    else if (aCnt < bCnt) return 1;
    return 0;
  });
};

export const getStudyParticipationById = (
  studyVoteData: StudyDailyInfoProps,
  id: string,
): StudyMergeParticipationProps => {
  const findMyParticipation = studyVoteData.participations.find(
    (participation) => participation.place._id === id,
  );
  console.log(222, findMyParticipation);
  const realTimeFiltered = getRealTimeFilteredById(studyVoteData.realTime, id);

  return findMyParticipation || realTimeFiltered;
};

export const getMyStudyParticipation = (
  studyVoteData: StudyDailyInfoProps,
  myUid: string,
): StudyMergeParticipationProps => {
  const findMyParticipation = studyVoteData.participations.find((participation) =>
    participation.members.some((who) => who.user.uid === myUid),
  );
  const myRealTimeFiltered = getMyRealTimeFiltered(studyVoteData.realTime, myUid);

  return findMyParticipation || myRealTimeFiltered;
};

export const getMyRealTimeFiltered = (
  realTime: RealTimeInfoProps[],
  myUid: string,
): StudyMergeParticipationProps => {
  if (!realTime || !myUid) return;
  const findMyStudy = realTime.find((who) => who.user.uid === myUid);
  if (!findMyStudy) return null;
  const filtered = realTime.filter((who) => who.place.name === findMyStudy?.place.name);
  return { ...findMyStudy, members: filtered };
};
export const getRealTimeFilteredById = (
  realTime: RealTimeInfoProps[],
  id: string,
): StudyMergeParticipationProps => {
  if (!realTime || !id) return;
  const findStudy = realTime.find((who) => who._id === id);
  if (!findStudy) return null;
  const filtered = realTime.filter((who) => who.place.name === findStudy?.place.name);

  return { ...findStudy, members: filtered };
};

import dayjs, { Dayjs } from "dayjs";

import { StudyParticipationProps } from "../../types/models/studyTypes/studyDetails";

export const getMyStudyInfo = (
  participations: StudyMergeParticipationProps,
  myUid: string,
): StudyMemberProps => {
  if (!participations || !myUid) return;

  return participations.members.find((who) => who.user.uid === myUid);
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
