import { ThemeTypings } from "@chakra-ui/system";

import { StudyStatus } from "../types/models/studyTypes/studyDetails";

export const STUDY_STATUS_TO_BADGE: Record<
  StudyStatus,
  { text: string; colorScheme: ThemeTypings["colorSchemes"] }
> = {
  open: { text: "스터디 오픈", colorScheme: "red" },
  free: { text: "자유 스터디", colorScheme: "purple" },
  recruiting: { text: "모집중", colorScheme: "mint" },
  expected: { text: "오픈 예정", colorScheme: "blue" },
};
