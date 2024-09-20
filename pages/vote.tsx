import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import styled from "styled-components";

import Header from "../components/layouts/Header";
import VoteMap from "../components/organisms/VoteMap";
import { STUDY_RECOMMENDATION_DISTANCE } from "../constants/settingValue/study/study";
import { useStudyVoteQuery } from "../hooks/study/queries";
import { getStudyVoteCnt } from "../libs/study/getStudyVoteCnt";
import { getStudyVoteIcon } from "../libs/study/getStudyVoteIcon";
import { getVoteLocationCenterDot, getVoteLocationMaxBound } from "../libs/study/getStudyVoteMap";
import VoteDrawer from "../pageTemplates/vote/VoteDrawer";
import VoteTimeDrawer from "../pageTemplates/vote/VoteTimeDrawer";
import { IMapOptions, IMarkerOptions } from "../types/externals/naverMapTypes";
import { IParticipation, IPlace } from "../types/models/studyTypes/studyDetails";
import { IStudyVoteWithPlace } from "../types/models/studyTypes/studyInterActions";
import { ActiveLocation, LocationEn } from "../types/services/locationTypes";
import { convertLocationLangTo } from "../utils/convertUtils/convertDatas";
import { getDistanceFromLatLonInKm } from "../utils/mathUtils";

export type StudyVoteMapActionType = "timeSelect";

export default function StudyVoteMap() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const date = searchParams.get("date");

  const location = convertLocationLangTo(searchParams.get("location") as LocationEn, "kr");

  const [myVote, setMyVote] = useState<IStudyVoteWithPlace>();
  const [markersOptions, setMarkersOptions] = useState<IMarkerOptions[]>();
  const [actionType, setActionType] = useState(null);

  const { data: studyVoteOne } = useStudyVoteQuery(date, location, false, false, {
    enabled: !!location && !!date,
  });

  const studyVoteData = studyVoteOne?.[0]?.participations;

  //메인 스터디 장소가 선택되면 일정 거리 이하의 장소들이 2지망으로 자동 선택
  useEffect(() => {
    if (!studyVoteData || !myVote?.place || myVote?.subPlace) return;
    const subPlace = [];

    studyVoteData?.forEach((item) => {
      const distance = getDistanceFromLatLonInKm(
        myVote?.place.latitude,
        myVote?.place?.longitude,
        item.place.latitude,
        item.place.longitude,
      );
      if (distance < STUDY_RECOMMENDATION_DISTANCE) subPlace.push(item.place);
    });

    setMyVote((old) => ({ ...old, subPlace }));
  }, [studyVoteData, myVote?.place]);

  //지도 마커 옵션 세팅
  useEffect(() => {
    if (!studyVoteData) return;
    setMarkersOptions(getMarkersOptions(studyVoteData, myVote));
  }, [studyVoteData, myVote]);

  const [mapOptions, setMapOptions] = useState<IMapOptions>(
    getMapOptions(location as ActiveLocation),
  );

  useEffect(() => {
    setMapOptions(getMapOptions(location as ActiveLocation));
  }, [location]);

  //지도에서 마커를 통한 핸들링
  const setVotePlaceInfo = (id: IPlace, voteInfo?: IStudyVoteWithPlace): IStudyVoteWithPlace => {
    if (!voteInfo?.place) return { ...voteInfo, place: id };
    else if (voteInfo.place === id) {
      return { ...voteInfo, place: undefined, subPlace: undefined };
    } else if (voteInfo?.subPlace?.includes(id)) {
      return {
        ...voteInfo,
        subPlace: voteInfo.subPlace.filter((place) => place !== id),
      };
    } else
      return {
        ...voteInfo,
        subPlace: [...(voteInfo?.subPlace || []), id],
      };
  };



  return (
    <>
      <Header title="스터디 투표" />

      <MapLayout>
        <VoteMap
          mapOptions={mapOptions}
          markersOptions={markersOptions}
          handleMarker={(place) => setMyVote((old) => setVotePlaceInfo(place, old))}
        />
      </MapLayout>
      {studyVoteData && (
        <VoteDrawer
          myVote={myVote}
          setMyVote={setMyVote}
          studyVoteData={studyVoteData?.filter((par) => par.place.branch !== "개인 스터디")}
          setActionType={setActionType}
        />
      )}
      <VoteTimeDrawer
        myVote={
          myVote && {
            ...myVote,
            place: myVote.place?._id,
            subPlace: myVote.subPlace?.map((obj) => obj._id),
          }
        }
        voterCnt={getStudyVoteCnt(studyVoteData, session?.user.uid)}
        actionType={actionType}
        setActionType={setActionType}
      />
    </>
  );
}

const getMapOptions = (location: ActiveLocation): IMapOptions | undefined => {
  if (typeof naver === "undefined") return undefined;
  return {
    center: getVoteLocationCenterDot()[location || "수원"],
    zoom: 13,
    minZoom: 11,
    maxBounds: getVoteLocationMaxBound()[location || "수원"],
    mapTypeControl: false,
    scaleControl: false,
    logoControl: false,
    mapDataControl: false,
  };
};

const getMarkersOptions = (
  studyVoteData?: IParticipation[],
  myVote?: IStudyVoteWithPlace,
): IMarkerOptions[] | undefined => {
  if (typeof naver === "undefined" || !studyVoteData) return;

  const mainPlace = studyVoteData?.find((par) => par.place._id === myVote?.place?._id)?.place;

  return studyVoteData.map((par) => {
    const placeId = par.place._id;

    const iconType =
      placeId === myVote?.place?._id
        ? "main"
        : myVote?.subPlace?.map((obj) => obj._id).includes(placeId)
          ? "sub"
          : "default";

    const polyline =
      mainPlace && myVote?.subPlace?.map((obj) => obj._id).includes(placeId)
        ? getPolyline(
            mainPlace,
            par.place,
            myVote?.subPlace?.map((obj) => obj._id).includes(placeId),
          )
        : null;
    return {
      isPicked: myVote?.place?._id === placeId,
      id: par.place,
      position: new naver.maps.LatLng(par.place.latitude, par.place.longitude),
      title: par.place.brand,
      icon: {
        content: getStudyVoteIcon(iconType, par.place.branch),
        size: new naver.maps.Size(72, 72),
        anchor: new naver.maps.Point(36, 44),
      },

      polyline,
    };
  });
};

const getPolyline = (mainPlace: IPlace, subPlace: IPlace, isSecondSub?: boolean) => {
  const { latitude, longitude } = mainPlace;
  const { latitude: subLat, longitude: subLon } = subPlace;
  return {
    path: [new naver.maps.LatLng(latitude, longitude), new naver.maps.LatLng(subLat, subLon)],
    strokeColor: isSecondSub ? "var(--gray-500)" : "var(--color-mint)",
    strokeOpacity: 0.5,
    strokeWeight: 3,
  };
};

const MapLayout = styled.div`
  aspect-ratio: 1/1;
`;
