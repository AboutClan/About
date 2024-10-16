import { Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

import { StudyThumbnailCardProps } from "../../components/molecules/cards/StudyThumbnailCard";
import PickerRowButton from "../../components/molecules/PickerRowButton";
import BottomFlexDrawer from "../../components/organisms/drawer/BottomFlexDrawer";
import { useCurrentLocation } from "../../hooks/custom/CurrentLocationHook";
import { useUserInfoQuery } from "../../hooks/user/queries";
import { convertStudyToParticipations } from "../../libs/study/getMyStudyMethods";
import {
  getCurrentLocationIcon,
  getStudyIcon,
  getStudyVoteIcon,
} from "../../libs/study/getStudyVoteIcon";
import { setStudyToThumbnailInfo } from "../../libs/study/setStudyToThumbnailInfo";
import { IModal } from "../../types/components/modalTypes";
import { IMarkerOptions } from "../../types/externals/naverMapTypes";
import { DispatchType } from "../../types/hooks/reactTypes";
import { StudyDailyInfoProps, StudyPlaceProps } from "../../types/models/studyTypes/studyDetails";
import { MyVoteProps } from "../../types/models/studyTypes/studyInterActions";
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

const DEFAULT_SUB_PLACE_CNT = 4;

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
  const { data: userInfo } = useUserInfoQuery();
  const preference = userInfo?.studyPreference;

  const { currentLocation } = useCurrentLocation();

  const [thumbnailCardInfoArr, setThumbnailCardinfoArr] = useState<StudyThumbnailCardProps[]>();

  const [isFirstPage, setIsFirstPage] = useState(true);
  const isTodayVote = dayjs().isSame(date, "day") && dayjs().hour() >= 9;

  const findMainPlace = studyVoteData.participations.find(
    (par) => par.place._id === (isFirstPage ? preference?.place : myVote?.main),
  );

  useEffect(() => {
    if (!studyVoteData) return;
    setMarkersOptions(
      getMarkersOptions(
        studyVoteData,
        { lat: currentLocation?.lat, lon: currentLocation?.lon },
        myVote,
      ),
    );
  }, [studyVoteData, currentLocation, myVote]);

  useEffect(() => {
    if (preference === undefined || !studyVoteData) return;

    let votePlaceProps = {
      main: null,
      sub: [],
    };
    if (findMainPlace) {
      const subPlace = studyVoteData.participations
        .filter((par) => preference?.subPlace.includes(par.place._id))
        .map((par) => par.place._id);

      if (subPlace?.length >= DEFAULT_SUB_PLACE_CNT) {
        votePlaceProps = {
          main: preference?.place,
          sub: preference?.subPlace,
        };
      } else {
        const temp = [...subPlace];

        const sortedArr = [...studyVoteData.participations].sort((a, b) => {
          const aDistance = getDistanceFromLatLonInKm(
            a.place.latitude,
            a.place.longitude,
            findMainPlace.place.latitude,
            findMainPlace.place.longitude,
          );
          const bDistance = getDistanceFromLatLonInKm(
            b.place.latitude,
            b.place.longitude,
            findMainPlace.place.latitude,
            findMainPlace.place.longitude,
          );

          if (aDistance < bDistance) return -1;
          else if (aDistance > bDistance) return 1;
          return 0;
        });

        sortedArr.forEach((par, idx) => {
          if (idx > DEFAULT_SUB_PLACE_CNT - subPlace?.length - 1) {
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

    const participations = convertStudyToParticipations(studyVoteData, location);
    const getThumbnailCardInfoArr = setStudyToThumbnailInfo(
      participations,
      currentLocation,
      null,
      location,
      votePlaceProps?.main ? votePlaceProps : null,
    );

    setThumbnailCardinfoArr(getThumbnailCardInfoArr);
  }, [preference, studyVoteData, isFirstPage, currentLocation]);

  useEffect(() => {
    if (myVote?.main && findMainPlace)
      setCenterLocation({
        lat: findMainPlace?.place?.latitude,
        lon: findMainPlace?.place?.longitude,
      });
    else setIsFirstPage(true);
  }, [myVote?.main, findMainPlace]);

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

  return (
    <BottomFlexDrawer
      bottom={{
        text: isTodayVote || !isFirstPage ? "선택 완료" : "다음",
        func: isFirstPage && !isTodayVote ? () => setIsFirstPage(false) : () => {},
      }}
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
  myVote?: { main: string; sub: string[] },
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
    .filter((par) => (myVote ? true : par.members.length >= 1))
    .forEach((par) => {
      if (myVote) {
        const mainPlace = studyVoteData?.participations?.find(
          (par) => par.place._id === myVote?.main,
        )?.place;
        const placeId = par.place._id;

        const iconType =
          placeId === myVote?.main ? "main" : myVote?.sub?.includes(placeId) ? "sub" : "default";

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
