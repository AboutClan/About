/**
 * 매칭 범위 슬라이더(1~3단계)에 딸린 값들의 단일 출처.
 *
 * 서버(nest-back `doAlgorithm`)는 `eps + 0.1`을 반경(km)으로 써서
 * `haversineDistance(장소, 기준점) <= eps` 로 참여 가능 여부를 판정한다.
 */

/** 슬라이더 단계 → 서버로 보내는 eps. */
export const RANGE_TO_EPS: Record<number, number> = { 1: 2, 2: 3, 3: 4 };

/** 서버가 실제로 쓰는 반경(km). eps + 0.1. */
export const MATCH_RADIUS_KM: Record<number, number> = { 1: 2.1, 2: 3.1, 3: 4.1 };

/** 사용자에게 보여주는 예상 이동 시간(분). 위 반경 × 5분/km(≈12km/h). */
export const RANGE_LABEL_MIN: Record<number, number> = { 1: 10, 2: 15, 3: 20 };

export const DEFAULT_RANGE_NUM = 2;
