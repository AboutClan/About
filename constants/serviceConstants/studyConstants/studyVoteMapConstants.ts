import { ActiveLocation } from "../../../types/services/locationTypes";

export const LOCATION_CENTER_DOT: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key in ActiveLocation]: { latitude: number; longitude: number };
} = {
  수원: { latitude: 37.278992, longitude: 127.025727 },
  안양: { latitude: 37.388896, longitude: 126.950088 },
  양천: { latitude: 37.527588, longitude: 126.896441 },
  강남: { latitude: 37.503744, longitude: 127.048898 },
  동대문: { latitude: 37.58452, longitude: 127.041047 },
  인천: { latitude: 37.428334, longitude: 126.674935 },
  마포: { latitude: 37.563757, longitude: 126.908421 },
  성남: { latitude: 37.420045, longitude: 127.126209 },
  성동: { latitude: 37.563344, longitude: 127.036941 },
  고양: { latitude: 37.658359, longitude: 126.83168 },
  중구: { latitude: 37.56362, longitude: 126.997706 },
  송파: { latitude: 37.514543, longitude: 127.10588 },
  구로: { latitude: 37.495485, longitude: 126.88782 },
  동작: { latitude: 37.512409, longitude: 126.93996 },
  강북: { latitude: 37.639609, longitude: 127.025657 },
  부천: { latitude: 37.503413, longitude: 126.76603 },
  시흥: { latitude: 37.380177, longitude: 126.803489 },
};
// export const VOTE_LOCATION_CENTER_DOT: {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   [key in ActiveLocation]: any;
// } = {
//   수원: new naver.maps.LatLng(37.278992, 127.025727),
//   안양: new naver.maps.LatLng(37.388896, 126.950088),
//   양천: new naver.maps.LatLng(37.527588, 126.896441),
//   강남: new naver.maps.LatLng(37.503744, 127.048898),
//   동대문: new naver.maps.LatLng(37.58452, 127.041047),
//   인천: new naver.maps.LatLng(37.58452, 127.041047),
// };
export const LOCATION_MAX_BOUNDARY: {
  [key in ActiveLocation]: {
    northeast: { latitude: number; longitude: number };
    southwest: { latitude: number; longitude: number };
  };
} = {
  수원: {
    northeast: { latitude: 37.357058, longitude: 127.142965 },
    southwest: { latitude: 37.195011, longitude: 126.955637 },
  },
  안양: {
    northeast: { latitude: 37.451075, longitude: 127.142965 },
    southwest: { latitude: 37.357058, longitude: 126.888074 },
  },
  양천: {
    northeast: { latitude: 37.558289, longitude: 126.941598 },
    southwest: { latitude: 37.482753, longitude: 126.819398 },
  },
  강남: {
    northeast: { latitude: 37.532565, longitude: 127.107285 },
    southwest: { latitude: 37.468873, longitude: 126.991213 },
  },
  동대문: {
    northeast: { latitude: 37.638954, longitude: 127.106856 },
    southwest: { latitude: 37.557579, longitude: 126.989614 },
  },
  인천: {
    northeast: { latitude: 37.584965, longitude: 126.803871 },
    southwest: { latitude: 37.341746, longitude: 126.580845 },
  },
  마포: {
    northeast: { latitude: 37.582, longitude: 126.96 },
    southwest: { latitude: 37.538, longitude: 126.886 },
  },
  성남: {
    northeast: { latitude: 37.466, longitude: 127.18 },
    southwest: { latitude: 37.394, longitude: 127.098 },
  },
  성동: {
    northeast: { latitude: 37.57, longitude: 127.054 },
    southwest: { latitude: 37.544, longitude: 127.02 },
  },
  고양: {
    northeast: { latitude: 37.705, longitude: 126.912 },
    southwest: { latitude: 37.598, longitude: 126.832 },
  },
  중구: {
    northeast: { latitude: 37.566, longitude: 127.011 },
    southwest: { latitude: 37.554, longitude: 126.973 },
  },
  송파: {
    northeast: { latitude: 37.55, longitude: 127.146 },
    southwest: { latitude: 37.494, longitude: 127.073 },
  },
  구로: {
    northeast: { latitude: 37.507, longitude: 126.902 },
    southwest: { latitude: 37.475, longitude: 126.854 },
  },
  동작: {
    northeast: { latitude: 37.514, longitude: 126.973 },
    southwest: { latitude: 37.484, longitude: 126.923 },
  },
  강북: {
    northeast: { latitude: 37.659, longitude: 127.025 },
    southwest: { latitude: 37.612, longitude: 126.982 },
  },
  부천: {
    northeast: { latitude: 37.538, longitude: 126.814 },
    southwest: { latitude: 37.47, longitude: 126.731 },
  },
  시흥: {
    northeast: { latitude: 37.448, longitude: 126.803 },
    southwest: { latitude: 37.34, longitude: 126.738 },
  },
};
