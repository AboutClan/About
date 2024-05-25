import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";

import Header from "../components/layouts/Header";
import VoteMap from "../components/organisms/VoteMap";
import { STUDY_PREFERENCE_LOCAL } from "../constants/keys/queryKeys";
import {
  PointSystemProp,
  POINT_SYSTEM_PLUS,
} from "../constants/serviceConstants/pointSystemConstants";
import { STUDY_DISTANCE } from "../constants/serviceConstants/studyConstants/studyDistanceConstants";
import { PLACE_TO_LOCATION } from "../constants/serviceConstants/studyConstants/studyLocationConstants";
import { useToast } from "../hooks/custom/CustomToast";
import { useStudyPreferenceQuery, useStudyVoteQuery } from "../hooks/study/queries";
import { getStudyVoteCnt } from "../libs/study/getStudyVoteCnt";
import { getStudyVoteIcon } from "../libs/study/getStudyVoteIcon";
import { getVoteLocationCenterDot, getVoteLocationMaxBound } from "../libs/study/getStudyVoteMap";
import StudyPresetModal from "../modals/userRequest/StudyPresetModal";
import VoteDrawer, { VoteDrawerItemProps } from "../pageTemplates/vote/VoteDrawer";
import VoteTimeDrawer from "../pageTemplates/vote/VoteTimeDrawer";

import { myStudyState, studyDateStatusState } from "../recoils/studyRecoils";
import { IMapOptions, IMarkerOptions } from "../types/externals/naverMapTypes";
import { IParticipation, IPlace } from "../types/models/studyTypes/studyDetails";
import {
  IStudyVotePlaces,
  IStudyVoteWithPlace,
} from "../types/models/studyTypes/studyInterActions";
import { ActiveLocation } from "../types/services/locationTypes";
import { convertLocationLangTo } from "../utils/convertUtils/convertDatas";

export type ChoiceRank = "first" | "second" | "third";

interface PreferStorageProps {
  date: string;
  prefer: IStudyVotePlaces;
}

export type StudyVoteMapActionType = "timeSelect";

