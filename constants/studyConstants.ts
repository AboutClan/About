import { ThemeTypings } from "@chakra-ui/system";

import { StudyStatus } from "../types/models/studyTypes/baseTypes";

export const STUDY_STATUS_TO_BADGE: Record<
  StudyStatus | "recruiting" | "expected",
  { text: string; colorScheme: ThemeTypings["colorSchemes"] }
> = {
  open: { text: "공식 스터디", colorScheme: "red" },
  free: { text: "일일 스터디", colorScheme: "blue" },
  solo: { text: "개인 스터디", colorScheme: "purple" },
  recruiting: { text: "모집중", colorScheme: "mint" },
  expected: { text: "매칭 예정", colorScheme: "purple" },
  cancel: { text: "취소된 스터디", colorScheme: "gray" },
};
