import { STUDY_COVER_IMAGES } from "../../assets/images/studyCover";
import { STUDY_MAIN_IMAGES } from "../../assets/images/studyMain";
import {
  RealTimeMemberProps,
  RealTimesStatus,
  StudyMemberProps,
  StudyOneDayProps,
  StudyPlaceProps,
  StudyResultProps,
  StudyStatus,
} from "../../types/models/studyTypes/baseTypes";
import { MergeStudyPlaceProps, StudySetProps } from "../../types/models/studyTypes/derivedTypes";
import { PlaceInfoProps } from "../../types/models/utilTypes";
import { getRandomIdx } from "../../utils/mathUtils";

export const setStudyWeekData = (studyWeekData: StudyOneDayProps[] = []): StudySetProps => {
  return studyWeekData.reduce<StudySetProps>(
    (acc, oneDay) => {
      const { date, participations = [], realTimes, results = [] } = oneDay;
      // 1) 참여 내역
      acc.participations.push(...participations);
      // 2) 실시간: solo / open 한 번에 분리
      if (realTimes?.userList?.length) {
        const { soloUsers, openUsers } = realTimes.userList.reduce(
          (b, u) => {
            if (u.status === "solo") b.soloUsers.push(u);
            else b.openUsers.push(u);
            return b;
          },
          {
            soloUsers: [] as typeof realTimes.userList,
            openUsers: [] as typeof realTimes.userList,
          },
        );
        acc.soloRealTimes.push(...soloUsers);
        const openGroups = setRealTimesGroup(openUsers);
        acc.openRealTimes.push(...openGroups.map((study) => ({ date, study })));
      }
      // 3) 결과
      acc.results.push(...results.map((study) => ({ date, study })));

      return acc;
    },
    { participations: [], soloRealTimes: [], openRealTimes: [], results: [] },
  );
};

export interface RealTimesToResultProps extends Omit<StudyResultProps, "place"> {
  place: PlaceInfoProps;
  status?: StudyStatus;
}

export const setRealTimesGroup = (
  studyRealTimeArr: RealTimeMemberProps[],
): RealTimesToResultProps[] => {
  if (!studyRealTimeArr) return;
  const temp: {
    place: PlaceInfoProps;
    status: RealTimesStatus;
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

export const convertMergePlaceToPlace = (
  mergePlace: StudyPlaceProps | PlaceInfoProps,
): MergeStudyPlaceProps => {
  if (!mergePlace) return;
  const studyPlace = mergePlace as StudyPlaceProps;
  const realTimePlace = mergePlace as PlaceInfoProps;

  return {
    name: studyPlace?.fullname || realTimePlace?.name,
    branch: studyPlace?.branch || realTimePlace?.name.split(" ")?.[1] || "정보 없음",
    address: studyPlace?.locationDetail || realTimePlace?.address,
    brand: studyPlace?.brand || realTimePlace?.name.split(" ")?.[0] || "",
    image: studyPlace?.image || STUDY_MAIN_IMAGES[getRandomIdx(STUDY_MAIN_IMAGES.length - 1)],
    coverImage:
      studyPlace?.coverImage || STUDY_COVER_IMAGES[getRandomIdx(STUDY_COVER_IMAGES.length - 1)],
    latitude: studyPlace.latitude,
    longitude: studyPlace.longitude,
    time: studyPlace?.time || "unknown",
    // type: studyPlace?.fullname
    //   ? "public"
    //   : realTimePlace?.name
    //   ? "private"
    //   : (null as "public" | "private"),

    _id: studyPlace?._id || realTimePlace?._id,
    reviews: studyPlace?.reviews || [],
  };
};
