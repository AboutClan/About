import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { useSetRecoilState } from "recoil";

import { STUDY_MAIN_IMAGES } from "../assets/images/studyMain";
import ArrowBackButton from "../components/atoms/buttons/ArrowBackButton";
import { DRAWER_MIN_HEIGHT } from "../components/organisms/drawer/BottomFlexDrawer";
import VoteMap from "../components/organisms/VoteMap";
import { USER_LOCATION } from "../constants/keys/localStorage";
import {
  LOCATION_CENTER_DOT,
  LOCATION_MAX_BOUNDARY,
} from "../constants/serviceConstants/studyConstants/studyVoteMapConstants";
import { STUDY_COMMENT_ARR } from "../constants/settingValue/comment";
import { useToast } from "../hooks/custom/CustomToast";
import { useStudyVoteQuery } from "../hooks/study/queries";
import { useUserInfoQuery } from "../hooks/user/queries";
import { getStudyViewDate } from "../libs/study/date/getStudyDateStatus";
import { getLocationByCoordinates } from "../libs/study/getLocationByCoordinates";
import { getMyStudyParticipation, getRealTimeFilteredById } from "../libs/study/getMyStudyMethods";
import { getStudyTime } from "../libs/study/getStudyTime";
import {
  getCurrentLocationIcon,
  getStudyIcon,
  getStudyVoteIcon,
} from "../libs/study/getStudyVoteIcon";
import StudyInFoDrawer, { StudyInfoProps } from "../pageTemplates/studyPage/StudyInfoDrawer";
import StudyMapTopNav from "../pageTemplates/studyPage/StudyMapTopNav";
import StudyPageDrawer from "../pageTemplates/studyPage/StudyPageDrawer";
import StudyControlButton from "../pageTemplates/vote/StudyControlButton";
import VoteDrawer from "../pageTemplates/vote/VoteDrawer";
import { myStudyParticipationState } from "../recoils/studyRecoils";
import { CoordinateProps, VotePlacesProps } from "../types/common";
import { IMapOptions, IMarkerOptions } from "../types/externals/naverMapTypes";
import { StudyDailyInfoProps, StudyPlaceProps } from "../types/models/studyTypes/studyDetails";
import { PlaceInfoProps } from "../types/models/utilTypes";
import { ActiveLocation, LocationEn } from "../types/services/locationTypes";
import { convertLocationLangTo } from "../utils/convertUtils/convertDatas";
import { dayjsToFormat, dayjsToStr } from "../utils/dateTimeUtils";
import { getRandomIdx } from "../utils/mathUtils";
import { iPhoneNotchSize } from "../utils/validationUtils";

