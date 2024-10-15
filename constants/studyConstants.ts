import { ThemeTypings } from "@chakra-ui/system";

import { StudyStatus } from "../types/models/studyTypes/studyDetails";

export const STUDY_STATUS_TO_BADGE: Record<
  StudyStatus,
  { text: string; colorScheme: ThemeTypings["colorSchemes"] }
> = {
  open: { text: "스터디 오픈", colorScheme: "mint" },
  dismissed: { text: "닫힘", colorScheme: "gray" },
  free: { text: "자유참여", colorScheme: "purple" },
  pending: { text: "신청가능", colorScheme: "orange" },
  pending2: { text: "오픈예정", colorScheme: "red" },
};
