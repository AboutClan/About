import { atom, RecoilEnv } from "recoil";

RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false;

export const backUrlState = atom({
  key: "BackUrl",
  default: null,
});

export const isScrollAutoState = atom({
  key: "isScrollAuto",
  default: false,
});

export const prevPageUrlState = atom({
  key: "PrevPageUrl",
  default: null,
});

export const slideDirectionState = atom<"right" | "left">({
  key: "SlideDirection",
  default: null,
});
