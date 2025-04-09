import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";

import ArrowBackButton from "../components/atoms/buttons/ArrowBackButton";
import { MainLoadingAbsolute } from "../components/atoms/loaders/MainLoading";
import Header from "../components/layouts/Header";
import VoteMap from "../components/organisms/VoteMap";
import { USER_LOCATION } from "../constants/keys/localStorage";
import {
  LOCATION_CENTER_DOT,
  LOCATION_MAX_BOUNDARY,
} from "../constants/serviceConstants/studyConstants/studyVoteMapConstants";
import { useToast } from "../hooks/custom/CustomToast";
import { useStudyVoteQuery } from "../hooks/study/queries";
import { useUserInfoQuery } from "../hooks/user/queries";
import { getStudyViewDate } from "../libs/study/date/getStudyDateStatus";
import { getLocationByCoordinates } from "../libs/study/getLocationByCoordinates";
import { getMyStudyParticipation } from "../libs/study/getMyStudyMethods";
import {
  getCurrentLocationIcon,
  getStudyIcon,
  getStudyVoteIcon,
} from "../libs/study/getStudyVoteIcon";
import StudyInfoDrawer, { StudyInfoProps } from "../pageTemplates/studyPage/StudyInfoDrawer";
import StudyMapTopNav from "../pageTemplates/studyPage/StudyMapTopNav";
import StudyControlButton from "../pageTemplates/vote/StudyControlButton";
import VoteDrawer from "../pageTemplates/vote/VoteDrawer";
import { myStudyParticipationState } from "../recoils/studyRecoils";
import { CoordinatesProps, VotePlacesProps } from "../types/common";
import { IMapOptions, IMarkerOptions } from "../types/externals/naverMapTypes";
import {
  StudyPlaceProps,
  StudyStatus,
  StudyVoteDataProps,
} from "../types/models/studyTypes/studyDetails";
import { ActiveLocation, Location, LocationEn } from "../types/services/locationTypes";
import { convertLocationLangTo } from "../utils/convertUtils/convertDatas";
import { iPhoneNotchSize } from "../utils/validationUtils";

// const NEXT_PUBLIC_NAVER_CLIENT_ID = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID;

