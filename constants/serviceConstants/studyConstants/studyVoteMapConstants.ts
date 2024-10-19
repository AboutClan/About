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
    southwest: { latitude: 37.220011, longitude: 126.955637 },
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
};
