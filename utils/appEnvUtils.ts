export const APP_USER_AGENT = "about_club_app";
export const ANDROID = "android|Android";
export const IOS = "iPhone|iPad|iPod";

const getUserAgent = () => {
  if (typeof window === "undefined") return "";
  return window.navigator.userAgent || "";
};

export const isWebView = () => {
  if (typeof window === "undefined") return false;

  // RN WebView에서 deviceInfo를 받으면 세팅됨
  // window.AboutAppBridge.platform = "android" | "ios"
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const platform = (window as any)?.AboutAppBridge?.platform;

  return platform === "android" || platform === "ios";
};
export const isAndroid = () => RegExp(ANDROID).test(getUserAgent());
export const isIOS = () => RegExp(IOS).test(getUserAgent());

export const isPWA = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(display-mode: standalone)")?.matches ?? false;
};
