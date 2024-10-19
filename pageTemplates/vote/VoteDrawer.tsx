import { Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

import AlertModal, { IAlertModalOptions } from "../../components/AlertModal";
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
import { setStudyToThumbnailInfo } from "../../libs/study/setStudyToThumbnailInfo";
import { myStudyParticipationState } from "../../recoils/studyRecoils";
import { IModal } from "../../types/components/modalTypes";
import { KakaoLocationProps } from "../../types/externals/kakaoLocationSearch";
import { DispatchBoolean, DispatchType } from "../../types/hooks/reactTypes";
import {
  StudyDailyInfoProps,
  StudyParticipationProps,
  StudyPlaceProps,
} from "../../types/models/studyTypes/studyDetails";
import { IStudyVoteTime, MyVoteProps } from "../../types/models/studyTypes/studyInterActions";
import { ActiveLocation } from "../../types/services/locationTypes";
import { dayjsToFormat, dayjsToStr } from "../../utils/dateTimeUtils";
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

  setCenterLocation: DispatchType<{ lat: number; lon: number }>;
  myVote: MyVoteProps;
  setMyVote: DispatchType<MyVoteProps>;
  isFirstPage: boolean;
  setIsFirstPage: DispatchBoolean;
  setIsVoteDrawer: DispatchBoolean;
}

const DEFAULT_SUB_PLACE_CNT = 2;

function VoteDrawer({
  studyVoteData,
  location,
  date,
  setIsModal,
  isFirstPage,
  setIsFirstPage,
  setCenterLocation,
  myVote,
  setIsVoteDrawer,
  setMyVote,
}: VoteDrawerProps) {
  const typeToast = useTypeToast();
  const toast = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);
  const { data: userInfo } = useUserInfoQuery();
  const preference = userInfo?.studyPreference;

  const { currentLocation } = useCurrentLocation();

  const [thumbnailCardInfoArr, setThumbnailCardinfoArr] = useState<StudyThumbnailCardProps[]>();

  const [isRightDrawer, setIsRightDrawer] = useState(false);

  const [isTimeDrawer, setIsTimeDrawer] = useState(false);
  const isTodayVote = dayjs().isSame(date, "day") && dayjs().hour() >= 9;
  const [voteTime, setVoteTime] = useState<IStudyVoteTime>();
  const [alertModalInfo, setAlertModalInfo] = useState<IAlertModalOptions>();

  const myStudyParticipation = useRecoilValue(myStudyParticipationState);

  const findMainPlace = studyVoteData?.participations.find(
    (par) => par.place._id === (isFirstPage ? preference?.place : myVote?.main),
  );
  const subPlace = studyVoteData?.participations
    .filter((par) => preference?.subPlace.includes(par.place._id))
    .map((par) => par.place._id);

  const { mutate: patchAttend, isLoading } = useStudyParticipationMutation(dayjs(date), "post", {
    onSuccess() {
      handleSuccess();
    },
  });

  useEffect(() => {
    if (preference === undefined || !studyVoteData) return;
    if (isFirstPage && !currentLocation) return;
    let votePlaceProps = {
      main: null,
      sub: [],
    };
    const findMyStudy = studyVoteData.participations.find(
      (par) => par.place._id === myStudyParticipation?.place._id,
    );

    if (findMyStudy) {
      setMyVote({ main: findMyStudy.place._id, sub: [] });
    } else if (findMainPlace) {
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
  }, [preference, studyVoteData, isFirstPage, currentLocation, myStudyParticipation]);

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

  const onClickStudyVote = () => {
    if (myStudyParticipation) {
      setVoteTime(voteTime);
      setAlertModalInfo({
        title: "스터디 장소 변경",
        subTitle: "장소를 변경하는 경우 기존에 투표 장소는 취소됩니다.",
        text: "변경합니다",
        func: () => {
          handleVote();
        },
        subFunc: () => {
          setIsTimeDrawer(false);
          setAlertModalInfo(null);
        },
      });
      return;
    }
    handleVote();
  };

  const handleVote = () => {
    if (!myVote?.main || !voteTime?.start || !voteTime?.end) {
      typeToast("omission");
      return;
    }
    patchAttend({ place: myVote.main, subPlace: myVote?.sub, ...voteTime });
  };
  const handleSuccess = () => {
    setIsModal(false);
    typeToast("vote");
    resetStudy();
    newSearchParams.set("category", "votePlace");
    router.replace(`/studyPage?${newSearchParams.toString()}`);
    setIsVoteDrawer(false);
  };

  const drawerOptions: BottomFlexDrawerOptions = {
    header: {
      title: "스터디 참여 시간 선택",
      subTitle: "예상 시작 시간과 종료 시간을 선택해 주세요!",
    },
    footer: {
      text: "신청 완료",
      func: onClickStudyVote,
      loading: isLoading,
    },
  };

  const onClickPlaceSelectButton = () => {
    if (dayjsToStr(dayjs()) === date) {
      setIsRightDrawer(true);
    } else {
      toast("warning", "실시간 스터디는 당일에만 신청 가능합니다");
    }
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
        zIndex={800}
        height={468 + iPhoneNotchSize()}
      >
        <Flex direction="column" w="100%">
          <Flex mb={4} justify="space-between">
            <Box>
              <Box mb={1} lineHeight="28px" fontWeight="bold" fontSize="18px">
                {isFirstPage ? dayjsToFormat(dayjs(date), "M월 D일 스터디 투표") : "2지망 투표"}{" "}
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
                onClick={() => onClickPlaceSelectButton()}
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
      {isRightDrawer && (
        <PlaceDrawer
          setIsVoteDrawer={setIsVoteDrawer}
          date={date}
          setIsRightDrawer={setIsRightDrawer}
        />
      )}
      {isTimeDrawer && (
        <StudyVoteTimeRulletDrawer
          setVoteTime={setVoteTime}
          drawerOptions={drawerOptions}
          setIsModal={setIsModal}
          zIndex={800}
        />
      )}
      {alertModalInfo && (
        <AlertModal
          options={alertModalInfo}
          colorType="red"
          setIsModal={() => setAlertModalInfo(null)}
        />
      )}
    </>
  );
}

interface PlaceDrawerProps {
  setIsRightDrawer: DispatchBoolean;
  setIsVoteDrawer: DispatchBoolean;
  date: string;
}

export function PlaceDrawer({ setIsRightDrawer, setIsVoteDrawer, date }: PlaceDrawerProps) {
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
      setIsVoteDrawer(false);
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
}

export default VoteDrawer;
