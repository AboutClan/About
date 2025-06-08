export const TIME_SELECTOR_START = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
export const TIME_SELECTOR_END = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];

export const TIME_SELECTOR_UNIT = Array.from({ length: 28 }, (_, index) => {
  const hour = Math.floor(index / 2) + 10;
  const minute = index % 2 === 0 ? "00" : "30";
  return `${hour}:${minute}`;
}).slice(0, -1);

export const TIME_SELECTOR_MINUTES = ["00", "30"];

export const MONTH_LIST = [
  "1월",
  "2월",
  "3월",
  "4월",
  "5월",
  "6월",
  "7월",
  "8월",
  "9월",
  "10월",
  "11월",
  "12월",
];

export const DAYS_OF_WEEK = ["일", "월", "화", "수", "목", "금", "토"];
