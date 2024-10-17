import { Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import PageIntro from "../../components/atoms/PageIntro";

import BottomNav from "../../components/layouts/BottomNav";
import { StudyThumbnailCardProps } from "../../components/molecules/cards/StudyThumbnailCard";
import PickerRowButton from "../../components/molecules/PickerRowButton";
import BottomFlexDrawer, {
  BottomFlexDrawerOptions,
} from "../../components/organisms/drawer/BottomFlexDrawer";
import RightDrawer from "../../components/organisms/drawer/RightDrawer";
import SearchLocation from "../../components/organisms/SearchLocation";
import StudyVoteTimeRulletDrawer from "../../components/services/studyVote/StudyVoteTimeRulletDrawer";
import { useCurrentLocation } from "../../hooks/custom/CurrentLocationHook";
import { useResetStudyQuery } from "../../hooks/custom/CustomHooks";
import { useToast, useTypeToast } from "../../hooks/custom/CustomToast";
import { useRealtimeVoteMutation } from "../../hooks/realtime/mutations";
import { useStudyParticipationMutation } from "../../hooks/study/mutations";
import { useUserInfoQuery } from "../../hooks/user/queries";
import { getLocationByCoordinates } from "../../libs/study/getLocationByCoordinates";
import {
  getCurrentLocationIcon,
  getStudyIcon,
  getStudyVoteIcon,
} from "../../libs/study/getStudyVoteIcon";
import { setStudyToThumbnailInfo } from "../../libs/study/setStudyToThumbnailInfo";
import { IModal } from "../../types/components/modalTypes";
import { KakaoLocationProps } from "../../types/externals/kakaoLocationSearch";
import { IMarkerOptions } from "../../types/externals/naverMapTypes";
import { DispatchBoolean, DispatchType } from "../../types/hooks/reactTypes";
import {
  StudyDailyInfoProps,
  StudyParticipationProps,
  StudyPlaceProps,
} from "../../types/models/studyTypes/studyDetails";
import { IStudyVoteTime, MyVoteProps } from "../../types/models/studyTypes/studyInterActions";
import { ActiveLocation } from "../../types/services/locationTypes";
import { getDistanceFromLatLonInKm } from "../../utils/mathUtils";
import { iPhoneNotchSize } from "../../utils/validationUtils";
export interface VoteDrawerItemProps {
  place: StudyPlaceProps;
  voteCnt: number;
  favoritesCnt: number;
  myFavorite: "first" | "second";
}

interface VoteDrawerProps extends IModal {
  studyVoteData: StudyDailyInfoProps;
  location: ActiveLocation;
  date: string;
  setMarkersOptions: DispatchType<IMarkerOptions[]>;
  setCenterLocation: DispatchType<{ lat: number; lon: number }>;
  myVote: MyVoteProps;
  setMyVote: DispatchType<MyVoteProps>;
}

const DEFAULT_SUB_PLACE_CNT = 2;

function VoteDrawer({
  studyVoteData,
  location,
  date,
  setIsModal,
  setMarkersOptions,
  setCenterLocation,
  myVote,
  setMyVote,
}: VoteDrawerProps) {
  const typeToast = useTypeToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);
  const { data: userInfo } = useUserInfoQuery();
  const preference = userInfo?.studyPreference;

  const { currentLocation } = useCurrentLocation();

  const [thumbnailCardInfoArr, setThumbnailCardinfoArr] = useState<StudyThumbnailCardProps[]>();

  const [isRightDrawer, setIsRightDrawer] = useState(false);
  const [isFirstPage, setIsFirstPage] = useState(true);
  const [isTimeDrawer, setIsTimeDrawer] = useState(false);
  const isTodayVote = dayjs().isSame(date, "day") && dayjs().hour() >= 9;
  const [voteTime, setVoteTime] = useState<IStudyVoteTime>();

  const findMainPlace = studyVoteData?.participations.find(
    (par) => par.place._id === (isFirstPage ? preference?.place : myVote?.main),
  );
  const subPlace = studyVoteData.participations
    .filter((par) => preference?.subPlace.includes(par.place._id))
    .map((par) => par.place._id);

  const { mutate: patchAttend, isLoading } = useStudyParticipationMutation(dayjs(date), "post", {
    onSuccess() {
      handleSuccess();
    },
  });

  useEffect(() => {
    if (!studyVoteData) return;
    setMarkersOptions(
      getMarkersOptions(
        studyVoteData,
        { lat: currentLocation?.lat, lon: currentLocation?.lon },
        myVote,
        isFirstPage,
      ),
    );
  }, [studyVoteData, currentLocation, myVote]);

  useEffect(() => {
    if (preference === undefined || !studyVoteData) return;
    if (isFirstPage && !currentLocation) return;
    let votePlaceProps = {
      main: null,
      sub: [],
    };
    if (findMainPlace) {
      if (subPlace?.length >= DEFAULT_SUB_PLACE_CNT) {
        votePlaceProps = {
          main: preference?.place,
          sub: preference?.subPlace,
        };
      } else {
        const temp = [];
        const sortedSub = sortByDistanceSub(findMainPlace);

        sortedSub.forEach((par, idx) => {
          if (idx > DEFAULT_SUB_PLACE_CNT || par.place.distance > 2) {
            return;
          } else temp.push(par.place._id);
        });

        votePlaceProps = {
          main: findMainPlace.place._id,
          sub: temp,
        };
      }

      setMyVote({
        main: votePlaceProps.main,
        sub: votePlaceProps.sub.filter((place) => place !== votePlaceProps.main),
      });
    }
    const participations = studyVoteData?.participations;
  
    const getThumbnailCardInfoArr = setStudyToThumbnailInfo(
      participations,
      isFirstPage
        ? currentLocation
        : { lat: findMainPlace.place.latitude, lon: findMainPlace.place.longitude },
      null,
      true,
      location,
      votePlaceProps?.main ? votePlaceProps : null,
    );

    setThumbnailCardinfoArr(getThumbnailCardInfoArr);
  }, [preference, studyVoteData, isFirstPage, currentLocation]);

  useEffect(() => {
    if (myVote?.main && findMainPlace) {
      if (!isFirstPage) {
        // const subs = recommendSub( subPlace);
      }

      setCenterLocation({
        lat: findMainPlace?.place?.latitude,
        lon: findMainPlace?.place?.longitude,
      });
    } else setIsFirstPage(true);
  }, [myVote?.main, findMainPlace, isFirstPage]);

  const sortByDistanceSub = (mainPlace: StudyParticipationProps) => {
    const updatedParticipations = studyVoteData.participations.map((participation) => {
      const distance = getDistanceFromLatLonInKm(
        participation.place.latitude,
        participation.place.longitude,
        mainPlace.place.latitude,
        mainPlace.place.longitude,
      );
      return {
        ...participation,
        place: {
          ...participation.place,
          distance, // distance 추가
        },
      };
    });

    const sortedArr = updatedParticipations.sort((a, b) => {
      if (a.place.distance < b.place.distance) return -1;
      if (a.place.distance > b.place.distance) return 1;
      return 0;
    });

    return sortedArr;
  };

  const handleClickPlaceButton = (id: string) => {
    if (isFirstPage) {
      if (myVote?.main === id) return;
      else setMyVote({ main: id, sub: [] });
    } else {
      if (!myVote?.main) {
        setMyVote({ main: id, sub: [] });
      } else if (myVote?.main === id) {
        setMyVote({ main: null, sub: [] });
      } else if (myVote?.sub.includes(id))
        setMyVote((old) => ({ ...old, sub: old.sub.filter((place) => place !== id) }));
      else {
        setMyVote((old) => ({ ...old, sub: [...old.sub, id] }));
      }
    }
  };

  const resetStudy = useResetStudyQuery();

  const handleVote = async () => {
    if (!myVote?.main || !voteTime?.start || !voteTime?.end) {
      typeToast("omission");
      return;
    }
    patchAttend({ place: myVote.main, subPlace: myVote?.sub, ...voteTime });
  };
  const handleSuccess = async () => {
    setIsModal(false);
    typeToast("vote");
    resetStudy();
    newSearchParams.set("category", "votePlace");
    router.push(`/studyPage?${newSearchParams.toString()}`);
  };

  const drawerOptions: BottomFlexDrawerOptions = {
    header: {
      title: dayjs(date).locale("ko").format("M월 D일 ddd요일"),
      subTitle: "스터디 참여시간을 선택해주세요!",
    },
    footer: {
      text: "신청 완료",
      func: handleVote,
      loading: isLoading,
    },
  };

  return (
    <>
      <BottomFlexDrawer
        drawerOptions={{
          footer: {
            text: isTodayVote || !isFirstPage ? "선택 완료" : "다음",
            func:
              isFirstPage && !isTodayVote
                ? () => setIsFirstPage(false)
                : () => setIsTimeDrawer(true),
          },
        }}
        isOverlay={false}
        isDrawerUp
        isHideBottom
        setIsModal={setIsModal}
        zIndex={900}
        height={468 + iPhoneNotchSize()}
      >
        <Flex direction="column" w="100%">
          <Flex mb={4} justify="space-between">
            <Box>
              <Box mb={1} lineHeight="28px" fontWeight="bold" fontSize="18px">
                {isFirstPage ? 1 : 2}지망 투표
              </Box>
              <Box color="gray.500" fontSize="12px" lineHeight="16px">
                {isFirstPage && "원하시는 카페가 없으신가요?"}
                {!isFirstPage && (
                  <Box as="span">
                    원하시는 2지망 카페를 선택해 주세요{" "}
                    <b style={{ color: "var(--color-blue)" }}>(다중 선택)</b>
                  </Box>
                )}
              </Box>
            </Box>
            {isFirstPage && (
              <Button
                mt="auto"
                as="div"
                fontSize="13px"
                fontWeight={500}
                size="xs"
                variant="ghost"
                height="20px"
                color="var(--color-blue)"
                onClick={() => setIsRightDrawer(true)}
              >
                직접 입력
              </Button>
            )}
          </Flex>
          <Box
            overflow="scroll"
            h="312px"
            sx={{
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            {thumbnailCardInfoArr?.map((props, idx) => {
              const id = props.id;
              return (
                <Box key={idx} mb={3}>
                  <PickerRowButton
                    {...props}
                    participantCnt={props.participants.length}
                    onClick={() => handleClickPlaceButton(id)}
                    pickType={
                      !isFirstPage && myVote?.sub.includes(id)
                        ? "second"
                        : myVote?.main !== id
                          ? null
                          : isFirstPage
                            ? "first"
                            : "main"
                    }
                  />
                </Box>
              );
            })}
          </Box>
        </Flex>
      </BottomFlexDrawer>
      {isRightDrawer && <PlaceDrawer date={date} setIsRightDrawer={setIsRightDrawer} />}
      {isTimeDrawer && (
        <StudyVoteTimeRulletDrawer
          setVoteTime={setVoteTime}
          drawerOptions={drawerOptions}
          setIsModal={setIsModal}
        />
      )}
    </>
  );
}

interface PlaceDrawerProps {
  setIsRightDrawer: DispatchBoolean;
  date: string;
}

export const PlaceDrawer = ({ setIsRightDrawer, date }: PlaceDrawerProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);
  const resetStudy = useResetStudyQuery();
  const typeToast = useTypeToast();
  const toast = useToast();
  const [placeInfo, setPlaceInfo] = useState<KakaoLocationProps>({
    place_name: "",
    road_address_name: "",
  });
  const [voteTime, setVoteTime] = useState<IStudyVoteTime>();
  const [isTimeDrawer, setIsTimeDrawer] = useState(false);

  const { mutate, isLoading } = useRealtimeVoteMutation({
    onSuccess() {
      typeToast("vote");
      resetStudy();
      newSearchParams.set("category", "votePlace");
      router.push(`/studyPage?${newSearchParams.toString()}`);
    },
  });

  const handleBottomNav = () => {
    if (!placeInfo?.place_name) {
      toast("warning", "장소를 입력해 주세요");
      return;
    }
    const changeLocation = getLocationByCoordinates(+placeInfo?.y, +placeInfo?.x);

    if (!changeLocation) {
      toast("warning", "서비스중인 지역이 아닙니다.");
      return;
    }
    setIsTimeDrawer(true);
  };
  const handleSubmit = () => {
    mutate({
      place: {
        name: placeInfo.place_name,
        address: placeInfo.road_address_name,
        latitude: +placeInfo.y,
        longitude: +placeInfo.x,
      },
      time: { ...voteTime },
    });
  };

  const drawerOptions: BottomFlexDrawerOptions = {
    header: {
      title: dayjs(date).locale("ko").format("M월 D일 ddd요일"),
      subTitle: "스터디 참여시간을 선택해주세요!",
    },
    footer: {
      text: "신청 완료",
      func: handleSubmit,
      loading: isLoading,
    },
  };
  console.log(54, isTimeDrawer);
  return (
    <>
      <RightDrawer title="" onClose={() => setIsRightDrawer(false)}>
        <PageIntro
          main={{ first: "리스트에 없으신가요?", second: "스터디 장소를 알려주세요" }}
          sub="스터디를 진행할 장소를 입력해 보세요"
        />
        <Box>
          <SearchLocation placeInfo={placeInfo} setPlaceInfo={setPlaceInfo} />
        </Box>{" "}
        <BottomNav isSlide={false} text="스터디 신청" onClick={handleBottomNav} />
      </RightDrawer>{" "}
      {isTimeDrawer && (
        <StudyVoteTimeRulletDrawer
          setVoteTime={setVoteTime}
          drawerOptions={drawerOptions}
          setIsModal={setIsTimeDrawer}
        />
      )}
    </>
  );
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
  myVote: { main: string; sub: string[] },
  onlyFirst: boolean,
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
  return temp;
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

export default VoteDrawer;
