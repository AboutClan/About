import { ThemeTypings } from "@chakra-ui/system";
import { StudyTypeStatus } from "../pages/study/[id]/[date]";

export const STUDY_STATUS_TO_BADGE: Record<
  StudyTypeStatus,
  { text: string; colorScheme: ThemeTypings["colorSchemes"] }
> = {
  voteResult: { text: "공식 스터디", colorScheme: "red" },
  openRealTimes: { text: "모임장 스터디", colorScheme: "blue" },
  soloRealTimes: { text: "개인 스터디", colorScheme: "purple" },
  participations: { text: "스터디 모집중", colorScheme: "mint" },
  expectedResult: { text: "자동 매칭 스터디", colorScheme: "purple" },
};
