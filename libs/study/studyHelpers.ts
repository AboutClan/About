import {
  StudyConfirmedSetProps,
  StudyParticipationsSetProps,
  StudySetProps,
  StudyType,
} from "../../types/models/studyTypes/study-set.types";

export const getMyStudyDateArr = (
  studySet: StudySetProps,
  myId: string,
): { date: string; type: StudyType; placeId?: string }[] => {
  if (!studySet || !myId) return null;
  const dateArr: { date: string; type: StudyType; placeId?: string }[] = [];
  (["participations", "openRealTimes", "results", "soloRealTimes"] as StudyType[]).forEach(
    (key) => {
      (studySet[key] as StudyConfirmedSetProps[] | StudyParticipationsSetProps[]).forEach(
        (study) => {
          if (key === "participations") {
            const study2: StudyParticipationsSetProps = study;
            study2.study.forEach((props) => {
              if (props.user._id === myId) {
                dateArr.push({ date: study2.date, type: key });
              }
            });
          } else {
            const study2: StudyConfirmedSetProps = study;
            study2.study.members.forEach((props) => {
              if (props.user._id === myId) {
                dateArr.push({ date: study2.date, type: key, placeId: study2.study.place._id });
              }
            });
          }
        },
      );
    },
  );
  return dateArr;
};

export const getStudyBadge = (
  studyType: StudyType,
  isFutureDate: boolean,
  isConfirmed?: boolean,
) => {
  switch (studyType) {
    case "participations":
      return { text: "스터디 매칭 신청", colorScheme: "blue" };
    case "soloRealTimes":
      return { text: "공부 인증", colorScheme: "red" };
    case "openRealTimes":
      if (isFutureDate) {
        if (isConfirmed) {
          return { text: "확정된 스터디", colorScheme: "mint" };
        }
        return { text: "예정된 스터디", colorScheme: "purple" };
      }
      return { text: "모임장 스터디", colorScheme: "mint" };
    case "results":
      if (isFutureDate) return { text: "진행 확정", colorScheme: "purple" };
      else {
        if (isConfirmed) {
          return { text: "진행중인 스터디", colorScheme: "mint" };
        }
        return { text: "확정된 스터디", colorScheme: "mint" };
      }
  }
};