export default function StudyVoteMap() {
  const pathname = usePathname();
  const router = useRouter();
  const { data } = useSession();
  const toast = useToast();
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);
  const date = searchParams.get("date");
  const isPreset = !!searchParams.get("preset");

  const location = convertLocationLangTo(searchParams.get("location") as ActiveLocation, "kr");

  const moveToLink = () => {
    router.push(`/home?${newSearchParams.toString()}`);
  };

  const myStudy = useRecoilValue(myStudyState);

  const [preferInfo, setPreferInfo] = useState<{
    preset: "first" | "second" | null;
    prefer: IStudyVotePlaces;
  }>();
  const [myVote, setMyVote] = useState<IStudyVoteWithPlace>();
  const [precision, setPrecision] = useState<0 | 1 | 2>(1);
  const [voteScore, setVoteScore] = useState<PointSystemProp>();
  const [markersOptions, setMarkersOptions] = useState<IMarkerOptions[]>();
  const [subSecond, setSubSecond] = useState<string[]>();
  const [morePlaces, setMorePlaces] = useState<string[]>();
  const [centerValue, setCenterValue] = useState<{ lat: number; lng: number }>(null);

  const [actionType, setActionType] = useState(null);

  const [isAlert, setIsAlert] = useState(false);

  const studyDateStatus = useRecoilValue(studyDateStatusState);

  const subPlacePoint = myVote?.subPlace?.length > 5 ? 5 : myVote?.subPlace?.length || 0;

  const { data: studyVoteData } = useStudyVoteQuery(date, location, {
    enabled: !!location && !!date,
  });

  const preferenceStorage = localStorage.getItem(STUDY_PREFERENCE_LOCAL);
  const { data: studyPreference, isLoading } = useStudyPreferenceQuery({
    enabled: !preferenceStorage,
    onSuccess() {
      setMyVote(null);
    },
  });

  const savedPrefer = preferenceStorage
    ? (JSON.parse(preferenceStorage) as PreferStorageProps)?.prefer
    : null;
  const BB = studyVoteData && getSortedMainPlace(studyVoteData, savedPrefer);
  console.log("BB", BB, savedPrefer);
  //스터디 프리셋 적용
  useEffect(() => {
    if (data?.user?.location !== location) return;
    if (!preferenceStorage && isLoading) return;
    if (myVote?.subPlace?.length) return;

    const savedPrefer = JSON.parse(preferenceStorage);

    if (!savedPrefer && !studyPreference) {
      if (!isAlert) {
        toast(
          "info",
          "최초 1회 프리셋 등록이 필요합니다. 앞으로는 더 빠르게 투표할 수 있고, 이후 마이페이지에서도 변경이 가능합니다.",
        );
        setIsAlert(true);
        newSearchParams.append("preset", "on");
        router.replace(pathname + "?" + newSearchParams.toString());
      }
    } else if (
      dayjs(savedPrefer?.date).isBefore(dayjs().subtract(1, "month")) ||
      !savedPrefer?.date
    ) {
      if (!isAlert) {
        toast("info", "설정한 프리셋 기간이 만료되었습니다. 다시 등록해주세요!");
        newSearchParams.append("preset", "on");
        router.replace(pathname + "?" + newSearchParams.toString());
        setIsAlert(true);
      }
    } else if (savedPrefer?.prefer) {
      setPreferInfo({
        preset: "first",
        prefer: savedPrefer.prefer,
      });
    } else {
      // setPreferInfo({ preset: "first", prefer: studyPreference });
      // localStorage.setItem(
      //   STUDY_PREFERENCE_LOCAL,
      //   JSON.stringify({
      //     prefer: studyPreference,
      //   })
      // );
    }
  }, [data?.user, studyPreference, preferenceStorage, isLoading]);

  useEffect(() => {
    if (!studyVoteData) return;

    if (preferInfo?.preset === "first") {
      const savedPrefer = JSON.parse(preferenceStorage);
      const prefer = savedPrefer?.prefer;

      const place = studyVoteData.some((par) => par.place._id === prefer?.place)
        ? prefer.place
        : null;
      const subPlace = prefer?.subPlace.filter((sub) =>
        studyVoteData.some((par) => par.place._id === sub),
      );
      // setMyVote((old) => (place ? { ...old, place, subPlace } : { ...old }));

      if (!studyVoteData.map((data) => data.place._id).some((id) => id === place)) {
        toast("info", "해당 지역에 설정된 프리셋이 없습니다.");
      }
    } else if (preferInfo?.preset === null) setMyVote(null);
  }, [preferInfo, studyVoteData]);

  useEffect(() => {
    if (!studyVoteData) return;

    setMarkersOptions(getMarkersOptions(studyVoteData, myVote, subSecond));
  }, [studyVoteData, myVote]);

  //2지망 장소 추천 및 투표 점수 추가
  useEffect(() => {
    if (
      !studyVoteData ||
      !data?.user?.uid ||
      preferInfo?.preset ||
      studyDateStatus !== "not passed"
    )
      return;
    const place = myVote?.place;

    if (place) {
      const { sub1, sub2 } = getSecondRecommendations(studyVoteData, place._id);
      setMorePlaces([...sub1, ...sub2]);
      if (precision === 2) setSubSecond(sub2);

      // setMyVote((old) => ({
      //   ...old,
      //   subPlace: precision === 0 ? [] : precision === 2 ? [...sub1, ...sub2] : [...sub1],
      // }));
      setVoteScore(getPlaceVoteRankScore(studyVoteData, data.user.uid));
    } else {
      // setMyVote((old) => ({ ...old, subPlace: [] }));
      setVoteScore(null);
    }
  }, [myVote?.place, precision]);

  const mapOptions = getMapOptions(location);

  const handlePlaceVote = (place: IPlace) => {
    if (place._id === myVote?.place?._id) {
      setPreferInfo(undefined);
    }
    setMyVote((old) => setVotePlaceInfo(place, old));
  };
  console.log(2, myVote);

  return (
    <>
      <Header title="스터디 투표" />

      {/* <Flex justify="space-between" p="8px">
            <UnorderedList color="white">
              <ListItem>인원이 적을 때 신청하면 추가 포인트!</ListItem>
              <ListItem>신청 장소 수에 비례해 추가 포인트!</ListItem>
            </UnorderedList>
            <Flex direction="column" alignItems="flex-end" color="red.400" fontWeight={600}>
              <div>현재 획득 포인트</div>
              <div>+ {voteScore?.value || 0 + subPlacePoint} POINT</div>
            </Flex>
          </Flex> */}
      <MapLayout>
        <VoteMap
          mapOptions={mapOptions}
          markersOptions={markersOptions}
          handleMarker={handlePlaceVote}
          centerValue={centerValue}
        />
        {/* <VoteMapController
              preset={preferInfo?.preset}
              setPreset={(preset) => setPreferInfo((old) => ({ ...old, preset }))}
              precision={precision}
              setPrecision={setPrecision}
              setCenterValue={setCenterValue}
              setMyVote={setMyVote}
            /> */}
      </MapLayout>
      <VoteDrawer
        myVote={myVote}
        setMyVote={setMyVote}
        items={studyVoteData && getSortedMainPlace(studyVoteData, savedPrefer)}
        setActionType={setActionType}
      />
      <VoteTimeDrawer actionType={actionType} setActionType={setActionType} />
      {/* <MapBottomNav
            myVote={myVote}
            setMyVote={setMyVote}
            voteScore={{ ...voteScore, value: voteScore?.value || 0 + subPlacePoint }}
            morePlaces={morePlaces}
          /> */}

      {isPreset && <StudyPresetModal />}
    </>
  );
}

