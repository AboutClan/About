import { ThemeTypings } from "@chakra-ui/system";

import { StudyStatus } from "../types/models/studyTypes/studyDetails";

export const STUDY_STATUS_TO_BADGE: Record<
  StudyStatus | "expected",
  { text: string; colorScheme: ThemeTypings["colorSchemes"] }
> = {
  open: { text: "스터디 오픈", colorScheme: "red" },
  dismissed: { text: "닫힘", colorScheme: "gray" },
  cancel: { text: "취소", colorScheme: "gray" },
  free: { text: "자유 참여", colorScheme: "purple" },
  pending: { text: "신청 가능", colorScheme: "mint" },
  expected: { text: "오픈 예정", colorScheme: "blue" },
  solo: { text: "개인 스터디", colorScheme: "purple" },
};
