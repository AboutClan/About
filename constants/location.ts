import { ActiveLocation, Location, LocationEn } from "../types/services/locationTypes";
import { COLOR_TABLE } from "./colorConstants";

export const PREV_LOCATION: ActiveLocation[] = ["수원", "양천", "강남", "동대문", "인천", "안양"];

export const LOCATION_OPEN: ActiveLocation[] = [
  "수원",
  "양천",
  "강남",
  "동대문",
  "인천",
  "안양",
  "마포",
  "성남",
  "성동",
  "고양",
  "중구",
  "송파",
  "구로",
  "동작",
  "강북",
  "부천",
  "시흥",
];

export const LOCATION_ALL = [...LOCATION_OPEN];

export const LOCATION_TO_FULLNAME: Record<Location, string> = {
  수원: "수원시",
  양천: "양천구 · 영등포구",
  안양: "안양 인근 지역",
  강남: "강남구 · 서초구",
  동대문: "동대문구 · 성북구",
  성동: "성동구 · 광진구",
  마포: "마포구 · 서대문구",
  인천: "인천시",
  성남: "성남시",
  고양: "고양시",
  중구: "중구 · 용산구",
  송파: "송파구 · 강동구",
  구로: "구로구 · 금천구",
  동작: "동작구 · 관악구",
  강북: "강북구 · 노원구",
  부천: "부천시",
  시흥: "시흥시 · 안산시",
};

export const LOCATION_OPEN_DATE = {
  수원: "2023-04-07",
  양천: "2023-04-19",
  안양: "2023-09-01",
  강남: "2023-09-04",
  동대문: "2024-01-03",
  인천: "2024-03-18",
};

export const RegisterLocation = [...LOCATION_ALL, "기타"];

export const LOCATION_MEMBER_CNT: {
  [key in Location]: { member: number; new: number };
} = {
  수원: { member: 137, new: 4 },
  양천: { member: 61, new: 2 },
  안양: { member: 23, new: 3 },
  강남: { member: 53, new: 2 },
  동대문: { member: 56, new: 2 },
  마포: { member: 38, new: 2 },
  인천: { member: 45, new: 3 },
  성남: { member: 17, new: 3 },
  성동: { member: 8, new: 1 },
  고양: { member: 11, new: 3 },
  중구: { member: 17, new: 2 },
  송파: { member: 14, new: 4 },
  구로: { member: 11, new: 1 },
  동작: { member: 13, new: 4 },
  강북: { member: 11, new: 3 },
  부천: { member: 10, new: 2 },
  시흥: { member: 13, new: 2 },
};

export const krToEnMapping: Record<Location, LocationEn> = {
  수원: "suw",
  강남: "gan",
  동대문: "don",
  안양: "any",
  양천: "yan",
  인천: "inc",
  마포: "map",
  성남: "seongnam",
  성동: "seongdong",
  고양: "goy",
  중구: "jun",
  송파: "son",
  구로: "gur",
  동작: "dongjak",
  강북: "gangbuk",
  부천: "buc",
  시흥: "sih",
};

export const enToKrMapping: Record<LocationEn, Location> = {
  suw: "수원",
  gan: "강남",
  don: "동대문",
  any: "안양",
  yan: "양천",
  inc: "인천",
  map: "마포",
  seongnam: "성남",
  seongdong: "성동",
  goy: "고양",
  jun: "중구",
  son: "송파",
  gur: "구로",
  dongjak: "동작",
  gangbuk: "강북",
  buc: "부천",
  sih: "시흥",
};

export const LOCATION_TO_COLOR: Record<ActiveLocation, string> = {
  수원: COLOR_TABLE[0],
  양천: COLOR_TABLE[1],
  강남: COLOR_TABLE[3],
  동대문: COLOR_TABLE[4],
  인천: COLOR_TABLE[2],
  안양: COLOR_TABLE[5],
  성동: COLOR_TABLE[6],
  마포: COLOR_TABLE[7],
  성남: COLOR_TABLE[0],
  고양: COLOR_TABLE[1],
  중구: COLOR_TABLE[2],
  송파: COLOR_TABLE[3],
  구로: COLOR_TABLE[4],
  동작: COLOR_TABLE[5],
  강북: COLOR_TABLE[6],
  부천: COLOR_TABLE[7],
  시흥: COLOR_TABLE[2],
};
