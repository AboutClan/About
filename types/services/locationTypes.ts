export type Location = ActiveLocation;

export type ActiveLocation =
  | "수원"
  | "양천"
  | "안양"
  | "강남"
  | "동대문"
  | "인천"
  | "마포"
  | "성남"
  | "성동"
  | "고양"
  | "중구"
  | "송파"
  | "구로"
  | "동작"
  | "강북"
  | "부천"
  | "시흥";

export type LocationEn =
  | "suw"
  | "yan"
  | "any"
  | "gan"
  | "don"
  | "inc"
  | "map"
  | "seongnam"
  | "seongdong"
  | "goy"
  | "jun"
  | "son"
  | "gur"
  | "dongjak"
  | "gangbuk"
  | "buc"
  | "sih";

export type CombinedLocation = "전체" | "수원/안양" | "양천/강남" | ActiveLocation;

export type ActiveLocationAll = ActiveLocation | "전체";

export type LocationFilterType = Location | CombinedLocation | "전체" | "보류";
