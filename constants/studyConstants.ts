import { ThemeTypings } from "@chakra-ui/system";

import { StudyTypeStatus } from "../pages/study/[id]/[date]";

export const STUDY_STATUS_TO_BADGE: Record<
  StudyTypeStatus,
  { text: string; colorScheme: ThemeTypings["colorSchemes"] }
> = {
  voteResult: { text: "공식 스터디", colorScheme: "red" },
  openRealTimes: { text: "모임장 스터디", colorScheme: "blue" },
  soloRealTimes: { text: "스터디 인증", colorScheme: "mint" },
  participations: { text: "스터디 매칭", colorScheme: "mint" },
  expectedResult: { text: "진행 예정", colorScheme: "purple" },
};
