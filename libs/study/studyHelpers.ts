import { StudyType } from "../../types/models/studyTypes/study-set.types";

export const getStudyBadge = (studyType: StudyType, isFutureDate: boolean) => {
  switch (studyType) {
    case "participations":
      return { text: "스터디 라운지", colorScheme: "blue" };
    case "soloRealTimes":
      return { text: "공부 인증", colorScheme: "red" };

    case "openRealTimes":
      return { text: "모임장 스터디", colorScheme: "mint" };
    case "results":
      if (isFutureDate) return { text: "진행 예정", colorScheme: "purple" };
      else return { text: "매칭 스터디", colorScheme: "mint" };
  }
};
