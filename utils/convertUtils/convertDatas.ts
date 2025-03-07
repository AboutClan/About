import * as CryptoJS from "crypto-js";

import { enToKrMapping, krToEnMapping } from "../../constants/location";
import {
  BADGE_SCORE_MAPPINGS,
  USER_SCORE_BADGE_ARR,
} from "../../constants/serviceConstants/badgeConstants";
import {
  EVENT_BADGE_딸기스무디,
  EVENT_BADGE_라벤더,
  EVENT_BADGE_모히또,
  EVENT_BADGE_민트초코,
  EVENT_BADGE_슈팅스타,
  EVENT_BADGE_코코아,
  MANAGER_BADGE,
} from "../../constants/storage/eventBadgeUser";
import { UserBadge, UserRole } from "../../types/models/userTypes/userInfoTypes";
import { ActiveLocation, Location, LocationEn } from "../../types/services/locationTypes";

export const decodeByAES256 = (encodedTel: string) => {
  const key = process.env.NEXT_PUBLIC_CRYPTO_KEY;
  if (!key) return encodedTel;

  const bytes = CryptoJS.AES.decrypt(encodedTel, key);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
};

export const getUserBadge = (score: number, uid: string): UserBadge => {
  let badge: UserBadge = "아메리카노";

  if (MANAGER_BADGE.includes(uid)) return "바닐라";
  if (EVENT_BADGE_라벤더.includes(uid)) return "라벤더";
  else if (EVENT_BADGE_딸기스무디.includes(uid)) return "딸기스무디";
  else if (EVENT_BADGE_민트초코.includes(uid)) return "민트초코";
  else if (EVENT_BADGE_슈팅스타.includes(uid)) return "슈팅스타";
  else if (EVENT_BADGE_모히또.includes(uid)) return "모히또";
  else if (EVENT_BADGE_코코아.includes(uid)) return "코코아";

  for (const [badgeName, minScore] of Object.entries(BADGE_SCORE_MAPPINGS)) {
    if (score < minScore) {
      return badge;
    }
    badge = badgeName as UserBadge;
  }

  return badge;
};

export const getNextBadge = (currentBadge: UserBadge): UserBadge => {
  const idx = USER_SCORE_BADGE_ARR.indexOf(currentBadge as (typeof USER_SCORE_BADGE_ARR)[number]);
  if (idx === -1 || idx === USER_SCORE_BADGE_ARR.length - 1) {
    return null;
  } else if (idx < USER_SCORE_BADGE_ARR.length - 1) {
    return USER_SCORE_BADGE_ARR[idx + 1];
  }
};

type ReturnLocationLang<T> = T extends "kr" ? ActiveLocation : LocationEn;

export const convertLocationLangTo = <T extends "kr" | "en">(
  location: Location | LocationEn,
  to: T,
): ReturnLocationLang<T> => {
  if (to === "kr") {
    return enToKrMapping[location as LocationEn] as ReturnLocationLang<T>;
  }
  if (to === "en") {
    return krToEnMapping[location as ActiveLocation] as ReturnLocationLang<T>;
  }

  throw new Error("Invalid 'to' parameter or location type");
};

export const getUserRole = (role: UserRole) => {
  switch (role) {
    case "human":
      return "수습 멤버";
    case "member":
      return "동아리원";
    case "manager":
      return "운영진";
    case "previliged":
      return "운영진";
    case "resting":
      return "휴식 멤버";
    case "enthusiastic":
      return "열활 멤버";
  }
};

export const getRestInfo = (restData: string) => {
  const [type, date, content] = restData.split(`/`);
  return {
    type,
    date,
    content,
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const shuffleArray = (array: any[]) => {
  if (!array) return;
  return array.sort(() => Math.random() - 0.5);
};
