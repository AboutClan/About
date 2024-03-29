import { CombinedLocation } from "../pages/gather/writing/condition";

export type Location = LocationOpen | "동대문" | "마포" | "인천";

export type LocationOpen = "수원" | "양천" | "안양" | "강남";

export type LocationFilterType = Location | CombinedLocation | "전체" | "보류";

export type Size = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
