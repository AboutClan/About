import { CoordinatesProps } from "../../types/common";
import { IMapOptions, IMarkerOptions } from "../../types/externals/naverMapTypes";
import {
  RealTimeMemberProps,
  StudyResultProps,
  StudyStatus,
} from "../../types/models/studyTypes/studyDetails";
import { getCurrentLocationIcon, getStudyIcon } from "./getStudyVoteIcon";

export const getMarkersOptions = (
  studyResults: StudyResultProps[],
  studyRealTimes: RealTimeMemberProps[],
  currentLocation: CoordinatesProps,
): IMarkerOptions[] | undefined => {
  if (typeof naver === "undefined" || !studyResults) return;
  const temp = [];

  if (currentLocation) {
    temp.push({
      position: new naver.maps.LatLng(currentLocation.lat, currentLocation.lon),
      icon: {
        content: getCurrentLocationIcon(),
        size: new naver.maps.Size(72, 72),
        anchor: new naver.maps.Point(36, 44),
      },
    });
  }

  studyResults.forEach((par) => {
    temp.push({
      id: par.place._id,
      position: new naver.maps.LatLng(par.place.latitude, par.place.longitude),
      icon: {
        content: getStudyIcon(null, par.members.length),
        size: new naver.maps.Size(72, 72),
        anchor: new naver.maps.Point(36, 44),
      },
    });
  });

  if (!studyRealTimes) return;

  const tempArr = [];
  const placeMap = new Map<
    string,
    { id: string; position: naver.maps.LatLng; name: string; count: number; status: StudyStatus }
  >(); // fullname을 기준으로 그룹화할 Map 생성

  // 그룹화: fullname을 키로 하여 개수를 카운트하고 중복된 place 정보를 저장
  studyRealTimes.forEach((par) => {
    const fullname = par.place.name;
    if (placeMap.has(fullname)) {
      // 이미 fullname이 존재하면 개수를 증가시킴
      const existing = placeMap.get(fullname);
      existing.count += 1;
    } else {
      // 새롭게 fullname을 추가하며 초기 값 설정
      placeMap.set(fullname, {
        id: par.place._id,
        position: new naver.maps.LatLng(par.place.latitude, par.place.longitude),
        count: 1,
        status: par.status,
        name: par.place.name,
      });
    }
  });

  // 그룹화된 결과를 temp에 추가
  placeMap.forEach((value, fullname) => {
    temp.push({
      id: value.id,
      position: value.position,
      icon: {
        content:
          value.status === "solo"
            ? getStudyIcon("inactive")
            : value.count === 1
            ? getStudyIcon("active")
            : getStudyIcon(null, value.count), // count에 따라 content 값 설정
        size: new naver.maps.Size(72, 72),
        anchor: new naver.maps.Point(36, 44),
      },
    });
    tempArr.push(fullname); // fullname을 tempArr에 추가
  });

  return temp;
};

export const getMapOptions = (
  currentLocation: { lat: number; lon: number },
  zoomValue?: number,
): IMapOptions | undefined => {
  if (typeof naver === "undefined") return undefined;
  if (!currentLocation) return;

  // const bounds = locationBoundary
  //   ? new naver.maps.LatLngBounds(
  //       new naver.maps.LatLng(
  //         locationBoundary.southwest.latitude,
  //         locationBoundary.southwest.longitude,
  //       ),
  //       new naver.maps.LatLng(
  //         locationBoundary.northeast.latitude,
  //         locationBoundary.northeast.longitude,
  //       ),
  //     )
  //   : undefined;

  return {
    center: new naver.maps.LatLng(currentLocation.lat, currentLocation.lon),
    zoom: zoomValue || 13,
    minZoom: 11,
    // maxBounds: bounds,
    mapTypeControl: false,
    scaleControl: false,
    logoControl: false,
    mapDataControl: false,
  };
};

// const getPolyline = (
//   mainPlace: StudyPlaceProps,
//   subPlace: StudyPlaceProps,
//   isSecondSub?: boolean,
// ) => {
//   const { latitude, longitude } = mainPlace;
//   const { latitude: subLat, longitude: subLon } = subPlace;
//   return {
//     path: [new naver.maps.LatLng(latitude, longitude), new naver.maps.LatLng(subLat, subLon)],
//     strokeColor: isSecondSub ? "var(--gray-500)" : "var(--color-mint)",
//     strokeOpacity: 0.5,
//     strokeWeight: 3,
//   };
// };
