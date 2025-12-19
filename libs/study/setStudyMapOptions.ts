import clustering from "density-clustering";

import { CoordinatesProps } from "../../types/common";
import { IMapOptions, IMarkerOptions } from "../../types/externals/naverMapTypes";
import {
  StudyParticipationProps,
  StudyPlaceProps,
} from "../../types/models/studyTypes/study-entity.types";
import {
  getCurrentLocationIcon,
  getPlaceBasicIcon,
  getPlaceCountIcon,
  getVoteLocationIcon,
} from "./getStudyVoteIcon";

export const getNearLocationCluster = (
  members: StudyParticipationProps[],
): StudyParticipationProps[] => {
  const data2 = members.map((p) => [p.location.latitude, p.location.longitude]);

  const DBSCAN = new clustering.DBSCAN();

  const eps = 0.05;
  const minPts = 2;
  const clusters: number[][] = DBSCAN.run(data2, eps, minPts);

  // 4️⃣ 클러스터 중심 계산
  const clusterInfo = clusters.map((cluster) => {
    const points = cluster.map((idx) => members[idx]);
    return points;
  });

  // 2) noise도 동일하게 2차원 배열 형태로 처리
  const noiseInfo = DBSCAN.noise.map((idx) => [members[idx]]);

  // 3) 클러스터 크기 기준 정렬 (큰 그룹 먼저)
  const sortedGroups = [...clusterInfo, ...noiseInfo].sort((a, b) => b.length - a.length);

  // 4) 🔥 최종적으로 1차원 배열로 flatten
  const flattened = sortedGroups.flat();

  return flattened;
};

export const getStudyPlaceMarkersOptions = (
  placeData: StudyPlaceProps[],
  selectedId: string,
  zoomNumber: number,
  centerLocation?: CoordinatesProps,
): IMarkerOptions[] | undefined => {
  if (typeof naver === "undefined" || !placeData?.length) return;
  const temp = [];

  interface ClusterInfoProps {
    _id: string;
    center: number[];
    count: number;
    type: "cluster" | "noise";
    name: string;
    rating: number;
  }

  const getClusterInfo = (placeData: StudyPlaceProps[], zoom: number): ClusterInfoProps[] => {
    const data2 = placeData.map((p) => [p.location.latitude, p.location.longitude]);

    const DBSCAN = new clustering.DBSCAN();

    const ZOOM_EPS_MAPPIN = {
      16: 0.0001,
      15: 0.001,
      14: 0.0025,
      13: 0.005,
      12: 0.01,
      11: 0.012,
      10: 0.014,
    };

    const eps = zoom >= 16 || !zoom ? 0.0001 : ZOOM_EPS_MAPPIN[zoom];
    const minPts = 2;
    const clusters: number[][] = DBSCAN.run(data2, eps, minPts);

    const calcCentroid = (points: number[][]) => {
      const sum = points.reduce((acc, [lat, lon]) => [acc[0] + lat, acc[1] + lon], [0, 0]);
      const count = points.length;
      return [sum[0] / count, sum[1] / count];
    };

    const clusterInfo = clusters.map((cluster) => {
      const points = cluster.map((idx) => data2[idx]);
      const center = calcCentroid(points);
      const count = points.length;
      const clusters = cluster.map((idx) => placeData[idx]);
      const id = clusters[0]._id;
      return {
        _id: id,
        center,
        count,
        type: "cluster",
      };
    });

    const noiseInfo = DBSCAN.noise.map((idx) => {
      const point = data2[idx];
      const data = placeData[idx];
      return {
        _id: data._id,
        center: point,
        count: 1,
        type: "noise",
        name: data.location.name,
        rating: data.rating,
      };
    });

    return [...clusterInfo, ...noiseInfo];
  };

  const clusters = getClusterInfo(placeData, zoomNumber);

  if (centerLocation) {
    temp.push({
      position: new naver.maps.LatLng(centerLocation.lat, centerLocation.lon),
      icon: {
        content: getCurrentLocationIcon(),
        size: new naver.maps.Size(32, 36),
        anchor: new naver.maps.Point(16, 36),
      },
    });
  }

  if (clusters) {
    clusters.forEach((cluster) => {
      temp.push({
        id: cluster._id,
        type: "place",
        position: new naver.maps.LatLng(cluster.center[0], cluster.center[1]),
        icon: {
          content:
            selectedId === cluster._id
              ? getPlaceBasicIcon("orange", null)
              : cluster.count > 1
              ? getPlaceCountIcon(cluster.count)
              : getPlaceBasicIcon(
                  "mint",
                  zoomNumber >= 14 ? cluster.name : null,
                  false,
                  cluster.rating,
                ),
          size: new naver.maps.Size(120, 60),
          anchor: new naver.maps.Point(60, 60),
        },
      });
    });
  }

  return temp;
};

export const getMarkersOptions = (
  // studyResults: StudyConfirmedProps[],
  // studyRealTimes: RealTimeMemberProps[],
  currentLocation: CoordinatesProps,
  myVoteCoordinates: CoordinatesProps,
  // participations: StudyParticipationProps[],
): IMarkerOptions[] | undefined => {
  if (typeof naver === "undefined") return;
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

  // if (participations) {
  //   participations.forEach((par) => {
  //     temp.push({
  //       position: new naver.maps.LatLng(par.latitude, par.longitude),
  //       icon: {
  //         content: getPlaceCountIcon("none", null),
  //         size: new naver.maps.Size(72, 72),
  //         anchor: new naver.maps.Point(36, 44),
  //       },
  //     });
  //   });
  // }

  if (myVoteCoordinates) {
    temp.push({
      position: new naver.maps.LatLng(myVoteCoordinates.lat, myVoteCoordinates.lon),
      icon: {
        content: getVoteLocationIcon(),
        size: new naver.maps.Size(72, 72),
        anchor: new naver.maps.Point(36, 44),
      },
    });
  }

  return temp;
};

export const getMapOptions = (
  currentLocation: { lat: number; lon: number },
  zoomValue?: number,
): IMapOptions | undefined => {
  if (typeof naver === "undefined") return undefined;
  if (!currentLocation) return;

  return {
    center: new naver.maps.LatLng(currentLocation.lat, currentLocation.lon),
    zoom: zoomValue || 13,
    minZoom: 10,
    // maxBounds: bounds,
    mapTypeControl: false,
    scaleControl: false,
    logoControl: false,
    mapDataControl: false,
  };
};