const getSortedMainPlace = (
  studyData: IParticipation[],
  myFavorites: IStudyVotePlaces,
): VoteDrawerItemProps[] => {
  const mainPlace = myFavorites?.place;
  const subPlaceSet = new Set(myFavorites?.subPlace);
  console.log("my", myFavorites);
  const sortedArr = !myFavorites
    ? studyData
    : [...studyData].sort((a, b) => {
        const x = a.place._id;
        const y = b.place._id;
        if (x === mainPlace) return -1;
        if (y === mainPlace) return 1;
        if (subPlaceSet.has(x) && subPlaceSet.has(y)) return 0;
        if (subPlaceSet.has(x)) return -1;
        if (subPlaceSet.has(y)) return 1;
        return 0;
      });
  return sortedArr.map((par) => ({
    fullname: par.place.fullname,
    voteCnt: par.attendences.length,
    favoritesCnt: 0,
    locationDetail: par.place.locationDetail,
    place: par.place,
    myFavorite:
      par.place._id === mainPlace ? "first" : subPlaceSet.has(par.place._id) ? "second" : null,
  }));
};

export const getSecondRecommendations = (
  voteData: IParticipation[],
  placeId: string,
): { sub1: string[]; sub2: string[] } => {
  let temp1: string[] = [];
  let temp2: string[] = [];
  temp1 = [...getRecommendations(placeId, 1)];
  temp2 = [...getRecommendations(placeId, 2)];

  const newSubPlaces1: string[] = [];
  const newSubPlaces2: string[] = [];
  temp1.forEach((subPlace) => {
    if (voteData.some((par) => par.place._id === subPlace)) {
      newSubPlaces1.push(subPlace);
    }
  });
  temp2.forEach((subPlace) => {
    if (voteData.some((par) => par.place._id === subPlace)) {
      newSubPlaces2.push(subPlace);
    }
  });
  return { sub1: newSubPlaces1, sub2: newSubPlaces2 };
};

const getRecommendations = (placeId: string, targetDistance: number): string[] => {
  const placesAtDistance = new Set<string>();
  const location = PLACE_TO_LOCATION[placeId];
  const targets = STUDY_DISTANCE[location][targetDistance];
  if (targets) {
    targets.forEach((pair) => {
      if (pair[0] === placeId) placesAtDistance.add(pair[1]);
      else if (pair[1] === placeId) placesAtDistance.add(pair[0]);
    });
  }
  return Array.from(placesAtDistance);
};

export const getPlaceVoteRankScore = (voteData: IParticipation[], uid: string): PointSystemProp => {
  const voteCnt = getStudyVoteCnt(voteData, uid);

  switch (voteCnt) {
    case 0:
      return POINT_SYSTEM_PLUS.STUDY_VOTE.first;
    case 1:
      return POINT_SYSTEM_PLUS.STUDY_VOTE.second;
    case 2:
      return POINT_SYSTEM_PLUS.STUDY_VOTE.third;
    default:
      return POINT_SYSTEM_PLUS.STUDY_VOTE.basic;
  }
};

export const getMapOptions = (location: ActiveLocation): IMapOptions | undefined => {
  if (typeof naver === "undefined") return undefined;
  return {
    center: getVoteLocationCenterDot()[location],
    zoom: 13,
    minZoom: 11,
    maxBounds: getVoteLocationMaxBound()[location],
    mapTypeControl: false,
    scaleControl: false,
    logoControl: false,
    mapDataControl: false,
  };
};

export const getMarkersOptions = (
  studyVoteData?: IParticipation[],
  myVote?: IStudyVoteWithPlace,
  secondLine?: string[],
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
    const infoWindow = placeId === myVote?.place?._id ? getInfoWindow(par) : null;
    const polyline =
      mainPlace && myVote?.subPlace?.map((obj) => obj._id).includes(placeId)
        ? getPolyline(mainPlace, par.place, secondLine?.includes(placeId))
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
      infoWindow,
      polyline,
    };
  });
};

const getInfoWindow = (par: IParticipation) => {
  return {
    content: `<div style=" font-size:12px; padding:4px 6px"><span style="font-weight:600; color:#565B67;">${par.place.brand}</span><br/><span>현재 신청 인원:<span style="color:#00c2b3; font-weight:500;"> ${par.attendences.length}명</span></span></div>`,
    borderWidth: 1,
    disableAnchor: false,
    backgroundColor: "var(--gray-100)",
    borderColor: "var(--gray-600)",
    anchorSize: new naver.maps.Size(10, 10),
    anchorColor: "var(--gray-100)",
  };
};

const getPolyline = (mainPlace: IPlace, subPlace: IPlace, isSecondSub?: boolean) => {
  const { latitude, longitude } = mainPlace;
  const { latitude: subLat, longitude: subLon } = subPlace;
  return {
    path: [new naver.maps.LatLng(latitude, longitude), new naver.maps.LatLng(subLat, subLon)],
    strokeColor: isSecondSub ? "#f87171" : "var(--color-mint)",
    strokeOpacity: 0.5,
    strokeWeight: 3,
  };
};

export const setVotePlaceInfo = (
  id: IPlace,
  voteInfo?: IStudyVoteWithPlace,
): IStudyVoteWithPlace => {
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

const Layout = styled.div<{ isChange: boolean }>`
  height: min-content;

  position: relative;
  z-index: 1000;
  width: 100%;
  display: flex;
  flex-direction: column;

  max-width: var(--max-width);
`;

const MapLayout = styled.div`
  aspect-ratio: 1/1;
`;
