/**
 * 스터디 챌린지 스탬프와 월간 랭킹 보상.
 * 서버 `nest-back` PrizeService.processStudyBadgePrize()와 같은 구간을 유지해야 한다.
 */

/** 스탬프를 받는 행동. 정규 매칭 신청 1개 + 스터디 출석 1개. */
export const STUDY_BADGE_RULES = [
  { label: "정규 매칭 신청", desc: "매칭이 안 돼도 지급", cnt: 1 },
  { label: "스터디 출석 체크", desc: "확정된 스터디에 출석", cnt: 1 },
] as const;

export interface StudyBadgePrizeTier {
  from: number;
  to: number;
  label: string;
  emoji: string;
}

/** 매월 1일 정산. 동점이면 먼저 달성한 사람이 상위. */
export const STUDY_BADGE_PRIZE_TIERS: StudyBadgePrizeTier[] = [
  { from: 1, to: 5, label: "카공족 이용권", emoji: "🎫" },
  { from: 6, to: 20, label: "커피 기프티콘", emoji: "☕" },
  { from: 21, to: 50, label: "500 포인트", emoji: "🪙" },
];

/** 내 순위가 속한 보상 구간. 순위가 없거나 50등 밖이면 null. */
export const getStudyBadgePrizeTier = (rank: number | null) => {
  if (!rank) return null;

  return STUDY_BADGE_PRIZE_TIERS.find((tier) => rank >= tier.from && rank <= tier.to) ?? null;
};

/** 다음 보상 구간. 이미 1등 구간이면 null. */
export const getNextStudyBadgePrizeTier = (rank: number | null) => {
  if (!rank) return STUDY_BADGE_PRIZE_TIERS[STUDY_BADGE_PRIZE_TIERS.length - 1];

  return [...STUDY_BADGE_PRIZE_TIERS].reverse().find((tier) => tier.to < rank) ?? null;
};

/**
 * 다음에 노려볼 보상 구간. 500 포인트 구간은 목표로 내걸지 않는다 —
 * 받는 사람 입장에서 포인트는 상품으로 읽히지 않는다.
 * 기프티콘 구간(20등) 밖이면 기프티콘을, 안이면 이용권(5등)을 목표로 준다.
 */
const GOAL_TIER_TO_RANKS = [20, 5];

export const getStudyBadgeGoalTier = (rank: number | null) => {
  const goalTo = GOAL_TIER_TO_RANKS.find((to) => !rank || rank > to);
  if (!goalTo) return null;

  return STUDY_BADGE_PRIZE_TIERS.find((tier) => tier.to === goalTo) ?? null;
};
