import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Avatar from "../../components/atoms/Avatar";
import CurrentLocationBtn from "../../components/atoms/CurrentLocationBtn";

import LocationSelector from "../../components/atoms/LocationSelector";
import Selector from "../../components/atoms/Selector";
import Header from "../../components/layouts/Header";
import ButtonGroups, { ButtonOptionsProps } from "../../components/molecules/groups/ButtonGroups";
import TabNav, { ITabNavOptions } from "../../components/molecules/navs/TabNav";
import NewTwoButtonRow from "../../components/molecules/NewTwoButtonRow";
import BottomDrawerLg from "../../components/organisms/drawer/BottomDrawerLg";
import VoteMap from "../../components/organisms/VoteMap";
import { LOCATION_OPEN } from "../../constants/location";
import { ABOUT_USER_SUMMARY } from "../../constants/serviceConstants/userConstants";
import { useStudyVoteQuery } from "../../hooks/study/queries";
import { useUserInfoQuery } from "../../hooks/user/queries";
import { getFirstComment, getStudyTime } from "../../libs/study/getStudyTime";
import { getCurrentLocationIcon, getStudyIcon } from "../../libs/study/getStudyVoteIcon";
import { getLocationCenterDot } from "../../libs/study/getStudyVoteMap";
import RealStudyBottomNav from "../../pageTemplates/vote/RealStudyBottomNav";
import VotePreComponent from "../../pageTemplates/vote/VotePreComponent";
import { IMapOptions, IMarkerOptions } from "../../types/externals/naverMapTypes";
import { IParticipation, IPlace } from "../../types/models/studyTypes/studyDetails";
import { IStudyVoteWithPlace } from "../../types/models/studyTypes/studyInterActions";
import { IAvatar } from "../../types/models/userTypes/userInfoTypes";
import { ActiveLocation, LocationEn } from "../../types/services/locationTypes";
import { convertLocationLangTo } from "../../utils/convertUtils/convertDatas";
import { dayjsToFormat, dayjsToStr } from "../../utils/dateTimeUtils";

type StudyCategoryTab = "실시간 스터디" | "내일의 스터디";

interface DetailInfoProps {
  id: string;
  title: string;
  time: { start: string; end: string };
  participantCnt: number;
  image: string;
  comment: {
    user: {
      userImage: string;
      uid: string;
      avatar: IAvatar;
    };
    text: string;
  };
}

