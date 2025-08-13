import { STUDY_COVER_IMAGES } from "../../assets/images/studyCover";
import { STUDY_MAIN_IMAGES } from "../../assets/images/studyMain";
import {
  RealTimeMemberProps,
  RealTimesStatus,
  StudyMemberProps,
  StudyOneDayProps,
  StudyParticipationProps,
  StudyResultProps,
  StudyStatus as StudyStatus2,
  StudyVoteDataProps,
} from "../../types/models/studyTypes/baseTypes";
import {
  MergeStudyPlaceProps,
  StudyMergeResultProps,
  StudySetProps,
  StudyStatus,
} from "../../types/models/studyTypes/derivedTypes";
import { PlaceInfoProps } from "../../types/models/utilTypes";
import { getRandomIdx } from "../../utils/mathUtils";

export const convertStudyToMergeStudy = (
  studyVoteData: StudyVoteDataProps,
): StudyMergeResultProps[] => {
  const convertedRealTimes = studyVoteData?.realTimes
    ? convertRealTimesToMergeResult(studyVoteData.realTimes.userList)
    : [];
  const mergedResult = [...studyVoteData.results, ...convertedRealTimes].map((result) => ({
    ...result,
    place: convertStudyToPlaceInfo(result.place),
    status:
      (result as RealTimesToResultProps)?.status ||
      (!studyVoteData?.participations ? "open" : null),
  }));

  return mergedResult;
};

export interface RealTimesToResultProps extends Omit<StudyResultProps, "place"> {
  place: PlaceInfoProps;
  status?: StudyStatus2;
}

export const setStudyWeekData = (studyWeekData: StudyOneDayProps[] = []): StudySetProps => {
  return studyWeekData.reduce<StudySetProps>(
    (acc, oneDay) => {
      const { date, participations = [], realTimes, results = [] } = oneDay;
      // 1) 참여 내역
      acc.participations.push(...participations.map((par) => ({ date: oneDay.date, study: par })));
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
        acc.soloRealTimes.push(...soloUsers.map((study) => ({ date, study })));
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
export const setStudyOneDayData = (studyOneData: StudyVoteDataProps): StudySetProps => {
  if (!studyOneData) return;

  const studySet: StudySetProps = {
    participations: [],
    soloRealTimes: [],
    openRealTimes: [],
    results: [],
  };
  studyOneData.results.forEach((result) => {
    studySet["results"].push({ date: studyOneData.date, study: result });
  });
  studyOneData.realTimes.userList.forEach((user) => {
    if (user.status === "solo") {
      studySet["soloRealTimes"].push({ date: studyOneData.date, study: user });
    }
  });

  const realTimesGroup = setRealTimesGroup(
    studyOneData.realTimes.userList.filter((user) => user.status !== "solo"),
  );
  realTimesGroup.forEach((group) => {
    studySet["openRealTimes"].push({ date: studyOneData.date, study: group });
  });

  return studySet;
  //   (acc, oneDay) => {
  //     const { date, participations = [], realTimes, results = [] } = oneDay;
  //     // 1) 참여 내역
  //     acc.participations.push(...participations);
  //     // 2) 실시간: solo / open 한 번에 분리
  //     if (realTimes?.userList?.length) {
  //       const { soloUsers, openUsers } = realTimes.userList.reduce(
  //         (b, u) => {
  //           if (u.status === "solo") b.soloUsers.push(u);
  //           else b.openUsers.push(u);
  //           return b;
  //         },
  //         {
  //           soloUsers: [] as typeof realTimes.userList,
  //           openUsers: [] as typeof realTimes.userList,
  //         },
  //       );
  //       acc.soloRealTimes.push(...soloUsers);
  //       const openGroups = setRealTimesGroup(openUsers);
  //       acc.openRealTimes.push(...openGroups.map((study) => ({ date, study })));
  //     }
  //     // 3) 결과
  //     acc.results.push(...results.map((study) => ({ date, study })));

  //     return acc;
  //   },
  //   { participations: [], soloRealTimes: [], openRealTimes: [], results: [] },
  // );
};

export interface RealTimesToResultProps extends Omit<StudyResultProps, "place"> {
  place: PlaceInfoProps;
  status?: StudyStatus2;
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

const STUDY_WAITING_INFO = {
  name: "스터디 매칭 대기실",
  branch: "About",
  address: "위치 선정 중",
  brand: "",
  image: STUDY_MAIN_IMAGES[getRandomIdx(STUDY_COVER_IMAGES.length - 1)],
  coverImage: STUDY_COVER_IMAGES[getRandomIdx(STUDY_COVER_IMAGES.length - 1)],
  latitude: null,
  longitude: null,
  time: "당일 오전 9시",
  _id: null,
  reviews: [],
};

const STUDY_SOLO_INFO = {
  name: "개인 스터디 인증",
  branch: "About",
  address: "자유 카페 / 스터디 카페",
  brand: "",
  image: STUDY_MAIN_IMAGES[getRandomIdx(STUDY_COVER_IMAGES.length - 1)],
  coverImage: STUDY_COVER_IMAGES[getRandomIdx(STUDY_COVER_IMAGES.length - 1)],

  latitude: null,
  longitude: null,
  time: "하루 공부가 끝나는 순간까지",

  _id: null,
  reviews: [],
};

export const convertStudyToPlaceInfo = (
  study: StudyParticipationProps | RealTimeMemberProps | RealTimesToResultProps | StudyResultProps,
  studyStatus: StudyStatus,
): MergeStudyPlaceProps => {
  if (studyStatus === "soloRealTimes") return STUDY_SOLO_INFO;
  else if (studyStatus === "participations") return STUDY_WAITING_INFO;
  if (!study) return;

  const studyPlace = (study as StudyResultProps).place;
  const realTimePlace = (study as RealTimeMemberProps).place;

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

export const convertRealTimesToMergeResult = (
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
