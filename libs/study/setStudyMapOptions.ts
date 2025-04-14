import dayjs from "dayjs";

import { STUDY_COMMENT_ARR } from "../../constants/settingValue/comment";
import { StudyInfoProps } from "../../pageTemplates/studyPage/StudyInfoDrawer";
import { CoordinatesProps } from "../../types/common";
import { IMapOptions, IMarkerOptions } from "../../types/externals/naverMapTypes";
import {
  RealTimeMemberProps,
  StudyParticipationProps,
  StudyPlaceProps,
  StudyResultProps,
  StudyStatus,
} from "../../types/models/studyTypes/baseTypes";
import { StudyMergeResultProps } from "../../types/models/studyTypes/derivedTypes";
import { dayjsToFormat } from "../../utils/dateTimeUtils";
import { getRandomIdx } from "../../utils/mathUtils";
import { getStudyTime } from "./getStudyTime";
import { getCurrentLocationIcon, getStudyIcon, getVoteLocationIcon } from "./getStudyVoteIcon";
import { convertMergePlaceToPlace } from "./studyConverters";

export const getDetailInfo = (result: StudyMergeResultProps, myUid: string): StudyInfoProps => {
  const members = result.members;

  const sortedCommentUserArr = [...members]?.sort((a, b) => {
    const aTime = dayjs(a?.updatedAt);
    const bTime = dayjs(b?.updatedAt);
    if (aTime.isBefore(bTime)) return -1;
    else if (aTime.isAfter(bTime)) return 1;
    return 0;
  });

  const commentUser = sortedCommentUserArr?.[0]?.user;
  const findMyInfo = result?.members?.find((who) => who.user.uid === myUid);
  const isPrivate = result?.status !== "open";

  const place = convertMergePlaceToPlace(result.place);

  return {
    isPrivate,
    place,
    time: getStudyTime(result?.members) || {
      //수정 필요
      start: dayjsToFormat(dayjs(), "HH:mm"),
      end: dayjsToFormat(dayjs(), "HH:mm"),
    },
    participantCnt: result?.members?.length,
    status: result.status,
    comment: {
      user: commentUser
        ? {
            uid: commentUser.uid,
            avatar: commentUser.avatar,
            image: commentUser.profileImage,
          }
        : null,
      text:
        sortedCommentUserArr?.[0]?.comment?.text ||
        STUDY_COMMENT_ARR[getRandomIdx(STUDY_COMMENT_ARR.length - 1)],
    },
    firstUserUid: result?.members?.[0]?.user?.uid,
    memberStatus:
      !findMyInfo || !result?.members.some((who) => who.user.uid === myUid)
        ? "notParticipation"
        : findMyInfo?.attendance?.time
        ? "attendance"
        : ("participation" as "notParticipation" | "attendance" | "participation"),
  };
};
export const getStudyPlaceMarkersOptions = (
  placeData: StudyPlaceProps[],
): IMarkerOptions[] | undefined => {
  if (typeof naver === "undefined") return;
  const temp = [];

  if (placeData) {
    placeData.forEach((place) => {
      temp.push({
        id: place._id,
        type: "place",
        position: new naver.maps.LatLng(place.latitude, place.longitude),
        icon: {
          content: getStudyIcon("none"),
          size: new naver.maps.Size(72, 72),
          anchor: new naver.maps.Point(36, 44),
        },
      });
    });
  }
  return temp;
};

export const getMarkersOptions = (
  studyResults: StudyResultProps[],
  studyRealTimes: RealTimeMemberProps[],
  currentLocation: CoordinatesProps,
  myVoteCoordinates: CoordinatesProps,
  participations: StudyParticipationProps[],
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

  if (participations) {
    participations.forEach((par) => {
      temp.push({
        position: new naver.maps.LatLng(par.latitude, par.longitude),
        icon: {
          content: getStudyIcon("none", null),
          size: new naver.maps.Size(72, 72),
          anchor: new naver.maps.Point(36, 44),
        },
      });
    });
  }

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

  if (studyResults) {
    studyResults.forEach((par) => {
      temp.push({
        id: par.place._id,
        position: new naver.maps.LatLng(par.place.latitude, par.place.longitude),
        icon: {
          content: getStudyIcon(null, par.members.length, participations ? "orange" : null),
          size: new naver.maps.Size(72, 72),
          anchor: new naver.maps.Point(36, 44),
        },
      });
    });
  }
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

  if (studyRealTimes) {
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
