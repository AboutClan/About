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
  if (typeof navigator === "undefined") return false;

  const ua = navigator.userAgent || "";
  const hasWindow = typeof window !== "undefined";

  // 1️⃣ App Bridge (앱)
  const bridgePlatform = hasWindow ? window.AboutAppBridge?.platform : null;
  if (typeof bridgePlatform === "string") {
    if (/ios|iphone|ipad/i.test(bridgePlatform)) return true;
  }

  // 2️⃣ UA 기반 (웹)
  return /iPhone|iPad|iPod/i.test(ua) || (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1);
};

export type DeviceOS = "iOS" | "Android" | "Other";

export const getDeviceOS = (): DeviceOS => {
  if (typeof navigator === "undefined") return "Other";

  const ua = navigator.userAgent || "";
  const hasWindow = typeof window !== "undefined";

  // 1️⃣ App Bridge 우선 (앱/WebView)
  const bridgePlatform = hasWindow ? window.AboutAppBridge?.platform : null;
  if (typeof bridgePlatform === "string") {
    if (/ios|iphone|ipad/i.test(bridgePlatform)) return "iOS";
    if (/android/i.test(bridgePlatform)) return "Android";
  }

  // 2️⃣ UA 기반 (웹 포함)
  if (/iPhone|iPad|iPod/i.test(ua)) return "iOS";
  // iPadOS (Macintosh로 위장)
  if (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1) return "iOS";
  if (/Android/i.test(ua)) return "Android";

  return "Other";
};

export const isApp = (): boolean => {
  if (typeof window === "undefined") return false;

  // 1️⃣ 네이티브 App WebView (Bridge 존재)
  if (typeof window.AboutAppBridge !== "undefined") return true;

  // 2️⃣ iOS PWA (홈화면 설치)
  if (window.matchMedia?.("(display-mode: standalone)")?.matches) return true;

  // 3️⃣ iOS Safari legacy (navigator.standalone) — 타입 안전하게 처리
  const navWithStandalone = navigator as Navigator & { standalone?: boolean };
  if (navWithStandalone.standalone === true) return true;

  return false;
};

export const getSafeAreaBottom = (basePx = 0) => {
  const os = getDeviceOS();

  // iOS "모바일 웹"에서만 env를 더함
  // && !isApp()
  if (os === "iOS") {
    return `calc(${basePx}px + env(safe-area-inset-bottom, 0px))`;
  }

  // 앱(WebView)이나 Android/Other는 base만
  return `${basePx}px`;
};
