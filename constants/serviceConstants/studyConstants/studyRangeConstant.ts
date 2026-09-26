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

/**
 * 사용자에게 보여주는 반경(km).
 *
 * 예전에는 예상 이동 시간(분)을 보여줬는데, 반경을 12km/h로 나눈 값이라
 * "2.1km를 10분"처럼 도보로는 불가능한 숫자였다. 이동 수단을 가정하지 않는
 * 거리로 표기한다. 판정 반경은 eps+0.1km지만 0.1은 부동소수점 오차용 버퍼라
 * 표기에는 넣지 않는다.
 */
export const RANGE_LABEL_KM: Record<number, number> = RANGE_TO_EPS;

export const DEFAULT_RANGE_NUM = 2;
