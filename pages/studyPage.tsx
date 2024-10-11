import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { STUDY_MAIN_IMAGES } from "../assets/images/studyMain";

import BottomFlexDrawer, {
  DRAWER_MIN_HEIGHT,
} from "../components/organisms/drawer/BottomFlexDrawer";
import VoteMap from "../components/organisms/VoteMap";
import { USER_LOCATION } from "../constants/keys/localStorage";
import { STUDY_COMMENT_ARR } from "../constants/settingValue/comment";
import { useToast } from "../hooks/custom/CustomToast";
import { useDeleteMyVoteMutation } from "../hooks/study/mutations";
import { useStudyVoteQuery } from "../hooks/study/queries";
import { useUserInfoQuery } from "../hooks/user/queries";
import {
  getMyStudyInfo,
  getMyStudyParticipation,
  getRealTimeFilteredById,
} from "../libs/study/getMyStudyMethods";
import { getStudyTime } from "../libs/study/getStudyTime";
import { getCurrentLocationIcon, getStudyIcon } from "../libs/study/getStudyVoteIcon";
import StudyInFoDrawer, { StudyInfoProps } from "../pageTemplates/studyPage/StudyInfoDrawer";
import StudyMapTopNav from "../pageTemplates/studyPage/StudyMapTopNav";
import StudyControlButton from "../pageTemplates/vote/StudyControlButton";
import { myStudyParticipationState } from "../recoils/studyRecoils";

import { IMapOptions, IMarkerOptions } from "../types/externals/naverMapTypes";
import { StudyDailyInfoProps, StudyPlaceProps } from "../types/models/studyTypes/studyDetails";
import { IStudyVoteWithPlace } from "../types/models/studyTypes/studyInterActions";
import { PlaceInfoProps } from "../types/models/utilTypes";
import { ActiveLocation, LocationEn } from "../types/services/locationTypes";
import { convertLocationLangTo } from "../utils/convertUtils/convertDatas";
import { dayjsToFormat, dayjsToStr } from "../utils/dateTimeUtils";
import { getRandomIdx } from "../utils/mathUtils";
import { iPhoneNotchSize } from "../utils/validationUtils";

type StudyCategoryTab = "실시간 스터디" | "내일의 스터디";

