import { Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

import PageIntro from "../../../components/atoms/PageIntro";
import BottomNav from "../../../components/layouts/BottomNav";
import MonthCalendar from "../../../components/molecules/MonthCalendar";
import RangeSlider from "../../../components/molecules/RangeSlider";
import { BottomFlexDrawerOptions } from "../../../components/organisms/drawer/BottomFlexDrawer";
import RightDrawer from "../../../components/organisms/drawer/RightDrawer";
import StudyVoteTimeRulletDrawer from "../../../components/services/studyVote/StudyVoteTimeRulletDrawer";
import { STUDY_RESULT_HOUR } from "../../../constants/serviceConstants/studyConstants/studyTimeConstant";
import { useResetStudyQuery } from "../../../hooks/custom/CustomHooks";
import { useToast, useTypeToast } from "../../../hooks/custom/CustomToast";
import { useStudyVoteArrMutation } from "../../../hooks/study/mutations";
import { useStudySetQuery } from "../../../hooks/study/queries";
import { useUserInfoQuery } from "../../../hooks/user/queries";
import { CalendarHeader } from "../../../modals/aboutHeader/DateCalendarModal";
import { ModalLayout } from "../../../modals/Modals";
import { RegisterLocationLayout } from "../../../pages/register/location";
import { LocationProps } from "../../../types/common";
import { DispatchType } from "../../../types/hooks/reactTypes";
import { IStudyVoteTime } from "../../../types/models/studyTypes/studyInterActions";
import { LocationDetailProps } from "../../../types/models/userTypes/userInfoTypes";
import { dayjsToStr } from "../../../utils/dateTimeUtils";
import { getLocationSimpleText } from "../../../utils/stringUtils";
import StudyExpectedMap from "../../study/StudyExpectedMap";
import { LocationIcon } from "../../studyPage/StudyPageHeader";

interface StudyDateDrawerProps {
  onClose: () => void;
  defaultDate?: string;
  location?: LocationProps;
  canChange?: boolean;
  // date: string;
  // handleStudyVote: (voteData: StudyVoteProps | RealTimeVoteProps) => void;
}

function StudyApplyDrawer({
  onClose,
  defaultDate,
  location,
  canChange = false,
}: StudyDateDrawerProps) {
  const toast = useToast();

  const resetStudy = useResetStudyQuery();
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [isModal, setIsModal] = useState(false);
  const [isStudyPlaceModal, setIsStudyPlaceModal] = useState(false);
  const [voteLocation, setVoteLocation] = useState<LocationProps>(location);
  const [rangeNum, setRangeNum] = useState(2);
  const [isFirstPage, setIsFirstPage] = useState(true);

  const { data: userInfo } = useUserInfoQuery();
  const { data: studySet } = useStudySetQuery(dayjsToStr(dayjs()));

  useEffect(() => {
    if (!isFirstPage) {
      toast("info", "매칭 범위 설정은 10월 18일부터 적용됩니다!");
    }
  }, [!isFirstPage]);

  useEffect(() => {
    if (location) setVoteLocation(location);
    else if (userInfo?.locationDetail) setVoteLocation(userInfo.locationDetail);
  }, [location, userInfo]);

  const defaultDates =
    studySet &&
    studySet.participations
      .filter((par) => par.study.some((study) => study.user._id === userInfo?._id))
      .map((par) => par.date);

  useEffect(() => {
    if (!canChange) {
      const date =
        dayjs().hour() < STUDY_RESULT_HOUR
          ? defaultDate
          : dayjsToStr(dayjs(defaultDate).add(1, "day"));
      if (!defaultDates.includes(date) && date) {
        setSelectedDates([date]);
      }
    } else setSelectedDates((old) => [...old, ...defaultDates]);
  }, [defaultDate, canChange]);

  // useEffect(() => {
  //   if (!defaultDates) return;
  //   setSelectedDates(defaultDates);
  // }, [studySet]);

  const { mutate: voteDateArr, isLoading } = useStudyVoteArrMutation(selectedDates, {
    onSuccess() {
      if (selectedDates.length) {
        if (canChange) {
          toast("success", "스터디 변경 완료!");
        } else {
          toast("success", "스터디 신청 완료!");
        }
      } else {
        toast("success", "스터디 취소 완료!");
      }
      resetStudy();
      onClose();
    },
  });

  // const { mutate: participateStudyOne } = useStudyParticipateMutation(dayjs(date), {
  //   onSuccess() {
  //     toast("success", "참여가 완료되었습니다. 출석 인증도 잊지 마세요!");
  //     resetStudy();
  //     onClose();
  //   },
  // });

  const [voteTime, setVoteTime] = useState<IStudyVoteTime>();
  const [isTimeDrawer, setIsTimeDrawer] = useState(false);
  const [date, setDate] = useState(dayjs());

  const handleBottomNav = () => {
    if (!selectedDates.length) {
      if (canChange) {
        setIsModal(true);
        return;
      }

      toast("warning", "날짜를 선택해 주세요");
      return;
    }
    if (isFirstPage) {
      setIsFirstPage(false);
      return;
    }
    setIsTimeDrawer(true);
  };

  const handleClickDate = (date: string) => {
    setSelectedDates((old) => {
      if (old.includes(date)) {
        return old.filter((d) => d !== date);
      } else {
        return [...old, date];
      }
    });
  };

  const drawerOptions: BottomFlexDrawerOptions = {
    header: {
      title: "예상 참여 시간을 선택해 주세요",
      subTitle: "스터디 전까지 언제든 변경할 수 있습니다.",
    },
    footer: {
      text: "신청 완료",
      func: () => {
        voteDateArr({
          locationDetail: voteLocation
            ? voteLocation.address
            : getLocationSimpleText(userInfo.locationDetail.address),
          latitude: voteLocation ? voteLocation.latitude : userInfo.locationDetail.latitude,
          longitude: voteLocation ? voteLocation.longitude : userInfo.locationDetail.longitude,
          start: voteTime.start,
          end: voteTime.end,
        });
      },
      loading: isLoading,
    },
  };

  const typeToast = useTypeToast();
  const locationTextArr = voteLocation?.name?.split(" ");

  return (
    <>
      <RightDrawer
        title=""
        onClose={onClose}
        headerBtn={
          <Flex align="center">
            <Flex
              ml="-1px"
              p={1}
              px={1.5}
              justify="center"
              align="center"
              h={5}
              bg=" rgba(160, 174, 192, 0.2)"
              fontSize="10px"
              borderRadius="6px"
              color="gray.800"
              w="max-content"
            >
              설정 위치 - {locationTextArr?.[0]}
            </Flex>
            <RightTriangleIcon />
            <Button
              display="flex"
              justifyItems="center"
              alignItems="center"
              variant="unstyled"
              w={6}
              h={6}
              mr={0.5}
              onClick={() => {
                if (userInfo?.role === "guest") {
                  typeToast("guest");
                  return;
                }
                setIsStudyPlaceModal(true);
              }}
            >
              <LocationIcon />
            </Button>
          </Flex>
        }
      >
        <PageIntro
          main={{
            first: isFirstPage
              ? "스터디 희망 날짜를 선택해 주세요."
              : "스터디 매칭 범위를 설정해 주세요.",
          }}
          sub={
            isFirstPage
              ? "여러 날짜를 한번에 신청할 수도 있습니다."
              : "설정한 거리 안에서 가장 가까운 스터디 장소로 매칭됩니다."
          }
        />
        {isFirstPage ? (
          <>
            <Box fontSize="20px" mb={4} pb={2} px={2} borderBottom="var(--border)">
              <CalendarHeader
                goNext={() => setDate((old) => old.add(1, "month"))}
                goPrev={() => setDate((old) => old.subtract(1, "month"))}
                leftDisabled={date.month() === dayjs().month()}
                rightDisabled={date.month() === dayjs().month() + 1}
                date={dayjsToStr(date)}
              />
            </Box>
            <MonthCalendar
              standardDate={dayjsToStr(date)}
              selectedDates={selectedDates}
              func={handleClickDate}
              passedDisabled
              mintDateArr={canChange ? [] : defaultDates}
              isTodayInclude={dayjs().hour() < STUDY_RESULT_HOUR ? true : false}
            />
            <Box h={3} />
            {canChange ? (
              <Box as="li" fontSize="12px" lineHeight="20px" color="gray.600">
                스터디를 취소하는 경우 선택된 날짜를 해제해 주세요.
              </Box>
            ) : !canChange && defaultDates.length ? (
              <Box as="li" fontSize="12px" lineHeight="20px" color="gray.600">
                <Box as="span" color="mint">
                  민트색
                </Box>{" "}
                숫자는 이미 참여중인 스터디 날짜입니다.
              </Box>
            ) : null}
          </>
        ) : (
          <>
            {/* <Box as="li" fontSize="12px" lineHeight="20px" color="gray.600">
          최대 일주일 이내의 스터디만 신청할 수 있습니다.
        </Box> */}
            <Box fontSize="18px" mb={5} fontWeight={600}>
              스터디 매칭 범위
            </Box>
            <RangeSlider
              numberArr={[0, 1, 2, 3]}
              defaultNums={[0, rangeNum]}
              isNumber={false}
              setNums={(num: number[]) => {
                if (num[1] === 0) return;
                setRangeNum(num[1]);
              }}
            />
            {voteLocation && <StudyExpectedMap centerLocation={voteLocation} rangeNum={rangeNum} />}
          </>
        )}
        <BottomNav isSlide={false} text="다 음" onClick={handleBottomNav} />
      </RightDrawer>
      {isTimeDrawer && (
        <StudyVoteTimeRulletDrawer
          setVoteTime={setVoteTime}
          drawerOptions={drawerOptions}
          setIsModal={setIsTimeDrawer}
          // defaultVoteTime={{ start: dayjs(), end: dayjs().add(3, "hour") }}
        />
      )}
      {isModal && (
        <ModalLayout
          title="스터디 취소 확인"
          setIsModal={setIsModal}
          footerOptions={{
            main: {
              text: "취소할게요",
              func: async () => {
                await setSelectedDates([]);

                await voteDateArr({
                  locationDetail: location
                    ? location.address
                    : getLocationSimpleText(userInfo.locationDetail.address),
                  latitude: location ? location.latitude : userInfo.locationDetail.latitude,
                  longitude: location ? location.longitude : userInfo.locationDetail.longitude,
                  start: dayjs(),
                  end: dayjs(),
                });
              },
              isLoading,
            },
            sub: {
              text: "닫 기",
              func: () => {
                setIsModal(false);
              },
            },
          }}
        >
          스터디 신청을 완전히 취소하시겠어요?
        </ModalLayout>
      )}

      {isStudyPlaceModal && (
        <PlaceDrawer
          defaultLocation={voteLocation}
          setVoteLocation={setVoteLocation}
          onClose={() => setIsStudyPlaceModal(false)}
        />
        // <AlertModal
        //   options={{
        //     title: "스터디 위치 설정",
        //     text: "이 동",
        //     func: () => {
        //       router.push(`/studyPage?date=${dayjsToStr(dayjs())}&drawer=location`);
        //     },
        //   }}
        //   colorType="mint"
        //   setIsModal={setIsStudyPlaceModal}
        // >
        //   설정된 위치 기준으로 가까운 스터디가 매칭돼요. 장소 변경 페이지로 이동할까요?
        // </AlertModal>
      )}
    </>
  );
}

function PlaceDrawer({
  defaultLocation,
  setVoteLocation,
  onClose,
}: {
  onClose: () => void;
  defaultLocation: LocationDetailProps;
  setVoteLocation: DispatchType<LocationDetailProps>;
}) {
  const [placeInfo, setPlaceInfo] = useState<LocationProps>(defaultLocation);
  const [errorMessage, setErrorMessage] = useState("");

  const handleButton = () => {
    if (!placeInfo) {
      setErrorMessage("정확한 장소를 입력해 주세요.");
      return;
    }
    setVoteLocation(placeInfo);
    onClose();
    //  changeLocationDetail(placeInfo);
  };
  return (
    <RightDrawer title="위치 설정" px={false} onClose={onClose}>
      <RegisterLocationLayout
        handleButton={handleButton}
        placeInfo={placeInfo}
        setPlaceInfo={setPlaceInfo}
        text="변 경"
        errorMessage={errorMessage}
        isSlide={false}
        type="study"
      />
    </RightDrawer>
  );
}

function RightTriangleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="6" height="10" viewBox="0 0 6 10" fill="none">
      <path d="M6 5L0.75 0.669872L0.75 9.33013L6 5Z" fill="var(--gray-200)" />
    </svg>
  );
}

export default StudyApplyDrawer;
