import { IDailyCheckWinList } from "../constants/serviceConstants/dailyCheckConstatns";
import { detectDevice } from "./validationUtils";

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

export const getLowBiasedRandom = (min: number, max: number) => {
  const biasStrength = 12;
  const u = Math.random();
  const v = Math.pow(u, biasStrength);
  return Math.floor(min + (max - min) * v);
};

export const getPerformanceTime = () => {
  return performance.now() / 1000;
};

export const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return;
  const R = 6371; // 지구 반경 (킬로미터)
  const dLat = deg2rad(lat2 - lat1); // 위도 차이를 라디안으로 변환
  const dLon = deg2rad(lon2 - lon1); // 경도 차이를 라디안으로 변환
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // 거리 계산
  return Number(distance.toFixed(1));
};

const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

export const getBottomNavSize = () => {
  const deviceType = detectDevice();
  if (deviceType === "ios") {
    return 95;
  } else return 77;
};

export const getRandomIdx = (totalCnt: number) => {
  return Math.floor(Math.random() * totalCnt);
};
