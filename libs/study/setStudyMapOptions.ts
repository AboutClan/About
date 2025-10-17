import clustering from "density-clustering";

import { CoordinatesProps } from "../../types/common";
import { IMapOptions, IMarkerOptions } from "../../types/externals/naverMapTypes";
import { StudyPlaceProps } from "../../types/models/studyTypes/study-entity.types";
import {
  getCurrentLocationIcon,
  getStudyIcon,
  getStudyIcon2,
  getVoteLocationIcon,
} from "./getStudyVoteIcon";
// export const getDetailInfo = (result: StudyMergeResultProps, myUid: string): StudyInfoProps => {
//   const members = result.members;

//   const sortedCommentUserArr = [...members]?.sort((a, b) => {
//     const aTime = dayjs(a?.updatedAt);
//     const bTime = dayjs(b?.updatedAt);
//     if (aTime.isBefore(bTime)) return -1;
//     else if (aTime.isAfter(bTime)) return 1;
//     return 0;
//   });

//   const commentUser = sortedCommentUserArr?.[0]?.user;
//   const findMyInfo = result?.members?.find((who) => who.user.uid === myUid);
//   const isPrivate = result?.status !== "open";

//   const place = convertStudyToPlaceInfo(result.place);

//   return {
//     isPrivate,
//     place,
//     time: getStudyTime(result?.members) || {
//       //수정 필요
//       start: dayjsToFormat(dayjs(), "HH:mm"),
//       end: dayjsToFormat(dayjs(), "HH:mm"),
//     },
//     participantCnt: result?.members?.length,
//     status: result.status,
//     comment: {
//       user: commentUser
//         ? {
//             uid: commentUser.uid,
//             avatar: commentUser.avatar,
//             image: commentUser.profileImage,
//           }
//         : null,
//       text:
//         sortedCommentUserArr?.[0]?.comment?.comment ||
//         STUDY_COMMENT_ARR[getRandomIdx(STUDY_COMMENT_ARR.length - 1)],
//     },
//     firstUserUid: result?.members?.[0]?.user?.uid,
//     memberStatus:
//       !findMyInfo || !result?.members.some((who) => who.user.uid === myUid)
//         ? "notParticipation"
//         : findMyInfo?.attendance?.time
//         ? "attendance"
//         : ("participation" as "notParticipation" | "attendance" | "participation"),
//   };
// };
export const getStudyPlaceMarkersOptions = (
  placeData: StudyPlaceProps[],
  selectedId: string,
  zoomNumber: number,
): IMarkerOptions[] | undefined => {
  if (typeof naver === "undefined" || !placeData?.length) return;
  const temp = [];

  interface ClusterInfoProps {
    _id: string;
    center: number[];
    count: number;
    type: "cluster" | "noise";
    name: string;
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
      11: 0.02,
      10: 0.03,
    };

    const eps = zoom >= 16 ? 0.0001 : ZOOM_EPS_MAPPIN[zoom];
    const minPts = 2;
    const clusters: number[][] = DBSCAN.run(data2, eps, minPts);

    // 3️⃣ 중심점 계산 함수
    const calcCentroid = (points: number[][]) => {
      const sum = points.reduce((acc, [lat, lon]) => [acc[0] + lat, acc[1] + lon], [0, 0]);
      const count = points.length;
      return [sum[0] / count, sum[1] / count]; // [평균 lat, 평균 lon]
    };

    // 4️⃣ 클러스터 중심 계산
    const clusterInfo = clusters.map((cluster) => {
      const points = cluster.map((idx) => data2[idx]);
      const center = calcCentroid(points);
      const count = points.length;

      // 클러스터에 포함된 place들의 _id 배열
      const clusters = cluster.map((idx) => placeData[idx]);

      // 대표 _id = 첫 번째 place의 _id
      const id = clusters[0]._id;

      return {
        _id: id,
        center,
        count,
        type: "cluster",
      };
    });

    // 5️⃣ 노이즈도 같은 형식으로 추가
    const noiseInfo = DBSCAN.noise.map((idx) => {
      const point = data2[idx];
      const data = placeData[idx];

      return {
        _id: data._id,
        center: point,
        count: 1,
        type: "noise",
        name: data.location.name,
      };
    });

    // 6️⃣ 합쳐서 반환
    return [...clusterInfo, ...noiseInfo];
  };

  const clusters = getClusterInfo(placeData, zoomNumber);

  if (clusters) {
    clusters.forEach((cluster) => {
      temp.push({
        id: cluster._id,
        type: "place",
        position: new naver.maps.LatLng(cluster.center[0], cluster.center[1]),
        icon: {
          content:
            selectedId === cluster._id
              ? getStudyIcon2("none", null, "orange", null)
              : cluster.count > 1
              ? getStudyIcon(cluster.count)
              : getStudyIcon2("none", null, null, zoomNumber >= 15 ? cluster.name : null),

          size: new naver.maps.Size(56, 60),
          anchor: new naver.maps.Point(28, 60),
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
  //         content: getStudyIcon("none", null),
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

  // if (studyResults) {
  //   studyResults.forEach((par) => {
  //     temp.push({
  //       id: par.place._id,
  //       position: new naver.maps.LatLng(par.place.latitude, par.place.longitude),
  //       icon: {
  //         content: getStudyIcon(
  //           null,
  //           par.members.length,
  //           participations || selectedId === par.place._id ? "orange" : null,
  //         ),
  //         size: new naver.maps.Size(72, 72),
  //         anchor: new naver.maps.Point(36, 44),
  //       },
  //     });
  //   });
  // }
  // if (participations) {
  //   participations.forEach((par) => {
  //     temp.push({
  //       position: new naver.maps.LatLng(par.latitude, par.longitude),
  //       icon: {
  //         content: getStudyIcon(null, 0),
  //         size: new naver.maps.Size(72, 72),
  //         anchor: new naver.maps.Point(36, 44),
  //       },
  //     });
  //   });
  // }

  // if (studyRealTimes) {
  //   const tempArr = [];
  //   const placeMap = new Map<
  //     string,
  //     { id: string; position: naver.maps.LatLng; name: string; count: number; status: StudyType }
  //   >(); // fullname을 기준으로 그룹화할 Map 생성

  //   // 그룹화: fullname을 키로 하여 개수를 카운트하고 중복된 place 정보를 저장
  //   studyRealTimes
  //     .filter((study) => study.status === "free")
  //     .forEach((par) => {
  //       const fullname = par.place.name;
  //       if (placeMap.has(fullname)) {
  //         // 이미 fullname이 존재하면 개수를 증가시킴
  //         const existing = placeMap.get(fullname);
  //         existing.count += 1;
  //       } else {
  //         // 새롭게 fullname을 추가하며 초기 값 설정
  //         placeMap.set(fullname, {
  //           id: par.place._id,
  //           position: new naver.maps.LatLng(par.place.latitude, par.place.longitude),
  //           count: 1,
  //           status: par.status,
  //           name: par.place.name,
  //         });
  //       }
  //     });

  //   // 그룹화된 결과를 temp에 추가
  //   placeMap.forEach((value, fullname) => {
  //     temp.push({
  //       id: value.id,
  //       position: value.position,
  //       icon: {
  //         content:
  //           value.status === "solo"
  //             ? getStudyIcon("inactive")
  //             : value.count === 1
  //             ? getStudyIcon("active")
  //             : getStudyIcon(null, value.count, selectedId === value.id ? "orange" : null), // count에 따라 content 값 설정
  //         size: new naver.maps.Size(72, 72),
  //         anchor: new naver.maps.Point(36, 44),
  //       },
  //     });
  //     tempArr.push(fullname); // fullname을 tempArr에 추가
  //   });
  // }
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
