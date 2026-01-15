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

export const isIOS = (): boolean => {
  const hasNavigator = typeof navigator !== "undefined";
  const hasWindow = typeof window !== "undefined";

  // SSR
  if (!hasNavigator) return false;

  const ua = navigator.userAgent || "";

  // 1️⃣ Bridge 기반 (앱)
  const bridgePlatform = hasWindow ? window.AboutAppBridge?.platform : null;

  if (bridgePlatform === "ios") return true;

  // 2️⃣ UA 기반 (웹 포함)
  return (
    /iPhone|iPad|iPod/i.test(ua) ||
    // iPadOS (Macintosh로 위장하는 케이스)
    (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1)
  );
};

export const detectDevice = () => {
  if (typeof window !== "undefined" && window.AboutAppBridge?.platform) {
    return window.AboutAppBridge.platform;
  }
  if (typeof navigator === "undefined") return null;
  const ua = navigator.userAgent;
  if (/iPhone/i.test(ua)) return "iPhone";
  if (/Android/i.test(ua) && /mobile/i.test(ua)) return "Android";
  return "PC";
};

export const detectDeviceFromGlobal = () => {
  if (typeof window !== "undefined") {
    return window?.AboutAppBridge?.platform || null;
  }
  return null;
};

export const detectAppDevice = () => {
  const hasWindow = typeof window !== "undefined";

  if (hasWindow && window.AboutAppBridge?.platform) {
    return window.AboutAppBridge.platform;
  }

  if (typeof navigator === "undefined") return null;

  const ua = navigator.userAgent || "";

  // ① 앱 설치 버전 (WebView)에서만 감지
  const isAboutApp =
    /AboutApp/i.test(ua) || (hasWindow && typeof window.AboutAppBridge !== "undefined");

  if (!isAboutApp) {
    return null;
  }

  // ② 플랫폼 구분 (UA 기준만 사용)
  if (/iPhone/i.test(ua)) {
    return "iPhone";
  } else if (/Android/i.test(ua)) {
    return "Android";
  } else {
    return "Unknown";
  }
};

export const isNil = <T>(val: T | undefined | null): val is null | undefined => {
  return val == null;
};

export const isEmpty = <T>(value: T | undefined | null): boolean => {
  return (
    isNil(value) ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === "object" && Object.keys(value).length === 0)
  );
};

export const iPhoneNotchSize = () => {
  if (typeof window === "undefined" || typeof navigator === "undefined") return 0;
  const isStandalone = window.matchMedia?.("(display-mode: standalone)")?.matches ?? false;
  const ua = navigator.userAgent || "";
  return /iPhone/i.test(ua) && isStandalone ? 34 : 0;
};