export default function StudyPage() {
  const { data: session } = useSession();
  const toast = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);

  const dateParam = searchParams.get("date");
  const voteDrawerParam = searchParams.get("voteDrawer") as "up" | "down";
  const drawerParam = searchParams.get("drawer") as "up" | "down";
  const centerParam = searchParams.get("center") as "locationPlace" | "mainPlace" | "votePlace";
  const locationParamKr = convertLocationLangTo(
    searchParams.get("location") as LocationEn,
    "kr",
  ) as ActiveLocation;

  const userLocation =
    (localStorage.getItem(USER_LOCATION) as Location | "기타") || session?.user.location;

  const [date, setDate] = useState(dateParam || getStudyViewDate(dayjs()));
  const [locationValue, setLocationValue] = useState<Location>(
    locationParamKr || userLocation === "기타" ? "수원" : userLocation,
  );

  const [mapOptions, setMapOptions] = useState<IMapOptions>();
  const [markersOptions, setMarkersOptions] = useState<IMarkerOptions[]>();
  const [currentLocation, setCurrentLocation] = useState<CoordinatesProps>();
  const [centerLocation, setCenterLocation] = useState<CoordinatesProps>();
  const [isVoteDrawer, setIsVoteDrawer] = useState(false);
  const [isLocationRefetch, setIsLocationRefetch] = useState(true);
  const [myVote, setMyVote] = useState<VotePlacesProps>({ main: null, sub: [] });
  const [detailInfo, setDetailInfo] = useState<StudyInfoProps>();
  //이후 제거
  const [isVoteDrawerFirst, setIsVoteDrawerFirst] = useState(true);

  const [myStudyParticipation, setMyStudyParticipation] = useRecoilState(myStudyParticipationState);
  const [isDrawerUp, setIsDrawerUp] = useState(drawerParam === "up" ? true : false);

  const { data: userInfo } = useUserInfoQuery();
  const { data: studyVoteData, isLoading } = useStudyVoteQuery(date, {
    enabled: !!date,
  });

  //초기 param 값들 설정
  //locationValue와 date는 초기부터 존재 (+ useEffect의 의존 인자x)
  //내 스터디 투표 정보가 있는지에 따라 분류

  useEffect(() => {
    if (!locationValue) return;
    if (isDrawerUp) newSearchParams.set("drawer", "up");
    else newSearchParams.set("drawer", "down");
    newSearchParams.set("center", myStudyParticipation ? "votePlace" : "locationPlace");
    newSearchParams.set("location", `${convertLocationLangTo(locationValue, "en")}`);
    newSearchParams.set("date", `${getStudyViewDate(dayjs(date))}`);

    router.replace(`/studyPageMap?${newSearchParams.toString()}`);

    if (myStudyParticipation) {
      const lat = myStudyParticipation.place.latitude;
      const lon = myStudyParticipation.place.longitude;
      const changeLocation = getLocationByCoordinates(lat, lon);
      if (changeLocation !== locationValue) {
        setLocationValue(changeLocation as ActiveLocation);
      }

      setCenterLocation({
        lat: lat,
        lon: lon,
      });
    } else {
      const locationCenter = LOCATION_CENTER_DOT[userLocation === "기타" ? "수원" : userLocation];

      setCenterLocation({ lat: locationCenter.latitude, lon: locationCenter.longitude });
    }
  }, [myStudyParticipation]);

  useEffect(() => {
    if (isDrawerUp) newSearchParams.set("drawer", "up");
    else newSearchParams.set("drawer", "down");
    router.replace(`/studyPageMap?${newSearchParams.toString()}`);
  }, [isDrawerUp]);

  useEffect(() => {
    if (!studyVoteData || !session?.user.uid) return;
    let isChangeLocation = false;
    if (!isVoteDrawer) {
      const findMyStudyParticipation = getMyStudyParticipation(studyVoteData, session.user.uid);

      if (findMyStudyParticipation && !myStudyParticipation) {
        setMyStudyParticipation(findMyStudyParticipation);
        const changeLocation = getLocationByCoordinates(
          findMyStudyParticipation.place.latitude,
          findMyStudyParticipation.place.longitude,
        );

        if (!changeLocation) return;

        if (changeLocation === locationValue) {
          setCenterLocation({
            lat: findMyStudyParticipation.place.latitude,
            lon: findMyStudyParticipation.place.longitude,
          });
        } else if (centerParam === "votePlace" && changeLocation !== locationValue) {
          isChangeLocation = true;
          setLocationValue(changeLocation as ActiveLocation);
          setCenterLocation({
            lat: findMyStudyParticipation.place.latitude,
            lon: findMyStudyParticipation.place.longitude,
          });
        }
      } else {
        if (locationValue) {
          const centerCoordination = LOCATION_CENTER_DOT[locationValue];
          setCenterLocation({
            lat: centerCoordination.latitude,
            lon: centerCoordination.longitude,
          });
        }
      }
      setIsVoteDrawerFirst(true);
    }

    if (!isChangeLocation) {
      setMarkersOptions(
        getMarkersOptions(
          studyVoteData,
          currentLocation,
          isVoteDrawer ? myVote : null,
          !isVoteDrawer ? isVoteDrawerFirst : null,
        ),
      );
    }
  }, [studyVoteData, session?.user.uid, currentLocation, myVote, isVoteDrawer]);

  const isGPSInitialRender = useRef(true);
  useEffect(() => {
    if (!isLocationRefetch) return;
    setIsLocationRefetch(false);

    navigator.permissions.query({ name: "geolocation" }).then((result) => {
      if (result.state === "denied") {
        toast("warning", "장소 추천을 위해, 위치 권한을 허용해주세요.");
      } else if (result.state === "prompt") {
        toast("warning", "이 앱은 사용자의 위치 정보를 이용해 가까운 스터디 장소를 추천합니다.");
      }
    });

    navigator.geolocation.getCurrentPosition(
      function (position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setCurrentLocation({ lat, lon });
        const changeLocation = getLocationByCoordinates(lat, lon);
        if (changeLocation) {
          if (!isGPSInitialRender.current) {
            setLocationValue(changeLocation as ActiveLocation);
            setCenterLocation({ lat, lon });
          }
        } else if (!isGPSInitialRender.current) {
          //원하는 시점에 동작하지 않아서 일단 비활성화. 이후 추가
          // toast("warning", "활성화 된 지역에 있지 않습니다.");
        }
      },
      function (error) {
        console.error("위치 정보를 가져오는 데 실패했습니다: ", error);
        const locationCenter = LOCATION_CENTER_DOT[locationValue];
        setCenterLocation({ lat: locationCenter.latitude, lon: locationCenter.longitude });
        setCurrentLocation({ lat: locationCenter.latitude, lon: locationCenter.longitude });
      },
      {
        enableHighAccuracy: true, // 고정밀도 모드 활성화
        timeout: 4000, // 4초 안에 위치를 가져오지 못하면 오류 발생
        maximumAge: 0, // 캐시된 위치 정보를 사용하지 않음
      },
    );
    if (isGPSInitialRender.current) {
      isGPSInitialRender.current = false;
    }
  }, [isLocationRefetch]);

  //voteDrawer이 열려있는 경우에는
  //centerLocation이 없는 경우는 없다! 다 방지해야 됨
  //voteDrawerParam 처리가 적절한 위치인지는 모르겠으나 map 생성이 된 이후여야 해서 여기 배치함
  useEffect(() => {
    if (!centerLocation || !locationValue) return;

    if (isVoteDrawer) return;
    const options = getMapOptions(centerLocation, locationValue, 13);
    setMapOptions(options);

    if (voteDrawerParam === "up") {
      setIsDrawerUp(false);
      setIsVoteDrawer(true);
      newSearchParams.delete("voteDrawer");
      router.replace(`/studyPageMap?${newSearchParams.toString()}`);
    }
  }, [centerLocation, locationValue, isVoteDrawer]);

  const handleMarker = (id: string, type: "vote") => {
    if (!id || !studyVoteData) return;

    if (type === "vote") {
      setMyVote((old) => {
        if (old?.main === id) return { main: null, sub: [] };
        else if (!old?.main) return { main: id, sub: [] };
        else if (old?.sub.includes(id))
          return { ...old, sub: old.sub.filter((place) => place !== id) };
        else return { ...old, sub: [...old.sub, id] };
      });

      return;
    }
    const detailInfo = getDetailInfo(studyVoteData, id, locationValue, userInfo?.uid);
    setDetailInfo(detailInfo);
  };

  return (
    <>
      <Header title="스터디 지도" />
      <Box
        position="relative"
        height={
          !isVoteDrawer
            ? `calc(100vh - var(--bottom-nav-height) - ${iPhoneNotchSize()}px)`
            : `calc(100vh - 452px - ${iPhoneNotchSize()}px)`
        }
        overflow="hidden"
      >
        {!isVoteDrawer ? (
          <StudyMapTopNav
            location={locationValue}
            setLocation={(location) => {
              newSearchParams.set("center", "locationPlace");
              newSearchParams.set(
                "location",
                convertLocationLangTo(location as ActiveLocation, "en"),
              );

              setLocationValue(location);
              router.replace(`/studyPageMap?${newSearchParams.toString()}`);
            }}
            setCenterLocation={setCenterLocation}
            setIsLocationFetch={setIsLocationRefetch}
            isSmall={false}
          />
        ) : (
          <Box position="fixed" zIndex={20} top="0" left="0">
            <ArrowBackButton
              func={() => {
                setIsVoteDrawer(false);
                setIsDrawerUp(false);
              }}
            />
          </Box>
        )}
        <VoteMap
          mapOptions={mapOptions}
          markersOptions={markersOptions}
          handleMarker={handleMarker}
          resizeToggle={isVoteDrawer}
        />
        {isLoading && <MainLoadingAbsolute />}
      </Box>
      <StudyControlButton date={date} setIsVoteDrawer={setIsVoteDrawer} isVoting={false} />

      {isVoteDrawer && (
        <VoteDrawer
          currentLocation={currentLocation}
          date={date}
          location={locationValue}
          setIsModal={() => {
            setIsVoteDrawer(false);
            setIsDrawerUp(false);
          }}
          studyVoteData={studyVoteData}
          setCenterLocation={setCenterLocation}
          myVote={myVote}
          setMyVote={setMyVote}
          isFirstPage={isVoteDrawerFirst}
          setIsFirstPage={setIsVoteDrawerFirst}
          setIsVoteDrawer={setIsVoteDrawer}
        />
      )}
      {detailInfo && (
        <StudyInfoDrawer
          date={date}
          detailInfo={detailInfo}
          studyVoteData={studyVoteData}
          setDetailInfo={setDetailInfo}
        />
      )}
    </>
  );
}

