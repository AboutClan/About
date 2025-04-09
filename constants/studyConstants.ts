import { ThemeTypings } from "@chakra-ui/system";

import { StudyStatus } from "../types/models/studyTypes/studyDetails";

export const STUDY_STATUS_TO_BADGE: Record<
  StudyStatus,
  { text: string; colorScheme: ThemeTypings["colorSchemes"] }
> = {
  open: { text: "스터디 오픈", colorScheme: "red" },
  free: { text: "자유 스터디", colorScheme: "blue" },
  recruiting: { text: "신청자 모집중", colorScheme: "mint" },
  expected: { text: "스터디 진행 예정", colorScheme: "purple" },
};
