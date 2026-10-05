import {
  StudyConfirmedSetProps,
  StudyParticipationsSetProps,
  StudySetProps,
  StudyType,
} from "@/types/models/studyTypes/study-set.types";

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

export const getStudyBadge = (studyType: StudyType, dateStatus: "future" | "current" | "prev") => {
  switch (studyType) {
    case "participations":
      // 라운지(매칭 신청자 모음)의 상태. 동작처럼 읽히는 "신청" 대신 상태로 적는다.
      return { text: "모집중", colorScheme: "blue" };
    case "soloRealTimes":
      return { text: "공부 인증", colorScheme: "red" };
    default:
      if (dateStatus === "current") {
        return { text: "오늘의 스터디", colorScheme: "mint" };
      } else if (dateStatus === "future") {
        // 정규 매칭의 9시 전 결과는 미리보기다(확정 아님). 확정과 같은 이름을 쓰면 이미 성사된
        // 것으로 읽힌다. 직접 개설은 이미 열린 스터디라 그대로 "예정된 스터디"다.
        return studyType === "results"
          ? { text: "오픈 예정", colorScheme: "purple" }
          : { text: "예정된 스터디", colorScheme: "purple" };
      } else {
        return { text: "지난 스터디", colorScheme: "black" };
      }
  }
};
