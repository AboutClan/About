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
  if (typeof navigator === "undefined") {
    return null;
  }
  const ua = navigator.userAgent;
  // iPhone 감지
  if (/iPhone/i.test(ua)) {
    return "iPhone";
  }
  // Android 모바일 감지
  else if (/Android/i.test(ua) && /mobile/i.test(ua)) {
    return "Android";
  }
  // PC 감지
  else {
    return "PC";
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
