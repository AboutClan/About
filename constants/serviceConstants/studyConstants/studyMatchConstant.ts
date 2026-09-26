/**
 * 매칭 성사 기준. 서버 `doAlgorithm`의 상수와 같은 값을 유지해야 한다.
 * (nest-back `vote2.service.ts` — standardCnt / reducedCnt / MIN_OVERLAP_MINUTES)
 */

/** 목표 그룹 인원. */
export const STUDY_TARGET_MEMBER_COUNT = 5;

/** 목표에 미달할 때 축소해 시도하는 최소 인원. 이 인원도 못 모으면 매칭되지 않는다. */
export const STUDY_MIN_MEMBER_COUNT = 4;

/** 같은 그룹으로 묶이기 위해 필요한 최소 시간 겹침(분). */
export const STUDY_MIN_OVERLAP_MINUTES = 60;
