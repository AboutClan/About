import {
  CAFE_MAP_ENGAGEMENT_COUNT,
  CAFE_MAP_INSTALL_POPUP,
  CAFE_MAP_INSTALL_POPUP_AT,
  CAFE_MAP_REVIEW_POPUP,
  CAFE_MAP_REVIEW_POPUP_AT,
  CAFE_MAP_VISIT_COUNT,
} from "@/constants/keys/localStorage";

const DAY = 24 * 60 * 60 * 1000;

/** 설치 유도는 2회차 진입부터(또는 카페 상세를 한 번이라도 본 뒤) 노출한다. */
export const INSTALL_POPUP_MIN_VISIT = 2;
/** 리뷰 요청은 3회차 진입부터, 그것도 긍정 행동 직후에만 노출한다. */
export const REVIEW_POPUP_MIN_VISIT = 3;

/** 카페 상세 열람 등 "긍정 행동"이 끝났을 때 발생. 리뷰 요청 드로어의 트리거. */
export const CAFE_MAP_ENGAGEMENT_EVENT = "cafemap:engagement";

export interface CafeMapPopupState {
  /** 이 시각 전까지는 띄우지 않는다 (epoch ms) */
  snoozeUntil: number;
  /** 누적 거절 횟수. 백오프 간격 계산에 쓴다 */
  dismissCount: number;
  /** 영구 종료 (리뷰를 남긴 경우) */
  done: boolean;
}

const EMPTY: CafeMapPopupState = { snoozeUntil: 0, dismissCount: 0, done: false };

// 사파리 프라이빗 모드 등에서 localStorage 접근 자체가 throw 할 수 있다.
const readRaw = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const writeRaw = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // 저장 못 해도 팝업 동작 자체는 막지 않는다
  }
};

const removeRaw = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch {
    // noop
  }
};

export const readPopupState = (key: string): CafeMapPopupState => {
  const raw = readRaw(key);
  if (!raw) return EMPTY;

  try {
    const parsed = JSON.parse(raw);
    return {
      snoozeUntil: Number(parsed?.snoozeUntil) || 0,
      dismissCount: Number(parsed?.dismissCount) || 0,
      done: !!parsed?.done,
    };
  } catch {
    return EMPTY;
  }
};

const writePopupState = (key: string, patch: Partial<CafeMapPopupState>) => {
  writeRaw(key, JSON.stringify({ ...readPopupState(key), ...patch }));
};

/** done 이거나 스누즈 기간 중이면 true */
export const isPopupBlocked = (key: string): boolean => {
  const state = readPopupState(key);
  return state.done || Date.now() < state.snoozeUntil;
};

/** 거절로 간주하고 days 만큼 숨긴다. 누적 거절 횟수도 함께 올린다. */
export const snoozePopup = (key: string, days: number) => {
  writePopupState(key, {
    snoozeUntil: Date.now() + days * DAY,
    dismissCount: readPopupState(key).dismissCount + 1,
  });
};

/** 거절 횟수를 올리지 않고 기간만 미룬다 (설치 클릭처럼 거절이 아닌 경우). */
export const deferPopup = (key: string, days: number) => {
  writePopupState(key, { snoozeUntil: Date.now() + days * DAY });
};

export const finishPopup = (key: string) => {
  writePopupState(key, { done: true });
};

const readCount = (key: string): number => Number(readRaw(key)) || 0;

export const getCafeMapVisitCount = (): number => readCount(CAFE_MAP_VISIT_COUNT);

export const increaseCafeMapVisitCount = (): number => {
  const next = getCafeMapVisitCount() + 1;
  writeRaw(CAFE_MAP_VISIT_COUNT, String(next));
  return next;
};

export const getCafeMapEngagementCount = (): number => readCount(CAFE_MAP_ENGAGEMENT_COUNT);

/**
 * 카페 상세를 닫는 등 의미 있는 사용이 끝난 시점에 호출한다.
 * 찜·리뷰 작성 등 다른 긍정 행동에도 이 함수 한 줄만 추가하면 된다.
 */
export const markCafeMapEngagement = () => {
  writeRaw(CAFE_MAP_ENGAGEMENT_COUNT, String(getCafeMapEngagementCount() + 1));
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CAFE_MAP_ENGAGEMENT_EVENT));
  }
};

// YYYYMMDD → epoch ms. dayjs customParseFormat 플러그인이 없어서 직접 파싱한다.
const parseLegacyDate = (value: string): number => {
  const matched = /^(\d{4})(\d{2})(\d{2})$/.exec(value);
  if (!matched) return 0;
  const [, year, month, date] = matched;
  return new Date(Number(year), Number(month) - 1, Number(date)).getTime();
};

/**
 * 구버전 값(설치: epoch ms / 리뷰: YYYYMMDD·"DONE")을 새 JSON 포맷으로 옮긴다.
 * 이미 새 키가 있으면 건드리지 않는다.
 */
export const migrateLegacyPopupState = () => {
  const legacyInstall = readRaw(CAFE_MAP_INSTALL_POPUP_AT);
  if (legacyInstall) {
    if (!readRaw(CAFE_MAP_INSTALL_POPUP)) {
      const savedAt = Number(legacyInstall);
      if (savedAt) writePopupState(CAFE_MAP_INSTALL_POPUP, { snoozeUntil: savedAt + DAY, dismissCount: 1 });
    }
    removeRaw(CAFE_MAP_INSTALL_POPUP_AT);
  }

  const legacyReview = readRaw(CAFE_MAP_REVIEW_POPUP_AT);
  if (legacyReview) {
    if (!readRaw(CAFE_MAP_REVIEW_POPUP)) {
      if (legacyReview === "DONE") {
        writePopupState(CAFE_MAP_REVIEW_POPUP, { done: true });
      } else {
        const savedAt = parseLegacyDate(legacyReview);
        if (savedAt) writePopupState(CAFE_MAP_REVIEW_POPUP, { snoozeUntil: savedAt + 7 * DAY, dismissCount: 1 });
      }
    }
    removeRaw(CAFE_MAP_REVIEW_POPUP_AT);
  }
};