const getMarkersOptions = (
  studyVoteData: StudyVoteDataProps,
  currentLocation: CoordinatesProps,
  myVote: VotePlacesProps | null,
  onlyFirst: boolean,
): IMarkerOptions[] | undefined => {
  if (typeof naver === "undefined" || !studyVoteData) return;
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

  studyVoteData.participations.forEach((par) => {
    if (myVote) {
      const mainPlace = studyVoteData?.participations?.find(
        (par) => par.place._id === myVote?.main,
      )?.place;
      const placeId = par.place._id;

      const iconType =
        placeId === myVote?.main
          ? "main"
          : onlyFirst
          ? "default"
          : myVote?.sub?.includes(placeId)
          ? "sub"
          : "default";

      const polyline =
        mainPlace && myVote?.sub?.includes(placeId)
          ? getPolyline(mainPlace, par.place, myVote?.sub?.includes(placeId))
          : null;

      temp.push({
        isPicked: myVote?.main === placeId,
        id: par.place._id,
        position: new naver.maps.LatLng(par.place.latitude, par.place.longitude),
        title: par.place.brand,
        icon: {
          content: getStudyVoteIcon(iconType, par.place.branch),
          size: new naver.maps.Size(72, 72),
          anchor: new naver.maps.Point(36, 44),
        },
        type: "vote",
        polyline,
      });
    } else {
      temp.push({
        id: par.place._id,
        position: new naver.maps.LatLng(par.place.latitude, par.place.longitude),
        icon: {
          content: getStudyIcon(null, par.members.length),
          size: new naver.maps.Size(72, 72),
          anchor: new naver.maps.Point(36, 44),
        },
      });
    }
  });

  // if (myVote) return temp;

  const tempArr = [];
  const placeMap = new Map<
    string,
    { id: string; position: naver.maps.LatLng; name: string; count: number; status: StudyStatus }
  >(); // fullname을 기준으로 그룹화할 Map 생성

  // 그룹화: fullname을 키로 하여 개수를 카운트하고 중복된 place 정보를 저장
  studyVoteData.realTime.forEach((par) => {
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

  if (myVote) {
    placeMap.forEach((value, fullname) => {
      const iconType =
        value.id === myVote?.main
          ? "main"
          : onlyFirst
          ? "default"
          : myVote?.sub?.includes(value.id)
          ? "sub"
          : "default";

      temp.push({
        isPicked: myVote?.main === value.id,
        id: value.id,
        position: value.position,
        title: value.name,
        icon: {
          content: getStudyVoteIcon(iconType, value.name),
          size: new naver.maps.Size(72, 72),
          anchor: new naver.maps.Point(36, 44),
        },
        type: "vote",
      });
      tempArr.push(fullname); // fullname을 tempArr에 추가
    });
  } else {
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
  location: Location,
  zoomValue?: number,
): IMapOptions | undefined => {
  if (typeof naver === "undefined") return undefined;

  if (!currentLocation || !location) return;
  const locationBoundary = LOCATION_MAX_BOUNDARY[location];

  const bounds = locationBoundary
    ? new naver.maps.LatLngBounds(
        new naver.maps.LatLng(
          locationBoundary.southwest.latitude,
          locationBoundary.southwest.longitude,
        ),
        new naver.maps.LatLng(
          locationBoundary.northeast.latitude,
          locationBoundary.northeast.longitude,
        ),
      )
    : undefined;

  return {
    center: new naver.maps.LatLng(currentLocation.lat, currentLocation.lon),
    zoom: zoomValue || 13,
    minZoom: 11,
    maxBounds: bounds,
    mapTypeControl: false,
    scaleControl: false,
    logoControl: false,
    mapDataControl: false,
  };
};

const getPolyline = (
  mainPlace: StudyPlaceProps,
  subPlace: StudyPlaceProps,
  isSecondSub?: boolean,
) => {
  const { latitude, longitude } = mainPlace;
  const { latitude: subLat, longitude: subLon } = subPlace;
  return {
    path: [new naver.maps.LatLng(latitude, longitude), new naver.maps.LatLng(subLat, subLon)],
    strokeColor: isSecondSub ? "var(--gray-500)" : "var(--color-mint)",
    strokeOpacity: 0.5,
    strokeWeight: 3,
  };
};
