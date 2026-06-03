import { StudyRatingProps } from "../../types/models/studyTypes/study-entity.types";

export const calculateTotalScore = (ratings: StudyRatingProps[]) => {
  const AIReview = ratings.find((r) => r.name === "어바웃 AI");
  const reviews = ratings.filter((r) => r.name !== "어바웃 AI");

  if (!AIReview) throw new Error("AI review not found");

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

/** ratings 배열이 없거나 AI 리뷰가 없을 때 0으로 폴백하는 안전 버전 */
export const getPlaceScore = (ratings: StudyRatingProps[] | undefined | null) => {
  if (!ratings?.length) return DEFAULT_SCORE;
  try {
    return calculateTotalScore(ratings);
  } catch {
    return DEFAULT_SCORE;
  }
};
