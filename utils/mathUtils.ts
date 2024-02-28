import { IDailyCheckWinList } from "../constants2/serviceConstants/dailyCheckConstatns";

export const getDistributionArr = (winList: IDailyCheckWinList[], size: number) => {
  const arr = new Array(size).fill(null);
  let cnt = 0;
  winList.forEach((win) => {
    const percentValue = win.percent * size * 0.01;
    for (let i = cnt; i < cnt + percentValue; i++) arr[i] = win;
    cnt += percentValue;
  });
  return arr;
};