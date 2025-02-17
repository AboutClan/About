import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";

import { STUDY_MAIN_IMAGES } from "../assets/images/studyMain";
import IconRowBlock from "../components/atoms/blocks/IconRowBlock";
import { MainLoadingAbsolute } from "../components/atoms/loaders/MainLoading";
import RuleIcon from "../components/Icons/RuleIcon";
import Header from "../components/layouts/Header";
import Slide from "../components/layouts/PageSlide";
import InfoBoxCol from "../components/molecules/InfoBoxCol";
import VoteMap from "../components/organisms/VoteMap";
import { USER_LOCATION } from "../constants/keys/localStorage";
import {
  LOCATION_CENTER_DOT,
  LOCATION_MAX_BOUNDARY,
} from "../constants/serviceConstants/studyConstants/studyVoteMapConstants";
import { STUDY_COMMENT_ARR } from "../constants/settingValue/comment";
import { useToast, useTypeToast } from "../hooks/custom/CustomToast";
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
import StudyPresetModal from "../modals/userRequest/StudyPresetModal";
import StudyMapTopNav from "../pageTemplates/studyPage/StudyMapTopNav";
import StudyPageDrawer from "../pageTemplates/studyPage/StudyPageDrawer";
import StudyControlButton from "../pageTemplates/vote/StudyControlButton";
import { myStudyParticipationState } from "../recoils/studyRecoils";
import { CoordinateProps, VotePlacesProps } from "../types/common";
import { IMapOptions, IMarkerOptions } from "../types/externals/naverMapTypes";
import {
  StudyDailyInfoProps,
  StudyPlaceProps,
  StudyStatus,
} from "../types/models/studyTypes/studyDetails";
import { PlaceInfoProps } from "../types/models/utilTypes";
import { ActiveLocation, Location, LocationEn } from "../types/services/locationTypes";
import { convertLocationLangTo } from "../utils/convertUtils/convertDatas";
import { dayjsToFormat } from "../utils/dateTimeUtils";
import { getRandomIdx } from "../utils/mathUtils";

