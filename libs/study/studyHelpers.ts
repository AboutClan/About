import { StudyType } from "../../types/models/studyTypes/study-set.types";

export const getStudyBadge = (studyType: StudyType) => {
  switch (studyType) {
    case "participations":
      return { text: "스터디 매칭", colorScheme: "mint" };
    case "soloRealTimes":
      return { text: "스터디 인증", colorScheme: "mint" };

    case "openRealTimes":
      return { text: "모임장 스터디", colorScheme: "blue" };
    case "results":
      return { text: "매칭 스터디", colorScheme: "red" };
    case "expectedResults":
      return { text: "진행 예정", colorScheme: "mint" };
  }
};
