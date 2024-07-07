import { ActiveLocation, InactiveLocation, Location } from "../types/services/locationTypes";
import { TABLE_COLORS } from "./styles";

export const LOCATION_OPEN: ActiveLocation[] = ["수원", "양천", "안양", "강남", "동대문", "인천"];
export const LOCATION_RECRUITING: InactiveLocation[] = [
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

export const LOCATION_ALL = [...LOCATION_OPEN, ...LOCATION_RECRUITING];

export const LOCATION_CONVERT: Record<Location, string> = {
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
  성남: { member: 7, new: 3 },
  성동: { member: 4, new: 1 },
  고양: { member: 7, new: 3 },
  중구: { member: 13, new: 2 },
  송파: { member: 9, new: 4 },
  구로: { member: 5, new: 1 },
  동작: { member: 7, new: 4 },
  강북: { member: 5, new: 3 },
  부천: { member: 4, new: 2 },
  시흥: { member: 7, new: 2 },
};

export const LOCATION_TABLE_COLOR: Record<ActiveLocation, string> = {
  수원: TABLE_COLORS[0],
  양천: TABLE_COLORS[3],
  안양: TABLE_COLORS[2],
  강남: TABLE_COLORS[1],
  인천: TABLE_COLORS[4],
  동대문: TABLE_COLORS[5],
};
