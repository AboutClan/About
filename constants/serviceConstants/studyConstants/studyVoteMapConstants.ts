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
    southwest: { latitude: number; longitude: number };
    northeast: { latitude: number; longitude: number };
  };
} = {
  수원: {
    southwest: { latitude: 37.22711, longitude: 126.955637 },
    northeast: { latitude: 37.357058, longitude: 127.142965 },
  },
  안양: {
    southwest: { latitude: 37.451075, longitude: 126.888074 },
    northeast: { latitude: 37.357058, longitude: 127.142965 },
  },
  양천: {
    southwest: { latitude: 37.553289, longitude: 126.819398 },
    northeast: { latitude: 37.482753, longitude: 126.941598 },
  },
  강남: {
    southwest: { latitude: 37.532565, longitude: 126.991213 },
    northeast: { latitude: 37.468873, longitude: 127.107285 },
  },
  동대문: {
    southwest: { latitude: 37.557579, longitude: 126.989614 },
    northeast: { latitude: 37.638954, longitude: 127.106856 },
  },
  인천: {
    southwest: { latitude: 37.584965, longitude: 126.580845 },
    northeast: { latitude: 37.341746, longitude: 126.803871 },
  },
};
