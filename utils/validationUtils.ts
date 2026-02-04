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
export const isApp = (): boolean => {
  if (typeof window === "undefined") return false;

  // react-native-webview가 자동 주입
  return !!(window as any).ReactNativeWebView;
};

export const getSafeAreaBottom = (basePx = 0) => {
  const os = getDeviceOS();

  // iOS "모바일 웹"에서만 env를 더함
  // && !isApp()
  if (os === "iOS" && !isApp()) {
    return `calc(${basePx}px + env(safe-area-inset-bottom, 0px))`;
  }

  // 앱(WebView)이나 Android/Other는 base만
  return `${basePx}px`;
};
export const isMobileWeb = (): boolean => {
  if (typeof window === "undefined") return false;

  // 앱이면 모바일웹 아님
  if ((window as any).ReactNativeWebView) return false;

  const ua = navigator.userAgent.toLowerCase();

  // 모바일 기기 브라우저
  const isMobileDevice = /iphone|ipad|ipod|android/.test(ua);

  return isMobileDevice;
};