export default function StudyPage() {
  const { data: session } = useSession();
  const toast = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);
  const typeToast = useTypeToast();
  const dateParam = searchParams.get("date");

  const locationParamKr = convertLocationLangTo(
    searchParams.get("location") as LocationEn,
    "kr",
  ) as ActiveLocation;

  const userLocation =
    (localStorage.getItem(USER_LOCATION) as Location | "기타") || session?.user.location;

  const [date, setDate] = useState(dateParam || getStudyViewDate(dayjs()));
  const [locationValue, setLocationValue] = useState<Location>(
    locationParamKr || userLocation === "기타" ? "강남" : userLocation,
  );
  const [mapOptions, setMapOptions] = useState<IMapOptions>();
  const [markersOptions, setMarkersOptions] = useState<IMarkerOptions[]>();

  const [currentLocation, setCurrentLocation] = useState<CoordinateProps>();
  const [centerLocation, setCenterLocation] = useState<CoordinateProps>();

  const [isLocationRefetch, setIsLocationRefetch] = useState(true);

  const [modalType, setModalType] = useState<"preset">();

  const [myVote, setMyVote] = useState<VotePlacesProps>({ main: null, sub: [] });
  //이후 제거
  console.log(setMyVote);

  const [myStudyParticipation, setMyStudyParticipation] = useRecoilState(myStudyParticipationState);

  const { data: userInfo } = useUserInfoQuery();
  const { data: studyVoteData, isLoading } = useStudyVoteQuery(date, locationValue, {
    enabled: !!locationValue && !!date,
  });

  useEffect(() => {
    toast("info", "리뉴얼이 진행중인 페이지입니다. 3월 1일부터 이용 가능");
  }, []);

  useEffect(() => {
    if (!locationValue) return;

    newSearchParams.set("location", `${convertLocationLangTo(locationValue, "en")}`);
    newSearchParams.set("date", `${getStudyViewDate(dayjs(date))}`);

    router.replace(`/studyPage?${newSearchParams.toString()}`);

    // setCenterLocation();
  }, [myStudyParticipation]);

  useEffect(() => {
    newSearchParams.set("location", convertLocationLangTo(locationValue, "en"));
    router.replace(`/studyPage?${newSearchParams.toString()}`, { scroll: false });
  }, [locationValue]);

  useEffect(() => {
    if (!studyVoteData || !session?.user.uid) return;
    let isChangeLocation = false;

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
      } else if (changeLocation !== locationValue) {
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

    if (!isChangeLocation) {
      setMarkersOptions(getMarkersOptions(studyVoteData, currentLocation, null, null));
    }
  }, [studyVoteData, session?.user.uid, currentLocation, myVote]);

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

    setMapOptions(getMapOptions(centerLocation, locationValue, 13));
  }, [centerLocation, locationValue]);

  // const accumulationHour =
  //   userInfo &&
  //   `${Math.ceil(userInfo.weekStudyAccumulationMinutes / 60)}시간 ${
  //     userInfo.weekStudyAccumulationMinutes % 60
  //   }분`;

  return (
    <>
      <Header title="스터디" isBack={false}>
        <RuleIcon
          setIsModal={() => {
            typeToast("not-yet");
          }}
        />
      </Header>
      <Slide>
        <Flex direction="column" mt={5} mb={3}>
          <Box color="gray.500" fontSize="12px" mb={1}>
            동네 친구와 함께하는 카공 스터디
          </Box>
          <Box fontWeight="bold" fontSize="20px" lineHeight="32px">
            공부도 하고, 혜택도 받고!
            <br />
            가까운 친구들과 함께, 혼자서도 OK!
          </Box>
        </Flex>
        <Box
          position="relative"
          height={180}
          borderRadius="16px"
          overflow="hidden"
          border="1px solid black"
          borderColor="gray.200"
          bg="gray.100"
          onClick={() => router.push("/studyPageMap")}
        >
          <StudyMapTopNav
            location={locationValue}
            setLocation={(location) => {
              newSearchParams.set("center", "locationPlace");
              newSearchParams.set(
                "location",
                convertLocationLangTo(location as ActiveLocation, "en"),
              );

              setLocationValue(location);
              router.replace(`/studyPage?${newSearchParams.toString()}`);
            }}
            setCenterLocation={setCenterLocation}
            setIsLocationFetch={setIsLocationRefetch}
            isSmall
          />

          <VoteMap mapOptions={mapOptions} markersOptions={markersOptions} />
          {isLoading && <MainLoadingAbsolute />}
        </Box>
        <StudyPageDrawer
          studyVoteData={studyVoteData}
          location={locationValue}
          setLocation={setLocationValue}
          date={date}
          setDate={setDate}
          currentLocation={currentLocation}
        />

        <Box p={4} pb={3} borderRadius="12px" border="var(--border)" borderColor="gray.200">
          <Box mb={3} fontSize="14px" fontWeight="bold" lineHeight="20px" py={1}>
            내 스터디 설정
          </Box>
          <InfoBoxCol
            infoBoxPropsArr={[
              { category: "중심 활동지", text: userInfo?.locationDetail?.text },
              { category: "즐겨 찾기 장소", text: userInfo?.studyPreference?.place || "미등록" },
              { category: "서브 추천 장소", text: userInfo?.studyPreference?.place || "미등록" },
            ]}
            size="md"
          />
          <Flex
            justify="center"
            align="center"
            fontSize="12px"
            fontWeight="semibold"
            mt={4}
            borderRadius="12px"
            bg="gray.800"
            color="white"
            h="44px"
            onClick={() => setModalType("preset")}
          >
            설정하기
          </Flex>
        </Box>
        <Box my={5} p={4} pb={3} borderRadius="12px" border="var(--border)" borderColor="gray.200">
          <Box mb={3} fontSize="14px" fontWeight="bold" lineHeight="20px" py={1}>
            내 스터디 참여 기록
          </Box>
          <InfoBoxCol
            infoBoxPropsArr={[
              { category: "이번 달 참여 횟수", text: "6회" },
              { category: "누적 참여 시간", text: "16시간 20분" },
              { category: "최근 만난 인원", rightChildren: <></> },
            ]}
            size="md"
          />
        </Box>

        <IconRowBlock
          leftIcon={
            <i
              className="fa-duotone fa-magnifying-glass-plus fa-2x"
              style={{ color: "var(--color-mint)" }}
            />
          }
          func={() => router.push("/study/writing/place")}
          mainText="신규 스터디 장소 추가"
          subText="공부하기 좋은 카공 스팟을 함께 공유해요!"
        />
      </Slide>
      <Box mb={20} mt={5}>
        <StudyControlButton date={date} setIsVoteDrawer={null} isVoting={null} />
      </Box>
      {modalType === "preset" && <StudyPresetModal setIsModal={() => setModalType(null)} />}
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

export const getDetailInfo = (
  studyVoteData: StudyDailyInfoProps,
  id: string,
  location: Location,
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
  const findMyInfo = findStudy?.members?.find((who) => who.user.uid === myUid);

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
    firstUserUid: findStudy?.members?.[0]?.user?.uid,
    memberStatus:
      !findMyInfo || !findStudy?.members.some((who) => who.user.uid === myUid)
        ? "notParticipation"
        : findMyInfo?.attendanceInfo?.arrived
        ? "attendance"
        : ("participation" as "notParticipation" | "attendance" | "participation"),
  };
};
