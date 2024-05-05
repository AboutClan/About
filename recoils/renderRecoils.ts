import { atom } from "recoil";

export const renderHomeHeaderState = atom<boolean>({
  key: "renderHomeHeader",
  default: true,
});
export const isGatherAlertState = atom({
  key: "isGatherAlert",
  default: false,
});
export const isVoteCompletedState = atom({
  key: "isVoteCompletedState",
  default: false,
});
