import { STUDY_COVER_IMAGES } from "../../assets/images/studyCover";
import { STUDY_MAIN_IMAGES } from "../../assets/images/studyMain";
import {
  InitialParticipationsProps,
  InitialRealTimesProps,
  StudySetInitialDataProps,
} from "../../hooks/study/queries";
import {
  StudyConfirmedProps,
  StudyParticipationProps,
  StudyStatus,
} from "../../types/models/studyTypes/study-entity.types";
import {
  StudyOneDayProps,
  StudySetProps,
  StudyType,
} from "../../types/models/studyTypes/study-set.types";
import { PlaceInfoProps } from "../../types/models/utilTypes";
import { getRandomIdx } from "../../utils/mathUtils";

// export const convertStudyToMergeStudy = (
//   studyVoteData: StudyOneDayProps,
//   studyStatus: StudyType,
// ): StudyMergeResultProps[] => {
//   const convertedRealTimes = studyVoteData?.realTimes
//     ? convertRealTimesToMergeResult(studyVoteData.realTimes.userList)
//     : [];
//   const mergedResult = [...studyVoteData.results, ...convertedRealTimes].map((result) => ({
//     ...result,
//     place: convertStudyToPlaceInfo(result.place, studyStatus),
//     status:
//       (result as RealTimesToResultProps)?.status ||
//       (!studyVoteData?.participations ? "open" : null),
//   }));

//   return mergedResult;
// };

export const setStudyWeekData = (
  initialStudySet: StudySetInitialDataProps[] = [],
): StudySetProps => {
  const studySet = initialStudySet.map((data) =>
    data?.participations
      ? {
          ...data,
          participations: data?.participations.map((par) => convertParticipation(par)),
        }
      : data,
  );
  
  return studySet.reduce<StudySetProps>(
    (acc, oneDay) => {
      const { date, participations = [], realTimes, results = [] } = oneDay;
      // 1) 참여 내역
      acc.participations.push(...participations.map((par) => ({ date: oneDay.date, study: par })));
      // 2) 실시간: solo / open 한 번에 분리
      if (realTimes?.length) {
        const { soloUsers, openUsers } = realTimes.reduce(
          (b, u) => {
            if (u.status === "solo") b.soloUsers.push(u);
            else b.openUsers.push(u);
            return b;
          },
          {
            soloUsers: [] as typeof realTimes,
            openUsers: [] as typeof realTimes,
          },
        );

        acc.soloRealTimes.push(
          ...soloUsers.map((user) => ({
            date,
            study: {
              place: {
                title: user.location.name,
                location: {
                  latitude: user.location.latitude,
                  longitude: user.location.longitude,
                  address: user.location.address,
                },
                _id: user.location._id,
              },
              members: [
                {
                  user: user.user,
                  time: user.time,
                  attendance: {
                    time: user?.arrived,
                    memo: user?.memo,
                    type: (user?.arrived ? "arrived" : user?.absence ? "absenced" : undefined) as
                      | "arrived"
                      | "absenced",
                    attendanceImage: "",
                  },
                  comment: {
                    comment: user?.comment,
                  },
                },
              ],
              status: user.status,
            },
          })),
        );
        const openGroups = setRealTimesGroup(openUsers);
        acc.openRealTimes.push(
          ...openGroups.map((group) => ({
            date: oneDay.date,
            study: group,
          })),
        );
      }
      // 3) 결과
      acc.results.push(...results.map((study) => ({ date, study })));

      return acc;
    },
    { participations: [], soloRealTimes: [], openRealTimes: [], results: [] },
  );
};
export const setStudyOneDayData = (studyOneData: StudyOneDayProps, date: string): StudySetProps => {
  if (!studyOneData) return;

  const studySet: StudySetProps = {
    participations: [],
    soloRealTimes: [],
    openRealTimes: [],
    results: [],
  };
  
  studyOneData.results.forEach((result) => {
    studySet["results"].push({ date: date, study: result });
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

export interface RealTimesToResultProps extends Omit<StudyConfirmedProps, "place"> {
  place: PlaceInfoProps;
  status?: StudyStatus2;
}

export const setRealTimesGroup = (
  studyRealTimeArr: InitialRealTimesProps[],
): StudyConfirmedProps[] => {
  if (!studyRealTimeArr) return;
  const temp: StudyConfirmedProps[] = [];

  studyRealTimeArr.forEach((props) => {
    const findParticipationIdx = temp.findIndex(
      (participation) => participation.place._id === props.location._id,
    );

    if (findParticipationIdx !== -1) {
      temp[findParticipationIdx].members.push({
        user: props.user,
        time: props.time,
        attendance: {
          time: props?.arrived,
          memo: props?.memo,
          type: (props?.arrived ? "arrived" : props?.absence ? "absenced" : undefined) as
            | "arrived"
            | "absenced",
          attendanceImage: "",
        },
        comment: {
          comment: props?.comment,
        },
      });
    } else {
      temp.push({
        status: props.status,
        place: {
          title: props.location.name,
          location: {
            latitude: props.location.latitude,
            longitude: props.location.longitude,
            address: props.location.address,
          },
          _id: props.location._id,
        },
        members: [
          {
            user: props.user,
            time: props.time,
            attendance: {
              time: props?.arrived,
              memo: props?.memo,
              type: (props?.arrived ? "arrived" : props?.absence ? "absenced" : undefined) as
                | "arrived"
                | "absenced",
              attendanceImage: "",
            },
            comment: {
              comment: props?.comment,
            },
          },
        ],
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
  name: "스터디 매칭 라운지",
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
  name: "실시간 공부 인증",
  branch: "About",
  address: "자유 카페 / 자유 공간",
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
  study:
    | StudyParticipationProps
    | RealTimeMemberProps
    | RealTimesToResultProps
    | StudyConfirmedProps,
  studyStatus: StudyType,
): MergeStudyPlaceProps => {
  if (studyStatus === "soloRealTimes") return STUDY_SOLO_INFO;
  else if (studyStatus === "participations") return STUDY_WAITING_INFO;
  if (!study) return;
  
  const studyPlace = (study as StudyConfirmedProps).place;
  const realTimePlace = (study as RealTimeMemberProps).place;

  return {
    name: studyPlace?.title || realTimePlace?.name,
    // branch: studyPlace?.branch || realTimePlace?.name.split(" ")?.[1] || "정보 없음",
    // brand: studyPlace?.brand || realTimePlace?.name.split(" ")?.[0] || "",
    image: studyPlace?.image || STUDY_MAIN_IMAGES[getRandomIdx(STUDY_MAIN_IMAGES.length - 1)],
    coverImage:
      studyPlace?.coverImage || STUDY_COVER_IMAGES[getRandomIdx(STUDY_COVER_IMAGES.length - 1)],
    location: studyPlace?.location || realTimePlace,
    // time: studyPlace?.time || "unknown",

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
    status: StudyStatus;
    members: StudyConfirmedMemberProps[];
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

const convertParticipation = (
  participation: InitialParticipationsProps,
): StudyParticipationProps => {
  return {
    user: participation.user,
    location: {
      latitude: participation.latitude,
      longitude: participation.longitude,
      address: participation.locationDetail,
    },
    times: {
      start: participation.start,
      end: participation.end,
    },
    isBeforeResult: participation.isBeforeResult,
  };
};