export default function StudyVoteMap() {
  const { data: session } = useSession();
  const toast = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);
  const dateParam = searchParams.get("date");
  const categoryParam = searchParams.get("category") as "currentPlace" | "mainPlace" | "votePlace";
  // const latParam = searchParams.get("lat");
  // const lonParam = searchParams.get("lon");

  const locationParamKr = convertLocationLangTo(
    searchParams.get("location") as LocationEn,
    "kr",
  ) as ActiveLocation;

  const [mapOptions, setMapOptions] = useState<IMapOptions>();
  const [markersOptions, setMarkersOptions] = useState<IMarkerOptions[]>();
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lon: number }>();
  const [centerLocation, setCenterLocation] = useState<{ lat: number; lon: number }>();

  const [locationFilterType, setLocationFilterType] = useState();

  const [myVoteInfo, setMyVoteInfo] = useState<IStudyVoteWithPlace>();
  const [isLocationRefetch, setIsLocationRefetch] = useState(false);

  const [resizeToggle, setResizeToggle] = useState(false);
  const [date, setDate] = useState(dateParam || dayjsToStr(dayjs()));
  const [locationValue, setLocationValue] = useState<ActiveLocation>(locationParamKr);
  const [detailInfo, setDetailInfo] = useState<StudyInfoProps>();

  const [myStudyParticipation, setMyStudyParticipation] = useRecoilState(myStudyParticipationState);

  const myStudyInfo = getMyStudyInfo(myStudyParticipation, session?.user.uid);

  const { data: userInfo } = useUserInfoQuery();
  const userLocation =
    (localStorage.getItem(USER_LOCATION) as ActiveLocation) || session?.user.location;

  const { data: studyVoteData } = useStudyVoteQuery(date, userLocation, {
    enabled: !!userLocation && !!date,
  });
  console.log(54, studyVoteData, date, userLocation);

  const mainLocation = userInfo?.locationDetail;

  useEffect(() => {
    if (!locationParamKr) {
      newSearchParams.set("location", convertLocationLangTo(userLocation, "en"));
    }
    if (!dateParam) {
      newSearchParams.set("date", date);
    }
    router.replace(`/studyPage?${newSearchParams.toString()}`);
    // if (!locationValue) setLocationValue(locationParamKr);
    // if (!date) setDate(dateParam);
  }, [locationParamKr, dateParam]);

  // useEffect(() => {
  //   switch (categoryParam) {
  //     case "currentPlace":
  //       setLocationFilterType("현재 위치");
  //       setIsLocationRefetch(true);

  //       break;
  //     case "mainPlace":
  //       setLocationFilterType("주 활동 장소");
  //       setCenterLocation({ lat: mainLocation?.lat, lon: mainLocation?.lon });

  //       break;
  //     case "votePlace":
  //       setLocationFilterType("내 투표 장소");
  //       setCenterToVotePlace(myStudy, myRealStudy);
  //       break;
  //   }
  // }, [categoryParam]);

  useEffect(() => {
    newSearchParams.set("location", convertLocationLangTo(locationValue, "en"));
    newSearchParams.set("date", date);
    router.replace(`/studyPage?${newSearchParams.toString()}`);
  }, [locationValue, date]);

  useEffect(() => {
    if (!studyVoteData || !session?.user) return;
    const myStudyParticipation = getMyStudyParticipation(studyVoteData, session.user.uid);
    setMyStudyParticipation(myStudyParticipation);
    if (locationFilterType === "내 투표 장소") {
      setCenterLocation({
        lat: myStudyParticipation.place.latitude,
        lon: myStudyParticipation.place.longitude,
      });
    }
  }, [studyVoteData, session?.user.uid]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setCurrentLocation({ lat, lon });
        if (isLocationRefetch || categoryParam !== "votePlace") setCenterLocation({ lat, lon });
        setIsLocationRefetch(false);
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
    if (centerLocation) {
      setMapOptions(getMapOptions(centerLocation));
    } else if (centerLocation === null && mainLocation) {
      setMapOptions(getMapOptions({ lat: mainLocation.lat, lon: mainLocation.lon }));
    }
    if (studyVoteData && currentLocation) {
      setMarkersOptions(getMarkersOptions(studyVoteData, currentLocation));
    }
  }, [currentLocation, centerLocation, mainLocation, studyVoteData]);

  const dateArr = Array(10)
    .fill(0)
    .map((_, idx) => dayjsToStr(dayjs().add(idx, "day")));

  const handleMarker = (id: string) => {
    if (!id || !studyVoteData) return;
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
    console.log(52, sortedCommentUserArr);
    const commentUser = sortedCommentUserArr?.[0]?.user;

    setDetailInfo({
      isPrivate: !!findStudy,
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
      comment: {
        user: {
          uid: commentUser.uid,
          avatar: commentUser.avatar,
          userImage: commentUser.profileImage,
        },
        text:
          sortedCommentUserArr?.[0]?.comment ||
          STUDY_COMMENT_ARR[getRandomIdx(STUDY_COMMENT_ARR.length - 1)],
      },
      isMember: findStudy?.members?.some((who) => who.user.uid === userInfo.uid),
    });
  };
  const { mutate } = useDeleteMyVoteMutation(dayjs());
  return (
    <>
      <Box
        position="relative"
        height={`calc(100dvh - var(--bottom-nav-height) - ${DRAWER_MIN_HEIGHT + iPhoneNotchSize()}px)`}
      >
        <StudyMapTopNav />
        <VoteMap
          mapOptions={mapOptions}
          markersOptions={markersOptions}
          handleMarker={handleMarker}
          resizeToggle={resizeToggle}
        />
      </Box>
      <StudyControlButton isAleadyAttend={!!myStudyInfo?.attendanceInfo.arrived} />

      {detailInfo && <StudyInFoDrawer detailInfo={detailInfo} setDetailInfo={setDetailInfo} />}
      <BottomFlexDrawer isOverlay={false} />
    </>
  );
}

//지도에서 마커를 통한 핸들링
const setVotePlaceInfo = (
  myPlace: StudyPlaceProps,
  voteInfo?: IStudyVoteWithPlace,
): IStudyVoteWithPlace => {
  const id = myPlace?._id;

  if (!voteInfo?.place) return { ...voteInfo, place: myPlace };
  else if (voteInfo.place._id === id) {
    return { ...voteInfo, place: undefined, subPlace: undefined };
  } else if (voteInfo?.subPlace?.map((place) => place._id).includes(id)) {
    return {
      ...voteInfo,
      subPlace: voteInfo.subPlace.filter((place) => place._id !== id),
    };
  } else
    return {
      ...voteInfo,
      subPlace: [...(voteInfo?.subPlace || []), myPlace],
    };
};

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

const getMapOptions = (currentLocation: { lat: number; lon: number }): IMapOptions | undefined => {
  if (typeof naver === "undefined") return undefined;
  return {
    center: new naver.maps.LatLng(currentLocation.lat, currentLocation.lon),
    zoom: 14,
    minZoom: 11,
    mapTypeControl: false,
    scaleControl: false,
    logoControl: false,
    mapDataControl: false,
  };
};
