import { ActiveLocation, Location } from "../../../types/services/locationTypes";

export const ACTIVE_LOCATION_CENTER_DOT: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key in ActiveLocation]: { latitude: number; longitude: number };
} = {
  수원: { latitude: 37.278992, longitude: 127.025727 },
  안양: { latitude: 37.388896, longitude: 126.950088 },
  양천: { latitude: 37.527588, longitude: 126.896441 },
  강남: { latitude: 37.503744, longitude: 127.048898 },
  동대문: { latitude: 37.58452, longitude: 127.041047 },
  인천: { latitude: 37.428334, longitude: 126.674935 },
};

export const LOCATION_CENTER_DOT: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key in Location]: { latitude: number; longitude: number };
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
  시흥: { latitude: 37.95177, longitude: 126.903489 },
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
  [key in Location]: {
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
    northeast: { latitude: 37.6, longitude: 126.98 },
    southwest: { latitude: 37.52, longitude: 126.86 },
  },
  성남: {
    northeast: { latitude: 37.5, longitude: 127.25 },
    southwest: { latitude: 37.36, longitude: 127.05 },
  },
  성동: {
    northeast: { latitude: 37.58, longitude: 127.08 },
    southwest: { latitude: 37.53, longitude: 127.0 },
  },
  고양: {
    northeast: { latitude: 37.73, longitude: 126.95 },
    southwest: { latitude: 37.55, longitude: 126.75 },
  },
  중구: {
    northeast: { latitude: 37.58, longitude: 127.05 },
    southwest: { latitude: 37.54, longitude: 126.93 },
  },
  송파: {
    northeast: { latitude: 37.57, longitude: 127.2 },
    southwest: { latitude: 37.46, longitude: 127.05 },
  },
  구로: {
    northeast: { latitude: 37.52, longitude: 126.95 },
    southwest: { latitude: 37.45, longitude: 126.8 },
  },
  동작: {
    northeast: { latitude: 37.53, longitude: 127.0 },
    southwest: { latitude: 37.46, longitude: 126.88 },
  },
  강북: {
    northeast: { latitude: 37.68, longitude: 127.1 },
    southwest: { latitude: 37.59, longitude: 126.95 },
  },
  부천: {
    northeast: { latitude: 37.55, longitude: 126.85 },
    southwest: { latitude: 37.45, longitude: 126.7 },
  },
  시흥: {
    northeast: { latitude: 37.5, longitude: 126.9 },
    southwest: { latitude: 37.3, longitude: 126.65 },
  },
};
