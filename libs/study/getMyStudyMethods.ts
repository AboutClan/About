import {
  RealTimeMemberProps,
  StudyMemberProps,
  StudyMergeParticipationProps,
  StudyMergeResultProps,
  StudyPlaceProps,
  StudyStatus,
  StudyVoteDataProps,
} from "../../types/models/studyTypes/studyDetails";
import { PlaceInfoProps } from "../../types/models/utilTypes";
//participation은 study의 participations와 realTime을 모두 포함한다.

export const convertRealTimesToResultFormat = (
  studyRealTimeArr: RealTimeMemberProps[],
): StudyMergeResultProps[] => {
  const temp: {
    place: PlaceInfoProps;
    status: StudyStatus;
    members: StudyMemberProps[];
  }[] = [];

  studyRealTimeArr.forEach((props) => {
    const findParticipationIdx = temp.findIndex(
      (participation) => participation.place.name === props.place.name,
    );

    if (findParticipationIdx !== -1) {
      temp[findParticipationIdx].members.push(props);
    } else {
      temp.push({
        status: props.status,
        place: props.place,
        members: [props],
      });
    }
  });

  return [...temp].sort((a, b) => {
    const aCnt = a.members.length;
    const bCnt = b.members.length;
    if (aCnt > bCnt) return -1;
    else if (aCnt < bCnt) return 1;
    return 0;
  });
};

export const getStudyParticipationById = (
  studyVoteData: StudyVoteDataProps,
  id: string,
): StudyMergeParticipationProps => {
  if (!studyVoteData) return;
  const findMyParticipation = studyVoteData.participations.find(
    (participation) => participation.place._id === id,
  );

  const realTimeFiltered = getRealTimeFilteredById(studyVoteData.realTime, id);

  return findMyParticipation || realTimeFiltered;
};

export const getMyStudyParticipation = (
  studyVoteData: StudyVoteDataProps,
  myUid: string,
): StudyMergeParticipationProps => {
  if (!studyVoteData) return;

  const findMyParticipation = studyVoteData.participations?.find((who) => who?.userId === myUid);
  const myRealTimeFiltered = getMyRealTimeFiltered(studyVoteData.realTime, myUid);

  return findMyParticipation || myRealTimeFiltered;
};

export const getMyRealTimeFiltered = (
  realTime: RealTimeMemberProps[],
  myUid: string,
): StudyMergeParticipationProps => {
  if (!realTime || !myUid) return;
  const findMyStudy = realTime.find((who) => who.user.uid === myUid);
  if (!findMyStudy) return null;
  const filtered = realTime.filter((who) => who.place.name === findMyStudy?.place.name);
  return { ...findMyStudy, members: filtered };
};
export const getRealTimeFilteredById = (
  realTime: RealTimeMemberProps[],
  placeId: string,
): StudyMergeParticipationProps => {
  if (!realTime || !placeId) return;
  const findStudy = realTime.find((props) => props.place._id === placeId);
  if (!findStudy) return null;
  const filtered = realTime.filter((who) => who.place.name === findStudy?.place.name);

  return { ...findStudy, members: filtered };
};

export const getMyStudyInfo = (
  participation: StudyMergeParticipationProps,
  myUid: string,
): StudyMemberProps => {
  if (!participation || !myUid) return;

  return participation.members.find((who) => who.user.uid === myUid);
};

export const checkStudyType = (
  participations: StudyMergeParticipationProps,
): "study" | "realTime" => {
  if (!participations) return;
  if ((participations?.place as StudyPlaceProps)?.fullname) return "study";
  else if ((participations?.place as PlaceInfoProps)?.name) return "realTime";
  return null;
};

// export const getMyStudyVoteInfo = (
//   myStudy: StudyParticipationProps,
//   myUid: string,
// ): IMyStudyVoteInfo => {
//   if (!myStudy) return null;
//   const {
//     time: { start, end },
//     arrived = null,
//   } = myStudy.members.find((who) => who.user.uid === myUid);

//   return {
//     placeId: myStudy.place._id,
//     fullname: myStudy.place.fullname,
//     startTime: myStudy?.startTime ? dayjs(myStudy.startTime) : null,
//     start,
//     end,
//     arrived,
//   };
// };
