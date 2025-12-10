import dayjs from "dayjs";

import { LIKE_HEART } from "../constants/keys/localStorage";
import { LIKE_HEART_PERIOD } from "../constants/settingValue/localStorage";
import { IInteractionLikeStorage } from "../types/globals/interaction";
import { dayjsToStr } from "./dateTimeUtils";

export const checkAndSetLocalStorage = (key: string, gap: number) => {
  let temp = true;
  const value = localStorage.getItem(key);

  if (!value || dayjs(value).add(gap, "day") <= dayjs()) {
    localStorage.setItem(key, dayjs().format("YYYYMMDD"));
    temp = false;
  }

  return temp;
};

export const pushArrToLocalStorage = (key: string, uid: string) => {
  const currentDateStr = dayjsToStr(dayjs());
  const stored: IInteractionLikeStorage[] = JSON.parse(localStorage.getItem(key)) || [];
  const foundItem = stored?.find((item) => item.uid === uid);
  if (foundItem) foundItem.date = currentDateStr;
  else stored.push({ uid, date: currentDateStr });
  localStorage.setItem(key, JSON.stringify(stored));
};

export const isHeartCheckLocalStorage = (toUid: string) => {
  const isLikeRecord = (
    JSON.parse(localStorage.getItem(LIKE_HEART)) as IInteractionLikeStorage[]
  )?.find((who) => who?.uid === toUid);
  const isOverlap =
    isLikeRecord !== undefined &&
    dayjs().diff(dayjs(isLikeRecord?.date), "day") < LIKE_HEART_PERIOD;

  if (isOverlap) return false;
  return true;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setLocalStorageObj = (key: string, value: any) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getLocalStorageObj = (key: string, defaultValue: any = null): any => {
  // SSR/빌드 환경에서는 무조건 default 반환
  if (typeof window === "undefined") return defaultValue;

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
};
