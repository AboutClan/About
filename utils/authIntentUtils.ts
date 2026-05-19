/**
 * 명시적 소셜 로그인(카카오·애플)이 진행 중임을 표시하는 플래그.
 *
 * signOut({ redirect: false }) → signIn("kakao"/"apple") 사이의 짧은 unauthenticated 구간과
 * OAuth 리다이렉트 왕복 구간에 Layout의 자동 게스트 로그인 effect가 끼어드는 것을 막는다.
 *
 * [이중 저장 이유]
 * - 모듈 변수: 동일 페이지 내 React 렌더 사이클에서 즉각 반응 (signOut 후 status 변경 구간 방어)
 * - sessionStorage: OAuth 리다이렉트(카카오 페이지 왕복) 이후에도 유지 (콜백 URL 로드 시 방어)
 * 두 레이어 중 하나라도 active면 true를 반환한다.
 *
 * [TTL 필요 이유]
 * 로그인 실패·취소·뒤로가기 시 clearAuthIntent()가 호출되지 않으므로
 * TTL 없이는 플래그가 영구 잔존하여 게스트 자동 로그인이 무기한 차단된다.
 *
 * - 인증 성공 시 Layout에서 clearAuthIntent()를 호출하여 즉시 정리한다.
 * - TTL 초과 시 isAuthIntentActive()에서 자동 삭제 후 false를 반환한다.
 * - SSR 환경에서는 try/catch로 false를 반환한다.
 */

const INTENT_KEY = "__auth_intent__";
const INTENT_TTL_MS = 10 * 60 * 1000;

// window 프로퍼티를 사용한다.
// 모듈 변수(_moduleTimestamp)는 Next.js 코드 스플리팅으로 번들이 분리되면
// login 페이지 번들과 Layout(_app) 번들이 각자의 인스턴스를 가져 값이 공유되지 않는다.
// window는 어느 번들에서도 동일한 전역 객체를 참조하므로 이 문제가 없다.
type AuthIntentWindow = Window & { __authIntentTs?: number | null };

function W(): AuthIntentWindow | null {
  return typeof window !== "undefined" ? (window as AuthIntentWindow) : null;
}

export const setAuthIntent = (): void => {
  const ts = Date.now();
  const w = W();
  if (w) w.__authIntentTs = ts;
  try {
    sessionStorage.setItem(INTENT_KEY, String(ts));
  } catch {
  }
};

export const clearAuthIntent = (): void => {
  const w = W();
  if (w) w.__authIntentTs = null;
  try {
    sessionStorage.removeItem(INTENT_KEY);
  } catch {
  }
};

export const isAuthIntentActive = (): boolean => {
  const now = Date.now();
  const w = W();

  // 1) window 프로퍼티 체크 (동일 탭 내 가장 신뢰도 높은 전역 공유 값)
  const winTs = w?.__authIntentTs;
  if (winTs != null && now - winTs <= INTENT_TTL_MS) return true;

  // 2) sessionStorage 체크 (페이지 이동·새로고침 후 복구용 백업)
  try {
    const raw = sessionStorage.getItem(INTENT_KEY);
    if (!raw) return false;
    const createdAt = Number(raw);
    if (isNaN(createdAt) || now - createdAt > INTENT_TTL_MS) {
      sessionStorage.removeItem(INTENT_KEY);
      return false;
    }
    if (w) w.__authIntentTs = createdAt;
    return true;
  } catch {
    return false;
  }
};
