import {
  StudyConfirmedSetProps,
  StudyParticipationsSetProps,
  StudySetProps,
  StudyType,
} from "../../types/models/studyTypes/study-set.types";

export const getMyStudyDateArr = (
  studySet: StudySetProps,
  myId: string,
): { date: string; type: StudyType }[] => {
  if (!studySet || !myId) return null;
  const dateArr: { date: string; type: StudyType }[] = [];
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
                dateArr.push({ date: study2.date, type: key });
              }
            });
          }
        },
      );
    },
  );
  return dateArr;
};

export const getStudyBadge = (studyType: StudyType, isFutureDate: boolean) => {
  switch (studyType) {
    case "participations":
      return { text: "스터디 매칭", colorScheme: "blue" };
    case "soloRealTimes":
      return { text: "공부 인증", colorScheme: "red" };

    case "openRealTimes":
      return { text: "모임장 스터디", colorScheme: "mint" };
    case "results":
      if (isFutureDate) return { text: "진행 예정", colorScheme: "purple" };
      else return { text: "매칭 스터디", colorScheme: "mint" };
  }
};
