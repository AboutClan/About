import { ThemeTypings } from "@chakra-ui/system";

import { StudyStatus } from "../types/models/studyTypes/baseTypes";

export const STUDY_STATUS_TO_BADGE: Record<
  StudyStatus | "recruiting" | "expected",
  { text: string; colorScheme: ThemeTypings["colorSchemes"] }
> = {
  open: { text: "스터디 오픈", colorScheme: "red" },
  free: { text: "자유 스터디", colorScheme: "blue" },
  solo: { text: "개인 스터디", colorScheme: "blue" },
  recruiting: { text: "신청자 모집중", colorScheme: "mint" },
  expected: { text: "진행 예정", colorScheme: "purple" },
  cancel: { text: "취소된 스터디", colorScheme: "gray" },
};
