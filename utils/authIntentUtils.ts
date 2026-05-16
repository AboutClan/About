/**
 * 명시적 소셜 로그인(카카오·애플)이 진행 중임을 표시하는 모듈 스코프 플래그.
 *
 * signOut({ redirect: false }) → signIn("kakao"/"apple") 사이의 짧은 unauthenticated 구간에
 * Layout의 자동 게스트 로그인 effect가 끼어드는 race condition을 막는다.
 *
 * - 모듈 스코프 변수를 사용하므로 Re-render 없이 즉시 반영된다.
 * - OAuth redirect 후 페이지가 새로 로드되면 모듈이 재초기화되어 플래그가 자동으로 리셋된다.
 */

let _intentActive = false;

export const setAuthIntent = (): void => {
  _intentActive = true;
};

export const clearAuthIntent = (): void => {
  _intentActive = false;
};

export const isAuthIntentActive = (): boolean => _intentActive;
