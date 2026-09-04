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

// 서비스 전체가 공유하는 하단 safe-area 값. 실제 값은 컴포넌트별로 계산하지 않고
// document.documentElement의 CSS 커스텀 프로퍼티 하나로만 관리한다
// (설정: hooks/custom/useAppSafeAreaBottomCssVar.ts, 호출: Layout 최상단 1곳).
//
// - 기본(iOS 웹/PWA, Android Chrome·Samsung Internet·PWA 등): env(safe-area-inset-bottom, 0px)
// - 에브리타임/캠퍼스픽 Android 인앱 브라우저: 0px
//   (실기기 진단 결과 env(safe-area-inset-bottom)이 48px으로 잘못 잡히는데, 실제로는
//   WebView viewport가 이미 시스템 내비게이션 영역 위에서 끝나 이 48px이 중복 적용됨)
// - 어바웃 RN WebView: 0px (네이티브 컨테이너가 이미 처리)
//
// 두 번째 인자(env(safe-area-inset-bottom, 0px))는 CSS 변수가 아직 설정되지 않은 시점
// (SSR, 최초 페인트 이전)의 fallback이며, 이 값은 "기본" 케이스와 동일하므로 안전하다.
export const APP_SAFE_AREA_BOTTOM_CSS_VAR = "--app-safe-area-bottom";

export const getSafeAreaBottom = (basePx = 0) =>
  `calc(${basePx}px + var(${APP_SAFE_AREA_BOTTOM_CSS_VAR}, env(safe-area-inset-bottom, 0px)))`;

// BottomNav(및 CafeMapBottomNav)의 실제 점유 높이(52px + safe-area)를 계산하는 단일 소스.
// 두 값(52, safe-area)이 흩어져 있으면 BottomNav를 렌더링하는 컴포넌트와 그 아래
// 콘텐츠 wrapper의 하단 padding이 서로 어긋나기 쉽다.
export const BOTTOM_NAV_HEIGHT_PX = 52;

export const getBottomNavTotalHeight = () =>
  `calc(${BOTTOM_NAV_HEIGHT_PX}px + ${getSafeAreaBottom(0)})`;

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
