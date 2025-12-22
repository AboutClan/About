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

export const detectDevice = () => {
  if (typeof navigator === "undefined") return null;

  const ua = navigator.userAgent || "";

  // 1) iOS: iPhone/iPad/iPod 모두 포함 (iPadOS가 데스크톱처럼 보이는 경우 보완)
  const isIOS = /iPhone|iPad|iPod/i.test(ua);

  // 2) Android: Mobile 키워드에 의존하지 말고 Android 자체로 판단
  const isAndroid = /Android/i.test(ua);

  // 3) iPadOS 13+가 Mac처럼 보이는 케이스 보완
  // (UA에 Mac이지만 터치가 있고 iOS 계열이면 iPad로 판단하는 흔한 패턴)
  const isIPadLike = /Macintosh/i.test(ua) && (navigator as any).maxTouchPoints > 1;

  if (isIOS) return "iOS";
  if (isIPadLike) return "iOS"; // 사실상 iPadOS
  if (isAndroid) return "Android";

  return "PC";
};

export const detectDeviceFromGlobal = () => {
  if (typeof window !== "undefined") {
    return window?.AboutAppBridge?.platform || null;
  }
  return null;
};

export const detectAppDevice = () => {
  if (typeof navigator === "undefined") return null;

  const ua = navigator.userAgent || "";

  // ① 앱 설치 버전 (WebView)에서만 감지
  const isAboutApp = /AboutApp/i.test(ua) || typeof window?.AboutAppBridge !== "undefined";

  if (!isAboutApp) {
    // 앱이 아니면 null
    return null;
  }
  // ② 플랫폼 구분
  if (/iPhone/i.test(ua) || window?.AboutAppBridge?.platform === "iPhone") {
    return "iPhone";
  } else if (/Android/i.test(ua) || window?.AboutAppBridge?.platform === "Android") {
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
  if (typeof navigator === "undefined") return 0;
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
  const ua = navigator.userAgent;
  // iPhone 감지

  if (/iPhone/i.test(ua) && isStandalone) {
    return 34;
  } else return 0;
};
