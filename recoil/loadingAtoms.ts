import { atom } from "recoil";

export const isMainLoadingState = atom({
  key: "isMainLoading",
  default: true,
});

export const isRankingLoadingState = atom({
  key: "isRankingloading",
  default: true,
});

export const isGatherLoadingState = atom({
  key: "isGatherLoading",
  default: true,
});

export const isRecordLoadingState = atom({
  key: "isRecordLoading",
  default: true,
});

export const isStudyDetailLoadingState = atom({
  key: "isStudyDetailLoading",
  default: true,
});

export const isMemberLoadingState = atom({
  key: "isMemberLoading",
  default: true,
});

export const isRecordDetailLoadingState = atom({
  key: "isRecordDetailLoadingState",
  default: true,
});
