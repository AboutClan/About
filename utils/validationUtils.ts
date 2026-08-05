/* eslint-disable @typescript-eslint/no-explicit-any */

import { LOCATION_OPEN } from "../constants/location";
import { ActiveLocation } from "../types/services/locationTypes";

export function isLocationType(value: string): value is ActiveLocation {
  return LOCATION_OPEN.includes(value as ActiveLocation);
}

export const checkIsKorean = (str: string) => {
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    // 한글 자모음 범위: 0x1100 ~ 0x11FF
    // 알파벳 a ~ z 범위: 0x61 ~ 0x7A
    if (0xac00 > code || code > 0xd7a3) {
      return false;
    }
  }
  return true;
};

export const randomPassword = () => {
  let newPassword = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    newPassword += characters[randomIndex];
  }
  return newPassword;
};

export const selectRandomWinners = (
  total: number,
  winner: number,
  uniqueNumber: number,
): number[] => {
  function hashStringToInt(s, max) {
    let hash = 0;
    for (let i = 0; i < s.length; i++) {
      hash = (hash << 5) - hash + s.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }

    return Math.abs(hash) % max;
  }
  const winners = new Set<number>();
  let seedStr = uniqueNumber.toString();

  while (winners.size < winner) {
    const hashValue = hashStringToInt(seedStr, total);
    if (!winners.has(hashValue)) {
      winners.add(hashValue);
    }
    seedStr += winner.toString();
  }

  return Array.from(winners);
};

export const isNativeAppWebView = (): boolean => {
  if (typeof window === "undefined") return false;
  return !!(window as any).ReactNativeWebView;
};

export type DeviceOS = "iOS" | "Android" | "Other";

export const getDeviceOS = (): DeviceOS => {
  // ✅ 1) 앱(WebView)에서는 deviceInfo 기반 값이 최우선
  if (typeof window !== "undefined") {
    const p = (window as any).__ABOUT_PLATFORM__ ?? (window as any).AboutAppBridge?.platform;

    if (typeof p === "string") {
      if (/android/i.test(p)) return "Android";
      if (/ios/i.test(p)) return "iOS";
    }
  }

  // ✅ 2) 웹에서는 UA로 판별
  if (typeof navigator === "undefined") return "Other";
  const ua = navigator.userAgent || "";

  if (/Android/i.test(ua)) return "Android";
  if (/iPhone|iPad|iPod/i.test(ua)) return "iOS";
  if (/Macintosh/i.test(ua) && (navigator as any).maxTouchPoints > 1) return "iOS";

  return "Other";
};

export const isIOS = () => getDeviceOS() === "iOS";
export const isSafariBrowser = (): boolean => {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  return /Safari/i.test(ua) && !/Chrome|CriOS|FxiOS|EdgiOS/i.test(ua);
};
export const isApp = (): boolean => {
  if (typeof window === "undefined") return false;

  // react-native-webview가 자동 주입
  return !!(window as any).ReactNativeWebView;
};

export const getSafeAreaBottom = (basePx = 0) => {
  // 앱(WebView)은 네이티브 컨테이너가 safe area를 처리하므로 base만 반환
  if (isApp()) return `${basePx}px`;

  // 모바일 웹(iOS·Android 공통): env(safe-area-inset-bottom) 적용
  // iOS: 홈 인디케이터 영역
  // Android: 시스템 내비게이션 바 (엣지-투-엣지 모드에서 non-zero)
  //
  // 주의: 에브리타임 Android 인앱 브라우저는 실제로 필요하지 않은데도
  // env(safe-area-inset-bottom)에 값을 잘못 채워보내는 문제가 실기기에서 확인되었다.
  // 그 환경에서만 safe-area를 건너뛰어야 한다면, 이 함수 전역을 바꾸지 말고
  // `isEverytimeAndroidInAppBrowser()`(utils/appEnvUtils.ts)로 해당 컴포넌트에서만 분기할 것.
  return `calc(${basePx}px + env(safe-area-inset-bottom, 0px))`;
};

// BottomNav(및 CafeMapBottomNav)의 실제 점유 높이(52px + 필요한 경우의 safe-area)를
// 계산하는 단일 소스. 두 값(52, safe-area 분기 로직)이 흩어져 있으면 BottomNav를
// 렌더링하는 컴포넌트와 그 아래 콘텐츠 wrapper의 하단 padding이 서로 어긋나기 쉽다.
export const BOTTOM_NAV_HEIGHT_PX = 52;

// isEverytimeAndroidInAppBrowser()를 함수 내부에서 직접 호출하지 않고 인자로 받는다.
// (서버/최초 클라이언트 렌더에서는 navigator를 알 수 없으므로 항상 기본값(false)을 써야
// 서버-클라이언트 렌더 결과가 일치한다. 호출부는 useIsEverytimeAndroidInAppBrowser() 훅으로
// 마운트 이후에만 실제 값을 얻어 넘겨야 하며, BottomNav와 Layout 모두 같은 훅 결과를 써서
// 두 값이 서로 다른 시점에 바뀌지 않도록 한다.)
export const getBottomNavSafeAreaBottom = (isEverytimeAndroidInApp = false) => {
  if (isEverytimeAndroidInApp) return "0px";
  return getSafeAreaBottom(0);
};

export const getBottomNavTotalHeight = (isEverytimeAndroidInApp = false) =>
  `calc(${BOTTOM_NAV_HEIGHT_PX}px + ${getBottomNavSafeAreaBottom(isEverytimeAndroidInApp)})`;

export const isMobileWeb = (): boolean => {
  if (typeof window === "undefined") return false;

  // 앱이면 모바일웹 아님
  if ((window as any).ReactNativeWebView) return false;

  const ua = navigator.userAgent.toLowerCase();

  // 모바일 기기 브라우저
  const isMobileUA = /iphone|ipad|ipod|android/.test(ua);

  const isIOSDesktopMode = ua.includes("macintosh") && navigator.maxTouchPoints > 1;

  return isMobileUA || isIOSDesktopMode;
};
