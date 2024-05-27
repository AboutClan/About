import {
  ActiveLocation,
  InactiveLocation,
  Location,
  LocationEn,
} from "../types/services/locationTypes";

export const ACTIVE_LOCATIONS: ActiveLocation[] = [
  "수원",
  "양천",
  "안양",
  "강남",
  "동대문",
  "인천",
];

export const ACTIVE_LOCATIONS_FULLNAME = [
  "수원",
  "양천/영등포",
  "강남",
  "동대문/성북",
  "인천",
  "안양",
];

export const INACTIVE_LOCATIONS: InactiveLocation[] = ["마포"];

export const LOCATIONS: Location[] = [...ACTIVE_LOCATIONS, ...INACTIVE_LOCATIONS];

export const krToEnMapping: Record<ActiveLocation, LocationEn> = {
  수원: "suw",
  강남: "gan",
  동대문: "don",
  안양: "any",
  양천: "yan",
  인천: "inc",
};

export const enToKrMapping: Record<LocationEn, ActiveLocation> = {
  suw: "수원",
  gan: "강남",
  don: "동대문",
  any: "안양",
  yan: "양천",
  inc: "인천",
};
