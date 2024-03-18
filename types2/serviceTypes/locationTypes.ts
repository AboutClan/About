export type Location = ActiveLocation | InactiveLocation;

export type ActiveLocation =
  | "수원"
  | "양천"
  | "안양"
  | "강남"
  | "동대문"
  | "인천";

export type InactiveLocation = "마포";

export type LocationEn = "suw" | "yan" | "any" | "gan" | "don" | "inc";

export type CombinedLocation =
  | "전체"
  | "수원/안양"
  | "양천/강남"
  | ActiveLocation;

export type ActiveLocationAll = ActiveLocation | "전체";
