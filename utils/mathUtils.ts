import { IDailyCheckWinList } from "../constants/serviceConstants/dailyCheckConstatns";

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
  const distance = getPreciseDistanceFromLatLonInKm(lat1, lon1, lat2, lon2);
  if (distance == null) return distance;
  // 소수점 1자리(100m)로 반올림 — 반경 필터/히스테리시스 등 대략적인 거리 비교용.
  // 수십 m 단위로 후보를 가려내야 하는 비교(예: 가장 가까운 장소 찾기)에는
  // getPreciseDistanceFromLatLonInKm 을 사용할 것.
  return Number(distance.toFixed(1));
};

export const getPreciseDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return;
  const R = 6371; // 지구 반경 (킬로미터)
  const dLat = deg2rad(lat2 - lat1); // 위도 차이를 라디안으로 변환
  const dLon = deg2rad(lon2 - lon1); // 경도 차이를 라디안으로 변환
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // 거리 계산 (반올림 없음)
};

const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

export const getRandomIdx = (totalCnt: number) => {
  return Math.floor(Math.random() * totalCnt);
};