export default function StudyVoteMap() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);
  const dateParam = searchParams.get("date");

  const locationParamKr = convertLocationLangTo(
    searchParams.get("location") as LocationEn,
    "kr",
  ) as ActiveLocation;

  const [mapOptions, setMapOptions] = useState<IMapOptions>();
  const [markersOptions, setMarkersOptions] = useState<IMarkerOptions[]>();
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lon: number }>();
  const [studyCategoryTab, setStudyCategoryTab] = useState<StudyCategoryTab>("실시간 스터디");
  const [locationFilterType, setLocationFilterType] = useState<"현재 위치" | "주 활동 장소">(
    "현재 위치",
  );
  const [myVoteInfo, setMyVoteInfo] = useState<IStudyVoteWithPlace>();
  const [isLocationRefetch, setIsLocationRefetch] = useState(false);
  const [isDrawerFixed, setIsDrawerDown] = useState(true);
  const [resizeToggle, setResizeToggle] = useState(false);
  const [dateValue, setDateValue] = useState(dateParam);
  const [locationValue, setLocationValue] = useState<ActiveLocation>(locationParamKr);
  const [detailInfo, setDetailInfo] = useState<DetailInfoProps>();

  const { data: userInfo } = useUserInfoQuery();
  const { data: studyVoteOne, isLoading } = useStudyVoteQuery(
    dateValue,
    locationValue,
    false,
    false,
    {
      enabled: !!locationValue && !!dateValue,
    },
  );

  const mainLocation = userInfo?.locationDetail;
  const studyVoteData = studyVoteOne?.[0]?.participations;

  useEffect(() => {
    if (!locationValue) setLocationValue(locationParamKr);
    if (!dateValue) setDateValue(dateParam);
  }, [locationParamKr, dateParam]);

  useEffect(() => {
    newSearchParams.set("location", convertLocationLangTo(locationValue, "en"));
    newSearchParams.set("date", dateValue);
    router.replace(`/vote?${newSearchParams.toString()}`);
    setCurrentLocation(getLocationCenterDot()[locationValue]);
  }, [locationValue, dateValue]);

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
    if (studyCategoryTab === "실시간 스터디" && currentLocation) {
      setMapOptions(getMapOptions(currentLocation));
    } else if (mainLocation) {
      setMapOptions(getMapOptions({ lat: mainLocation.lat, lon: mainLocation.lon }));
    }
    if (studyVoteData && currentLocation) {
      setMarkersOptions(getMarkersOptions(studyVoteData, currentLocation));
    }
  }, [currentLocation, mainLocation, studyCategoryTab, studyVoteData]);

  const tabOptionsArr: ITabNavOptions[] = [
    {
      text: "실시간 스터디",
      func: () => {
        setStudyCategoryTab("실시간 스터디");
      },
      flex: 1,
    },
    {
      text: "내일의 스터디",
      func: () => {
        setStudyCategoryTab("내일의 스터디");
      },
      flex: 1,
    },
  ];

  const realButtonOptionsArr: ButtonOptionsProps[] = [
    {
      text: "현재 위치",
      func: () => {
        setLocationFilterType("현재 위치");
        setIsLocationRefetch(true);
      },
    },
    {
      text: `주 활동 장소`,
      func: () => {
        setLocationFilterType("주 활동 장소");
        setCurrentLocation({ lat: mainLocation?.lat, lon: mainLocation?.lon });
      },
    },
  ];

  const dateArr = Array(10)
    .fill(0)
    .map((_, idx) => dayjsToStr(dayjs().add(idx, "day")));

  const handleMarker = (id: string) => {
    if (!id || !studyVoteData) return;
    const findStudy = studyVoteData.find((par) => par.place._id === id);

    if (studyCategoryTab === "실시간 스터디") {
      setDetailInfo({
        title: findStudy.place.fullname,
        id,
        time: getStudyTime(findStudy.attendences),
        participantCnt: findStudy.attendences.length,
        image: findStudy.place.image,
        comment: {
          user: {
            uid: ABOUT_USER_SUMMARY.uid,
            avatar: ABOUT_USER_SUMMARY.avatar,
            userImage: ABOUT_USER_SUMMARY.profileImage,
          },
          text: getFirstComment(findStudy.attendences),
        },
      });
    }

    if (studyCategoryTab === "내일의 스터디") {
      const myPlace = findStudy.place;
      setMyVoteInfo((old) => setVotePlaceInfo(myPlace, old));
    }
  };
  console.log(51, detailInfo);
  return (
    <>
      <Header title="스터디 투표" isCenter isBorder={false} />

      <TabNav selected={studyCategoryTab} tabOptionsArr={tabOptionsArr} isMain />
      <Box
        position="relative"
        height={
          studyCategoryTab === "실시간 스터디" || !isDrawerFixed
            ? "calc(100dvh - 97px)"
            : "calc(100dvh - 412px)"
        }
      >
        <Flex
          w="100%"
          justify="space-between"
          py={3}
          px={5}
          position="absolute"
          top="0"
          left="0"
          zIndex={10}
        >
          {studyCategoryTab === "실시간 스터디" ? (
            <>
              <CurrentLocationBtn />
              <ButtonGroups
                buttonOptionsArr={realButtonOptionsArr}
                size="sm"
                isEllipse
                currentValue={locationFilterType}
              />
            </>
          ) : (
            <>
              <Flex>
                <Box mr={2}>
                  <Selector
                    defaultValue={dateValue}
                    options={dateArr}
                    setValue={setDateValue}
                    convertTextFunc={(text) => dayjsToFormat(dayjs(text), "M월 D일(ddd) 스터디")}
                  />
                </Box>
                <LocationSelector
                  defaultValue={locationValue}
                  options={LOCATION_OPEN}
                  setValue={setLocationValue}
                />
              </Flex>
            </>
          )}
        </Flex>
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
      {detailInfo && (
        <BottomDrawerLg height={185} setIsModal={() => setDetailInfo(null)}>
          <Flex direction="column" w="100%">
            <Flex justifyContent="space-between" mb={4}>
              <Flex direction="column">
                <Box fontSize="18px" fontWeight={600}>
                  {detailInfo.title}
                </Box>
                <Flex align="center" fontSize="11px">
                  <Box mr={1}>
                    <i className="fa-solid fa-clock fa-xs" style={{ color: "var(--color-mint)" }} />
                  </Box>
                  <Box color="var(--gray-500)">
                    {detailInfo.time.start} ~ {detailInfo.time.end}
                  </Box>
                  <Box w={3} textAlign="center">
                    ·
                  </Box>
                  <Box color="var(--color-blue)">{detailInfo.participantCnt + 1}명 참여 중</Box>
                </Flex>
                <Flex mt={2} align="center">
                  <Avatar {...detailInfo.comment.user} size="xs" />
                  <Box ml={1} fontSize="12px" color="var(--gray-600)">
                    {detailInfo.comment.text}
                  </Box>
                </Flex>
              </Flex>
              <Box
                width="75px"
                height="75px"
                position="relative"
                borderRadius="4px"
                overflow="hidden"
              >
                <Image src={detailInfo.image} fill sizes="80px" alt="studyImage" />
              </Box>
            </Flex>
            <Box py={2}>
              <NewTwoButtonRow
                leftProps={{
                  icon: (
                    <i className="fa-solid fa-circle-info" style={{ color: "var(--gray-400)" }} />
                  ),
                  children: (
                    <Link href={`/study/${detailInfo.id}/${dayjsToStr(dayjs())}`}>자세히 보기</Link>
                  ),
                }}
                rightProps={{
                  icon: <i className="fa-solid fa-user-plus" style={{ color: "#CCF3F0" }} />,
                  children: "스터디 합류",
                }}
              />
            </Box>
          </Flex>
        </BottomDrawerLg>
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

const getMarkersOptions = (
  studyVoteData: IParticipation[],
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
    title: "테스트트",
    icon: {
      content: getCurrentLocationIcon(),
      size: new naver.maps.Size(72, 72),
      anchor: new naver.maps.Point(36, 44),
    },
  });

  studyVoteData
    .filter((par) => par.attendences.length >= 1)
    .forEach((par) => {
      temp.push({
        id: par.place._id,
        position: new naver.maps.LatLng(par.place.latitude, par.place.longitude),
        title: "메인",
        icon: {
          content: getStudyIcon(null, 4),
          size: new naver.maps.Size(72, 72),
          anchor: new naver.maps.Point(36, 44),
        },
      });
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
