import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import { STUDY_MAIN_IMAGES } from "../assets/images/studyMain";
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
import { getLocationByCoordinates } from "../libs/study/getLocationByCoordinates";
import {
  getMyStudyInfo,
  getMyStudyParticipation,
  getRealTimeFilteredById,
} from "../libs/study/getMyStudyMethods";
import { getStudyTime } from "../libs/study/getStudyTime";
import { getCurrentLocationIcon, getStudyIcon } from "../libs/study/getStudyVoteIcon";
import StudyInFoDrawer, { StudyInfoProps } from "../pageTemplates/studyPage/StudyInfoDrawer";
import StudyMapTopNav from "../pageTemplates/studyPage/StudyMapTopNav";
import StudyPageDrawer from "../pageTemplates/studyPage/StudyPageDrawer";
import StudyControlButton from "../pageTemplates/vote/StudyControlButton";
import { myStudyParticipationState } from "../recoils/studyRecoils";
import { IMapOptions, IMarkerOptions } from "../types/externals/naverMapTypes";
import { StudyDailyInfoProps } from "../types/models/studyTypes/studyDetails";
import { IStudyVoteWithPlace } from "../types/models/studyTypes/studyInterActions";
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
  const categoryParam = searchParams.get("category") as
    | "currentPlace"
    | "mainPlace"
    | "votePlace"
    | "voting";

  const locationParamKr = convertLocationLangTo(
    searchParams.get("location") as LocationEn,
    "kr",
  ) as ActiveLocation;
  const userLocation =
    (localStorage.getItem(USER_LOCATION) as ActiveLocation) || session?.user.location;

  const [mapOptions, setMapOptions] = useState<IMapOptions>();
  const [markersOptions, setMarkersOptions] = useState<IMarkerOptions[]>();
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lon: number }>();
  const [centerLocation, setCenterLocation] = useState<{ lat: number; lon: number }>();

  const [locationFilterType, setLocationFilterType] = useState<
    "현재 위치" | "활동 장소" | "스터디 장소"
  >("현재 위치");

  const [myVoteInfo, setMyVoteInfo] = useState<IStudyVoteWithPlace>();
  const [isLocationRefetch, setIsLocationRefetch] = useState(false);
  const [resizeToggle, setResizeToggle] = useState<boolean>(null);
  const [date, setDate] = useState(dateParam || dayjsToStr(dayjs()));
  const [locationValue, setLocationValue] = useState<ActiveLocation>(
    locationParamKr || userLocation,
  );
  const [myVote, setMyVote] = useState<{ main: string; sub: string[] }>({ main: null, sub: [] });

  const [detailInfo, setDetailInfo] = useState<StudyInfoProps>();

  const [myStudyParticipation, setMyStudyParticipation] = useRecoilState(myStudyParticipationState);

  const myStudyInfo = getMyStudyInfo(myStudyParticipation, session?.user.uid);

  const { data: userInfo } = useUserInfoQuery();

  const { data: studyVoteData } = useStudyVoteQuery(date, locationValue, {
    enabled: !!locationValue && !!date,
  });
 
  const mainLocation = userInfo?.locationDetail;

  useEffect(() => {
    if (locationParamKr && dateParam) return;
    if (!locationParamKr) {
      newSearchParams.set("location", convertLocationLangTo(locationValue, "en"));
    }
    if (!dateParam) {
      newSearchParams.set("date", date);
    }
    router.replace(`/studyPage?${newSearchParams.toString()}`);
  }, [locationParamKr, dateParam]);

  useEffect(() => {
    if (!locationValue) return;

    const locationCenter = LOCATION_CENTER_DOT[locationValue];

    setCenterLocation({ lat: locationCenter.latitude, lon: locationCenter.longitude });
    newSearchParams.set("location", convertLocationLangTo(locationValue, "en"));
    newSearchParams.set("date", date);
    router.replace(`/studyPage?${newSearchParams.toString()}`);
  }, [locationValue, date]);

  useEffect(() => {
    switch (categoryParam) {
      case "currentPlace":
        setLocationFilterType("현재 위치");

        break;
      case "mainPlace":
        const changeLocation = getLocationByCoordinates(mainLocation?.lat, mainLocation?.lon);

        if (!changeLocation) {
          toast("warning", "활성화 된 지역이 아닙니다.");
          newSearchParams.set("category", "currentPlace");
          router.replace(`/studyPage?${newSearchParams.toString()}`);
          return;
        } else if (changeLocation !== locationValue) {
          setLocationValue(changeLocation as ActiveLocation);
        }
        setLocationFilterType("활동 장소");
        setCenterLocation({ lat: mainLocation?.lat, lon: mainLocation?.lon });

        break;
      case "votePlace":
        setLocationFilterType("스터디 장소");

        setCenterLocation({
          lat: myStudyParticipation?.place.latitude,
          lon: myStudyParticipation?.place.longitude,
        });

        break;
    }
    if (categoryParam && categoryParam !== "currentPlace") {
      newSearchParams.set("drawer", "down");
      router.replace(`/studyPage?${newSearchParams.toString()}`);
    }
  }, [categoryParam]);

  useEffect(() => {
    if (!studyVoteData || !session?.user) return;
    const findMyStudyParticipation = getMyStudyParticipation(studyVoteData, session.user.uid);
    setMyStudyParticipation(findMyStudyParticipation);

    if (locationFilterType === "스터디 장소" && findMyStudyParticipation) {
      setCenterLocation({
        lat: findMyStudyParticipation.place.latitude,
        lon: findMyStudyParticipation.place.longitude,
      });
    }
  }, [studyVoteData, session?.user.uid]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        setCurrentLocation({ lat, lon });
        setIsLocationRefetch(false);
        if (!isLocationRefetch) return;
        if (categoryParam !== "votePlace") {
          const changeLocation = getLocationByCoordinates(lat, lon);
          if (!changeLocation) {
            if (isLocationRefetch && categoryParam !== "voting") {
              toast("warning", "활성화 된 지역에 있지 않습니다.");
            }
            setIsLocationRefetch(false);

            return;
          } else if (changeLocation !== locationValue) {
            setLocationValue(changeLocation as ActiveLocation);
          }
          setCenterLocation({ lat, lon });
        }
      },
      function (error) {
        console.error("위치 정보를 가져오는 데 실패했습니다: ", error);
      },
      {
        enableHighAccuracy: true, // 고정밀도 모드 활성화
        timeout: 5000, // 5초 안에 위치를 가져오지 못하면 오류 발생
        maximumAge: 0, // 캐시된 위치 정보를 사용하지 않음
      },
    );
    setIsLocationRefetch(false);
  }, [isLocationRefetch]);

  useEffect(() => {
    if (categoryParam === "voting") return;
    if (centerLocation) {
      setMapOptions(getMapOptions(centerLocation, locationValue));
    } else if (centerLocation === null && mainLocation) {
      setMapOptions(getMapOptions({ lat: mainLocation.lat, lon: mainLocation.lon }, locationValue));
    }
    if (studyVoteData && currentLocation) {
      setMarkersOptions(getMarkersOptions(studyVoteData, currentLocation));
    }
  }, [currentLocation, centerLocation, mainLocation, studyVoteData, locationValue]);

 
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
  

    const participation = studyVoteData.participations?.find((par) => par.place._id === id);
    const realTimeStudy = getRealTimeFilteredById(studyVoteData.realTime, id);
    // const findStudy = parti
    const findStudy = participation || realTimeStudy;

    // const myStudy =
    //   findStudy?.members?.some((who) => who.user.uid === userInfo?.uid) ||
    //   realStudyAttendance?.some((who) => who.user.uid === userInfo?.uid);

    const sortedCommentUserArr = [...findStudy.members]?.sort((a, b) => {
      const aTime = dayjs(a?.updatedAt);
      const bTime = dayjs(b?.updatedAt);
      if (aTime.isBefore(bTime)) return -1;
      else if (aTime.isAfter(bTime)) return 1;
      return 0;
    });

    const commentUser = sortedCommentUserArr?.[0]?.user;
    const findMyInfo = findStudy?.members?.find((who) => who.user.uid);

    setDetailInfo({
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
      location: locationValue,
      comment: {
        user: {
          uid: commentUser.uid,
          avatar: commentUser.avatar,
          userImage: commentUser.profileImage,
        },
        text:
          sortedCommentUserArr?.[0]?.comment?.text ||
          STUDY_COMMENT_ARR[getRandomIdx(STUDY_COMMENT_ARR.length - 1)],
      },
      memberStatus:
        !findMyInfo || !findStudy?.members.some((who) => who.user.uid === userInfo.uid)
          ? "notParticipation"
          : findMyInfo?.attendanceInfo?.arrived
            ? "attendance"
            : "participation",
    });
  };

  return (
    <>
      <Box
        position="relative"
        height={
          !resizeToggle
            ? `calc(100dvh - var(--bottom-nav-height) - ${DRAWER_MIN_HEIGHT + iPhoneNotchSize()}px)`
            : `calc(100vh - 468px - ${iPhoneNotchSize()}px)`
        }
        maxH="100dvh"
      >
        {categoryParam !== "voting" && (
          <StudyMapTopNav
            location={locationValue}
            setLocation={setLocationValue}
            hasMainLocation={!!mainLocation}
            setIsLocationFetch={setIsLocationRefetch}
          />
        )}
        <VoteMap
          mapOptions={mapOptions}
          markersOptions={markersOptions}
          handleMarker={handleMarker}
          resizeToggle={resizeToggle}
        />
      </Box>
      <StudyControlButton
        studyVoteData={studyVoteData}
        location={locationValue}
        isAleadyAttend={!!myStudyInfo?.attendanceInfo.arrived}
        setMarkersOptions={setMarkersOptions}
        setResizeToggle={setResizeToggle}
        setIsLocationRefetch={setIsLocationRefetch}
        setCenterLocation={setCenterLocation}
        setMapOptions={() => setMapOptions(getMapOptions(currentLocation, locationValue, 14))}
        date={date}
        myVote={myVote}
        setMyVote={setMyVote}
      />

      {detailInfo && <StudyInFoDrawer detailInfo={detailInfo} setDetailInfo={setDetailInfo} />}

      <StudyPageDrawer
        studyVoteData={studyVoteData}
        location={locationValue}
        date={date}
        setDate={setDate}
      />
    </>
  );
}

const getMarkersOptions = (
  studyVoteData: StudyDailyInfoProps,
  {
    lat,
    lon,
  }: {
    lat: number;
    lon: number;
  },
): IMarkerOptions[] | undefined => {
  if (typeof naver === "undefined" || !studyVoteData) return;
  const temp = [];

  temp.push({
    position: new naver.maps.LatLng(lat, lon),
    icon: {
      content: getCurrentLocationIcon(),
      size: new naver.maps.Size(72, 72),
      anchor: new naver.maps.Point(36, 44),
    },
  });

  studyVoteData.participations
    .filter((par) => par.members.length >= 1)
    .forEach((par) => {
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
        count: 1, // 처음에는 1로 설정
      });
    }
  });
  // 그룹화된 결과를 temp에 추가
  placeMap.forEach((value, fullname) => {
    temp.push({
      id: value.id,
      position: value.position,
      icon: {
        content: value.count === 1 ? getStudyIcon("active") : getStudyIcon(null, value.count), // count에 따라 content 값 설정
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
