/* eslint-disable @typescript-eslint/no-explicit-any */

export const APP_USER_AGENT = "about_club_app";
export const ANDROID = "android|Android";
export const IOS = "iPhone|iPad|iPod";

const getUserAgent = () => {
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
