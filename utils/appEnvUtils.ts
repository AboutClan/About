/* eslint-disable @typescript-eslint/no-explicit-any */

export const APP_USER_AGENT = "about_club_app";
export const ANDROID = "android|Android";
export const IOS = "iPhone|iPad|iPod";

export const getUserAgent = () => {
  if (typeof window === "undefined") return "";
  return window.navigator.userAgent || "";
};

export const isWebView = (): boolean => {
  if (typeof window === "undefined") return false;

  // ✅ 1) RN WebView면 무조건 true (가장 확실)
  if ((window as any).ReactNativeWebView) return true;

  // ✅ 2) 기존 UA 매칭도 유지
  return RegExp(APP_USER_AGENT).test(getUserAgent());
};

export const isAndroid = () => RegExp(ANDROID).test(getUserAgent());
export const isIOS = () => RegExp(IOS).test(getUserAgent());

export const isPWA = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(display-mode: standalone)")?.matches ?? false;
};

// 에브리타임 Android 인앱 브라우저(WebView)에서는 실제로는 시스템 내비게이션 바를
// 가리지 않는데도 env(safe-area-inset-bottom)이 잘못된(0이 아닌) 값을 보고하는
// 문제가 실기기에서 확인되었다. 캠퍼스픽 Android 인앱 브라우저에서도 동일한 증상
// (BottomNav 하단 여백)이 확인되어 같은 목록에 추가했다. 우리 앱(WebView)이나
// 설치된 PWA는 실제로 safe-area 보정이 필요할 수 있으므로 제외한다.
//
// 주의(탐지 한계):
// - 카카오톡·인스타그램·네이버·라인 등 다른 인앱 브라우저에서 동일 문제가 재현되는지는
//   확인된 바 없다. 근거 없이 여러 브라우저를 묶어 safe-area를 제거하면, 실제로 시스템
//   제스처 내비게이션 영역과 겹치는 회귀를 만들 수 있으므로 여기 포함하지 않는다.
//   문제가 재현되는 다른 브라우저가 확인되면 그때 패턴을 추가할 것.
// - "everytime"이 실제 에브리타임 인앱 브라우저 UA에 포함되는지는 실기기 캡처로
//   검증되지 않았다(추정 패턴). 실기기에서 다른 UA 문자열을 쓰는 것으로 확인되면
//   이 패턴을 갱신해야 한다.
// - 캠퍼스픽도 마찬가지로 실제 UA에 "campuspick"이 포함되는지 실기기 캡처로 검증되지
//   않았다(추정 패턴, 앱 패키지/서비스명 기반). 실기기에서 다른 UA 문자열을 쓰는 것으로
//   확인되면 이 패턴을 갱신해야 한다.
const BROKEN_SAFE_AREA_ANDROID_INAPP_UA_PATTERN = /everytime|campuspick/i;

export const isBrokenSafeAreaAndroidInAppBrowser = (): boolean => {
  if (typeof window === "undefined") return false;
  if (!isAndroid()) return false;
  if (isWebView()) return false;
  if (isPWA()) return false;

  return BROKEN_SAFE_AREA_ANDROID_INAPP_UA_PATTERN.test(getUserAgent());
};

// 인앱 브라우저(외부 앱이 띄운 WebView) 판별.
// 이 브라우저들은 사이트 레벨 위치 팝업은 띄우면서도 호스트 앱의 OS 위치 권한이
// 없으면 POSITION_UNAVAILABLE 로 떨어진다. 이때는 "실외로 나가라"가 아니라
// 기본 브라우저로 열라고 안내해야 한다.
//
// 주의(탐지 한계):
// - "Instagram"은 인스타그램 인앱 브라우저 UA에 실제로 포함되는 것으로 확인된 토큰이다.
// - 나머지(kakaotalk / FBAN / FBAV / NAVER / Line)는 널리 알려진 패턴이지만 이 저장소의
//   실기기 캡처로 검증되지는 않았다. 오탐해도 안내 문구만 바뀌고 기능은 동일하다.
// - 우리 앱(RN WebView)은 자체 위치 권한을 갖고 있으므로 제외한다.
const IN_APP_BROWSER_UA_PATTERN = /Instagram|KAKAOTALK|FBAN|FBAV|NAVER\(inapp|Line\//i;

export const isInAppBrowser = (): boolean => {
  if (typeof window === "undefined") return false;
  if (isWebView()) return false;

  return IN_APP_BROWSER_UA_PATTERN.test(getUserAgent());
};

/**
 * 인앱 브라우저를 벗어나 기본 브라우저로 현재 페이지를 다시 연다.
 *
 * 인앱 웹뷰는 호스트 앱의 위치 권한에 묶여 있어 사이트 팝업을 허용해도 측위가
 * 실패할 수 있다. 그때 사용자가 직접 빠져나올 수 있는 유일한 경로다.
 *
 * - Android: intent:// 로 Chrome 을 지정해 강제로 넘긴다. Chrome 이 없으면
 *   browser_fallback_url 로 원래 주소를 연다.
 * - iOS: x-safari-https:// 는 Safari 가 등록해 둔 스킴이라 다수의 인앱 브라우저에서
 *   동작한다. 다만 공식 API 가 아니라 앱에 따라 막혀 있을 수 있다.
 */
export const openInExternalBrowser = (targetUrl?: string) => {
  if (typeof window === "undefined") return;

  const url = targetUrl ?? window.location.href;

  if (isAndroid()) {
    const withoutScheme = url.replace(/^https?:\/\//, "");
    const fallback = encodeURIComponent(url);
    window.location.href =
      `intent://${withoutScheme}#Intent;scheme=https;package=com.android.chrome;` +
      `S.browser_fallback_url=${fallback};end`;
    return;
  }

  if (isIOS()) {
    window.location.href = url.replace(/^https:\/\//, "x-safari-https://");
    return;
  }

  window.open(url, "_blank");
};
