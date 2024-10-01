import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import Header from "../../components/layouts/Header";
import ButtonGroups, { ButtonOptionsProps } from "../../components/molecules/groups/ButtonGroups";
import TabNav, { ITabNavOptions } from "../../components/molecules/navs/TabNav";
import VoteMap from "../../components/organisms/VoteMap";
import { useStudyVoteQuery } from "../../hooks/study/queries";
import { useUserInfoQuery } from "../../hooks/user/queries";
import { getStudyVoteIcon } from "../../libs/study/getStudyVoteIcon";
import { getLocationCenterDot } from "../../libs/study/getStudyVoteMap";
import RealStudyBottomNav from "../../pageTemplates/vote/RealStudyBottomNav";
import VotePreComponent from "../../pageTemplates/vote/VotePreComponent";
import { IMapOptions, IMarkerOptions } from "../../types/externals/naverMapTypes";
import { IPlace } from "../../types/models/studyTypes/studyDetails";
import { IStudyVoteWithPlace } from "../../types/models/studyTypes/studyInterActions";
import { LocationEn } from "../../types/services/locationTypes";
import { convertLocationLangTo } from "../../utils/convertUtils/convertDatas";
import { dayjsToFormat } from "../../utils/dateTimeUtils";

type StudyCategoryTab = "실시간 스터디" | "내일 스터디";

export default function StudyVoteMap() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const date = searchParams.get("date");

  const locationParamKr = convertLocationLangTo(searchParams.get("location") as LocationEn, "kr");

  const [mapOptions, setMapOptions] = useState<IMapOptions>();
  const [markersOptions, setMarkersOptions] = useState<IMarkerOptions[]>();
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lon: number }>();
  const [studyCategoryTab, setStudyCategoryTab] = useState<StudyCategoryTab>("실시간 스터디");
  const [locationFilterType, setLocationFilterType] = useState<
    "현재 위치" | "주 활동 장소" | string
  >("현재 위치");
  const [myVoteInfo, setMyVoteInfo] = useState<IStudyVoteWithPlace>();
  const [isLocationRefetch, setIsLocationRefetch] = useState(false);
  const [isAttendModal, setIsAttendModal] = useState(false);
  const [isDrawerFixed, setIsDrawerDown] = useState(true);
  const [resizeToggle, setResizeToggle] = useState(false);

  const { data: userInfo } = useUserInfoQuery();
  const { data: studyVoteOne } = useStudyVoteQuery(date, locationParamKr, false, false, {
    enabled: !!locationParamKr && !!date,
  });

  const currentLocationDetail = userInfo?.locationDetail;
  const studyVoteData = studyVoteOne?.[0]?.participations;

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setCurrentLocation({ lat, lon });
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
    setResizeToggle((old) => !old);
  }, [isDrawerFixed, studyCategoryTab]);

  useEffect(() => {
    if (currentLocation) {
      setMapOptions(getMapOptions(currentLocation));
      setMarkersOptions(getMarkersOptions(currentLocation));
    }
  }, [currentLocation]);

  const tabOptionsArr: ITabNavOptions[] = [
    {
      text: "실시간 스터디",
      func: () => {
        setStudyCategoryTab("실시간 스터디");
      },
      flex: 1,
    },
    {
      text: "내일 스터디",
      func: () => {
        setStudyCategoryTab("내일 스터디");
      },
      flex: 1,
    },
  ];

  const realButtonOptionsArr: ButtonOptionsProps[] = [
    {
      text: "현재 위치",
      func: () => {
        setLocationFilterType("현재 위치");
      },
    },
    {
      text: `주 활동 장소`,
      func: () => {
        setLocationFilterType("주 활동 장소");
        setCurrentLocation({ lat: currentLocationDetail?.lat, lon: currentLocationDetail?.lon });
      },
    },
    {
      text: `${locationParamKr} 지역`,
      icon: <i className="fa-solid fa-retweet" />,
      func: () => {
        setLocationFilterType(`${locationParamKr} 지역`);
        setCurrentLocation(getLocationCenterDot()[locationParamKr]);
      },
    },
  ];

  const voteButtonOptionsArr: ButtonOptionsProps[] = [
    {
      text: dayjsToFormat(dayjs(date), "M월 D일(ddd) 스터디"),
      icon: <i className="fa-solid fa-retweet" />,
      func: () => {
        setLocationFilterType("현재 위치");
      },
    },
    {
      text: `${locationParamKr} 지역`,
      icon: <i className="fa-solid fa-retweet" />,
      func: () => {
        setLocationFilterType(`${locationParamKr} 지역`);
        setCurrentLocation(getLocationCenterDot()[locationParamKr]);
      },
    },
  ];

  const handleMarker = (id) => {
    const myPlace = studyVoteData?.find((par) => par.place._id === id).place;
    setMyVoteInfo((old) => setVotePlaceInfo(myPlace, old));
  };

  return (
    <>
      <Header title="스터디 투표" />
      <TabNav selected={studyCategoryTab} tabOptionsArr={tabOptionsArr} isMain isThick />
      <Box
        position="relative"
        height={
          studyCategoryTab === "실시간 스터디" || !isDrawerFixed
            ? "calc(100dvh - 97px)"
            : "calc(100dvh - 412px)"
        }
      >
        <Box w="100%" py={3} px={4} position="absolute" top="0" left="0" zIndex={500}>
          <ButtonGroups
            buttonOptionsArr={
              studyCategoryTab === "실시간 스터디" ? realButtonOptionsArr : voteButtonOptionsArr
            }
            size="sm"
            isEllipse
            currentValue={studyCategoryTab === "실시간 스터디" && locationFilterType}
          />
        </Box>
        <VoteMap
          mapOptions={mapOptions}
          markersOptions={markersOptions}
          handleMarker={handleMarker}
          resizeToggle={resizeToggle}
        />
      </Box>
      {studyCategoryTab === "실시간 스터디" ? (
        <RealStudyBottomNav refetchCurrentLocation={() => setIsLocationRefetch(true)} />
      ) : (
        <VotePreComponent
          setMarkersOptions={setMarkersOptions}
          refetchCurrentLocation={() => setIsLocationRefetch(true)}
          myVoteInfo={myVoteInfo}
          studyVoteData={studyVoteData}
          setMyVoteInfo={setMyVoteInfo}
          setIsDrawerDown={setIsDrawerDown}
        />
      )}
    </>
  );
}

//지도에서 마커를 통한 핸들링
const setVotePlaceInfo = (myPlace: IPlace, voteInfo?: IStudyVoteWithPlace): IStudyVoteWithPlace => {
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

const getMarkersOptions = ({
  lat,
  lon,
}: {
  lat: number;
  lon: number;
}): IMarkerOptions[] | undefined => {
  if (typeof naver === "undefined") return;
  return [1, 2, 3].map((item) => {
    return {
      // id: par.place._id,
      position: new naver.maps.LatLng(lat, lon),
      title: "테스트트",
      icon: {
        content: getStudyVoteIcon("default", "내 위치"),
        size: new naver.maps.Size(72, 72),
        anchor: new naver.maps.Point(36, 44),
      },
    };
  });
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
