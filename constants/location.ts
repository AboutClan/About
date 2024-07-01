import { Location } from "../types/services/locationTypes";
import { TABLE_COLORS } from "./styles";

export const LOCATION_OPEN: Location[] = ["수원", "양천", "안양", "강남", "동대문", "인천"];
export const LOCATION_RECRUITING: Location[] = ["마포", "성남"];
export const LOCATION_NOT_OPEN: Location[] = [];

//모집중을 포함한 지역
export const LOCATION_USE_ALL = [...LOCATION_OPEN];
//전체 지역
export const LOCATION_ALL = [...LOCATION_OPEN, ...LOCATION_RECRUITING, ...LOCATION_NOT_OPEN];

export const LOCATION_CONVERT = {
  수원: "수원",
  양천: "양천/영등포",
  안양: "안양/과천/군포",
  강남: "강남",
  동대문: "동대문/성북",
  마포: "마포/서대문",
  인천: "인천",
  성남: "성남",
};

export const LOCATION_PLACE_SMALL: Location[] = ["안양"];

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
  성남: { member: 9, new: 3 },
};

export const LOCATION_TABLE_COLOR = {
  수원: TABLE_COLORS[0],
  양천: TABLE_COLORS[3],
  안양: TABLE_COLORS[2],
  강남: TABLE_COLORS[1],
  인천: TABLE_COLORS[4],
  동대문: TABLE_COLORS[5],
};
