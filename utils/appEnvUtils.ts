export const APP_USER_AGENT = "about_club_app";
export const ANDROID = "android|Android";
export const IOS = "iPhone|iPad|iPod";

const getUserAgent = () => {
  if (typeof window === "undefined") {
    return "";
  }
  return window.navigator.userAgent;
};

export const isWebView = () => getUserAgent().includes("AboutClubApp");

export const isAndroid = () => getUserAgent().includes("Android");

export const isIOS = () => getUserAgent().includes("iPhone") || getUserAgent().includes("iPad");

export const isPWA = () => window.matchMedia?.("(display-mode: standalone)")?.matches ?? false;
