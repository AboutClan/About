export interface IAttendCheckPresent {
  item: string;
  percent: number;
}

export const DAILY_CHECK_WIN_ITEM: IAttendCheckPresent[] = [
  { item: "10 Point", percent: 3 },
  { item: "30 Point", percent: 1 },
  { item: "100 Point", percent: 0.2 },
  { item: "츄파춥스", percent: 0.2 },
  { item: "비타 500", percent: 0.2 },
  { item: "초코에몽", percent: 0.15 },
  { item: "MEGA 커피", percent: 0.1 },
  { item: "CU 3000원권", percent: 0.07 },
  { item: "베라 싱글", percent: 0.05 },
  { item: "투썸 아이스박스", percent: 0.03 },
  { item: "올리브영 10000원권", percent: 0.02 },
  { item: "CGV 영화관람권", percent: 0.02 },
  { item: "춘식이 미니 페이스 쿠션", percent: 0.01 },
  { item: "BHC 뿌링클", percent: 0.01 },
  { item: "알파벳", percent: 1 },
];

/**
 10 point / 100원 기준
100회에 기대값 3000원정도

 */
