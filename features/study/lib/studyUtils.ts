import { StudyRatingProps } from "@/types/models/studyTypes/study-entity.types";

export const calculateTotalScore = (ratings: StudyRatingProps[]) => {
  const AIReview = ratings.find((r) => r.name === "어바웃 AI");
  const reviews = ratings.filter((r) => r.name !== "어바웃 AI");

  if (!AIReview) throw new Error("AI review not found");
  // 점수 계산식은 손대지 않는다. 아래 getPlaceScore 의 캐시만 추가됨.

  const divisor = 3 + reviews.length;

  const rawMood =
    (AIReview.mood * 3 + reviews.reduce((acc, cur) => acc + cur.mood, 0)) / divisor;
  const rawPower =
    (AIReview.power * 3 + reviews.reduce((acc, cur) => acc + cur.power, 0)) / divisor;
  const rawSpace =
    (AIReview.space * 3 + reviews.reduce((acc, cur) => acc + cur.space, 0)) / divisor;
  const rawEtc =
    (AIReview.etc * 3 + reviews.reduce((acc, cur) => acc + cur.etc, 0)) / divisor;
  const rawTotal = (rawMood + rawPower + rawSpace + rawEtc) / 4;

  return {
    mood: Number(rawMood.toFixed(1)),
    power: Number(rawPower.toFixed(1)),
    space: Number(rawSpace.toFixed(1)),
    etc: Number(rawEtc.toFixed(1)),
    total: Number(rawTotal.toFixed(1)),
  };
};

const DEFAULT_SCORE = { mood: 0, power: 0, space: 0, etc: 0, total: 0 };

/**
 * ratings 배열 identity 로 결과를 캐시한다.
 * 지도 필터·마커·리스트가 같은 place 를 한 프레임에 여러 번 채점하는데
 * (matchesFilters 는 amenityFilters.every 안에서 최대 3번 호출),
 * 매 호출이 find + filter + reduce 4회 + AI 리뷰 없는 place 의 throw/catch 를 탄다.
 * react-query 캐시가 배열 identity 를 유지하므로 WeakMap 으로 충분하다.
 */
const scoreCache = new WeakMap<StudyRatingProps[], ReturnType<typeof calculateTotalScore>>();

/** ratings 배열이 없거나 AI 리뷰가 없을 때 0으로 폴백하는 안전 버전 */
export const getPlaceScore = (ratings: StudyRatingProps[] | undefined | null) => {
  if (!ratings?.length) return DEFAULT_SCORE;

  const cached = scoreCache.get(ratings);
  if (cached) return cached;

  let score: ReturnType<typeof calculateTotalScore>;
  try {
    score = calculateTotalScore(ratings);
  } catch {
    score = DEFAULT_SCORE;
  }
  scoreCache.set(ratings, score);
  return score;
};