export default function StudyVoteMap() {
  const { data: session } = useSession();
  const toast = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);
  const dateParam = searchParams.get("date");
  const voteDrawerParam = searchParams.get("voteDrawer");
  const centerParam = searchParams.get("center") as
    | "locationPlace"
    | "currentPlace"
    | "mainPlace"
    | "votePlace";

  const locationParamKr = convertLocationLangTo(
    searchParams.get("location") as LocationEn,
    "kr",
  ) as ActiveLocation;
  const userLocation =
    (localStorage.getItem(USER_LOCATION) as ActiveLocation) || session?.user.location;

  const [mapOptions, setMapOptions] = useState<IMapOptions>();
  const [markersOptions, setMarkersOptions] = useState<IMarkerOptions[]>();
  const [currentLocation, setCurrentLocation] = useState<CoordinateProps>();
  const [centerLocation, setCenterLocation] = useState<CoordinateProps>();
  const [isVoteDrawer, setIsVoteDrawer] = useState(false);
  const [isDrawerUp, setIsDrawerUp] = useState(true);
  // const [locationFilterType, setLocationFilterType] = useState<
  //   "현재 위치" | "활동 장소" | "스터디 장소"
  // >("현재 위치");

  //최초에 GPS 키면서 시작
  const [isLocationRefetch, setIsLocationRefetch] = useState(true);

  const [date, setDate] = useState(dateParam || dayjsToStr(dayjs()));
  const [locationValue, setLocationValue] = useState<ActiveLocation>(
    locationParamKr || userLocation,
  );
  const [myVote, setMyVote] = useState<VotePlacesProps>({ main: null, sub: [] });
  //이후 제거
  const [isVoteDrawerFirst, setIsVoteDrawerFirst] = useState(true);

  const [detailInfo, setDetailInfo] = useState<StudyInfoProps>();

  const setMyStudyParticipation = useSetRecoilState(myStudyParticipationState);

  const { data: userInfo } = useUserInfoQuery();

  const { data: studyVoteData } = useStudyVoteQuery(date, locationValue, {
    enabled: !!locationValue && !!date,
  });

  //초기 param 값들 설정
  useEffect(() => {
    if (!userLocation) return;
    newSearchParams.set("center", "locationPlace");
    newSearchParams.set("location", `${convertLocationLangTo(userLocation, "en")}`);
    newSearchParams.set("date", `${getStudyViewDate(dayjs())}`);
    router.replace(`/studyPage?${newSearchParams.toString()}`);
    const locationCenter = LOCATION_CENTER_DOT[userLocation];
    setCenterLocation({ lat: locationCenter.latitude, lon: locationCenter.longitude });
  }, [userLocation]);

  //studyVoteData가 바뀌는 경우는 지역이 바뀌거나 초기화 된 경우
  //지역 바뀌었을때 내 투표 정보가 없으면 어차피 find는 false가 된다.
  //고로 내 투표 장소를 찾았다면 무조건 중심으로 바꿔도 된다.
  //단 !! 실시간 스터디는 어느 지역이든 데이터가 포함되니 확인이 필요!!
  //그렇다고 무조건 지역 변경까지 해버리면 안됨.
  //1. 이게 필요한 경우는 '내 스터디 장소'로 버튼을 직접 누르거나,
  //2. 스터디 투표나 출석을 한 직후에 지역이 다른 경우에만 바꿔줌
  //그러면 1번은 직접 하고, 2번은 param을 통해 하자.
  //centerParam은 이전 투표나 출석에서 이동하는 경우 하나라서 의존 인자로 넣을 필요가 없다!
  //changeLocation이 있는 경우는 해당 지역 투표에 있거나, 실시간 스터디에 참여중이거나!
  //각 경우 나눠서 생각해야 함
  //changeLocation이 아예 없는 경우가 있을 수 있나? 투표를 못하게 했으니까 의도적으로는 없음.
  //currentLocation이 없더라도 지도는 생성하고, currentLocation 변화는 많지 않기에 같이 묶었음
  //voteDrawer에 대해 의존인자가 겹치는 게 많고 한번에 관리하기 위해 같이 다룸
  //하지만 voteDrawer로 인해 렌더링이 여러번 되지 않도록 잘 방지해야 함
  //my
  useEffect(() => {
    if (!studyVoteData || !session?.user.uid) return;

    let isChangeLocation = false;

    if (!isVoteDrawer) {
      const findMyStudyParticipation = getMyStudyParticipation(studyVoteData, session.user.uid);
      setMyStudyParticipation(findMyStudyParticipation);

      if (findMyStudyParticipation) {
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
      }
      setIsVoteDrawerFirst(true);
    }

    if (!isChangeLocation) {
      setMarkersOptions(
        getMarkersOptions(
          studyVoteData,
          currentLocation,
          isVoteDrawer ? myVote : null,
          isVoteDrawer ? isVoteDrawerFirst : null,
        ),
      );
    }
  }, [studyVoteData, session?.user.uid, currentLocation, myVote, isVoteDrawer]);

  //최초 실행일때는 활성화 된 지역이 아니라는 경고를 보내지 않는다
  //첫 렌더링을 제외하고는 무조건 isLocationFetch를 통해서만 실행된다
  //활성화 된 지역이 아니더라도 장소까지의 distance 측정을 위해 값은 부여한다.
  //최초 실행때는 지역 기준이지만, 의도적으로 실행된 경우에는 center와 location까지 변경
  //위치 정보 가져오는게 실패하면 기본 값인 지역 기준으로 변경한다.
  //currentLocation은? 장소까지의 거리 계산을 위해 필요하긴 한데...
  //일단 지역 중심으로 같이 초기화
  const isGPSInitialRender = useRef(true);
  useEffect(() => {
    if (!isLocationRefetch) return;
    setIsLocationRefetch(false);
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
          toast("warning", "활성화 된 지역에 있지 않습니다.");
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
    setMapOptions(getMapOptions(centerLocation, locationValue, centerParam === "votePlace" && 15));
    if (voteDrawerParam === "up") {
      setIsDrawerUp(false);
      setIsVoteDrawer(true);
      newSearchParams.delete("voteDrawer");
      router.replace(`/studyPage?${newSearchParams.toString()}`);
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
      <Box
        position="relative"
        height={
          !isVoteDrawer
            ? `calc(100dvh - var(--bottom-nav-height) - ${DRAWER_MIN_HEIGHT + iPhoneNotchSize()}px)`
            : `calc(100vh - 452px - ${iPhoneNotchSize()}px)`
        }
        maxH="100dvh"
      >
        {!isVoteDrawer ? (
          <StudyMapTopNav
            location={locationValue}
            setLocation={setLocationValue}
            setCenterLocation={setCenterLocation}
            setIsLocationFetch={setIsLocationRefetch}
          />
        ) : (
          <Box position="fixed" zIndex={20} top="16px" left="16px">
            <ArrowBackButton
              func={() => {
                setIsVoteDrawer(false);
                setIsDrawerUp(true);
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
      </Box>
      <StudyControlButton setIsVoteDrawer={setIsVoteDrawer} setIsDrawerUp={setIsDrawerUp} />

      <StudyPageDrawer
        studyVoteData={studyVoteData}
        location={locationValue}
        date={date}
        setDate={setDate}
        currentLocation={currentLocation}
        isDrawerUp={isDrawerUp}
        setIsDrawerUp={setIsDrawerUp}
      />

      {isVoteDrawer && (
        <VoteDrawer
          date={date}
          location={locationValue}
          setIsModal={() => {
            setIsVoteDrawer(false);
            setIsDrawerUp(true);
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
        <StudyInFoDrawer date={date} detailInfo={detailInfo} setDetailInfo={setDetailInfo} />
      )}
    </>
  );
}

const getMarkersOptions = (
  studyVoteData: StudyDailyInfoProps,
  currentLocation: CoordinateProps,
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

  studyVoteData.participations
    .filter((par) => (myVote ? true : par.members.length >= 1))
    .forEach((par) => {
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

  if (myVote) return temp;

  const tempArr = [];
  const placeMap = new Map(); // fullname을 기준으로 그룹화할 Map 생성

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
        id: par._id,
        position: new naver.maps.LatLng(par.place.latitude, par.place.longitude),
        count: 1,
        status: par.status,
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
  location: ActiveLocation,
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

export const getDetailInfo = (
  studyVoteData: StudyDailyInfoProps,
  id: string,
  location: ActiveLocation,
  myUid,
) => {
  const participation = studyVoteData.participations?.find((par) => par.place._id === id);
  const realTimeStudy = getRealTimeFilteredById(studyVoteData.realTime, id);

  const findStudy = participation || realTimeStudy;

  const sortedCommentUserArr = [...findStudy.members]?.sort((a, b) => {
    const aTime = dayjs(a?.updatedAt);
    const bTime = dayjs(b?.updatedAt);
    if (aTime.isBefore(bTime)) return -1;
    else if (aTime.isAfter(bTime)) return 1;
    return 0;
  });

  const commentUser = sortedCommentUserArr?.[0]?.user;
  const findMyInfo = findStudy?.members?.find((who) => who.user.uid);

  return {
    isPrivate: !!realTimeStudy,
    place: findStudy?.place,
    title: participation?.place.fullname || (realTimeStudy?.place as PlaceInfoProps)?.name,
    id,
    time: getStudyTime(findStudy?.members) || {
      //수정 필요
      start: dayjsToFormat(dayjs(), "HH:mm"),
      end: dayjsToFormat(dayjs(), "HH:mm"),
    },
    participantCnt: findStudy?.members?.length,
    image: participation
      ? participation.place.image
      : STUDY_MAIN_IMAGES[getRandomIdx(STUDY_MAIN_IMAGES.length)],
    status: findStudy.status,
    location: location,
    comment: {
      user: {
        uid: commentUser.uid,
        avatar: commentUser.avatar,
        image: commentUser.profileImage,
      },
      text:
        sortedCommentUserArr?.[0]?.comment?.text ||
        STUDY_COMMENT_ARR[getRandomIdx(STUDY_COMMENT_ARR.length - 1)],
    },
    firstUserUid: findStudy?.members?.[0]?.user?.uid,
    memberStatus:
      !findMyInfo || !findStudy?.members.some((who) => who.user.uid === myUid)
        ? "notParticipation"
        : findMyInfo?.attendanceInfo?.arrived
          ? "attendance"
          : ("participation" as "notParticipation" | "attendance" | "participation"),
  };
};
