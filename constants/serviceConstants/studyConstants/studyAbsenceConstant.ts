import dayjs, { Dayjs } from "dayjs";

/**
 * 당일 불참 벌금(포인트)의 단일 출처.
 * 서버 `nest-back` CONST.POINT / Vote2Service.getStudyAbsencePoint()와 같은 값을 유지해야 한다.
 */

/** 결과가 확정되는 시각(시). 이 시각부터 가산이 시작된다. */
export const STUDY_RESULT_HOUR = 9;

/** 자동 매칭 스터디의 당일 불참 기본 벌금. */
export const STUDY_ABSENCE_BASE = 1000;

/** 결과 확정 후 한 시간이 지날 때마다 붙는 가산액. */
export const STUDY_ABSENCE_HOURLY = 100;

/** 가산 상한. 이 금액을 넘지 않는다. */
export const STUDY_ABSENCE_MAX = 2000;

/** realtime(직접 개설·참여) 스터디의 당일 불참 벌금. 시간 가산이 없다. */
export const REALTIME_ABSENCE_POINT = 500;

/**
 * 지금 당일 불참을 신고하면 차감되는 포인트(양수).
 * 09:00에 1,000P에서 시작해 한 시간마다 100P씩 늘고 2,000P에서 멈춘다.
 */
export const getStudyAbsencePoint = (now: Dayjs = dayjs()) => {
  const hoursSinceResult = Math.max(0, now.hour() - STUDY_RESULT_HOUR);

  return Math.min(
    STUDY_ABSENCE_MAX,
    STUDY_ABSENCE_BASE + hoursSinceResult * STUDY_ABSENCE_HOURLY,
  );
};
