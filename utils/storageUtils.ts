import dayjs from "dayjs";
import { LIKE_HEART } from "../constants/keys/localStorage";
import { LIKE_HEART_PERIOD } from "../constants/settingValue/localStorage";
import { IInteractionLikeStorage } from "../types2/interaction";
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
  const stored: IInteractionLikeStorage[] =
    JSON.parse(localStorage.getItem(key)) || [];
  const foundItem = stored?.find((item) => item.uid === uid);
  if (foundItem) foundItem.date = currentDateStr;
  else stored.push({ uid, date: currentDateStr });
  localStorage.setItem(key, JSON.stringify(stored));
};

export const isHeartCheckLocalStorage = (toUid: string) => {
  const isLikeRecord = (
    JSON.parse(localStorage.getItem(LIKE_HEART)) as IInteractionLikeStorage[]
  )?.find((who) => who.uid === toUid);
  const isOverlap =
    isLikeRecord !== undefined &&
    dayjs().diff(dayjs(isLikeRecord?.date), "day") < LIKE_HEART_PERIOD;

  if (isOverlap) return false;
  return true;
};

export const setLocalStorageObj = (key: string, obj: Object) => {
  localStorage.setItem(key, JSON.stringify(obj));
};
export const getLocalStorageObj = (key: string) =>
  JSON.parse(localStorage.getItem(key));
