import { Button, Flex, ThemeTypings } from "@chakra-ui/react";
import dayjs, { Dayjs } from "dayjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

import AlertModal, { IAlertModalOptions } from "../../components/AlertModal";
import IconTextColButton from "../../components/atoms/buttons/IconTextColButton";
import { XCircleIcon } from "../../components/Icons/CircleIcons";
import { ClockIcon } from "../../components/Icons/ClockIcons";
import Slide from "../../components/layouts/PageSlide";
import { BottomFlexDrawerOptions } from "../../components/organisms/drawer/BottomFlexDrawer";
import { useToast } from "../../hooks/custom/CustomToast";
import { useStudyMutations } from "../../hooks/custom/StudyHooks";
import { StudyTypeStatus } from "../../pages/study/[id]/[date]";
import { CoordinatesProps } from "../../types/common";
// import { MyStudyStatus } from "../../types/models/studyTypes/helperTypes";
import { DayjsTimeProps } from "../../types/utils/timeAndDate";
import StudyApplyDrawer from "../vote/voteDrawer/StudyApplyDrawer";

interface IStudyNavigation {
  date: string;

  hasOtherStudy: boolean;
  id: string;
  myStatus: myStatus;
  studyType: StudyTypeStatus;
  defaultCoordinates: CoordinatesProps;
}

interface NavigationProps {
  type: "single" | "multi";
  text: string;
  colorScheme: ThemeTypings["colorSchemes"];
  func?: () => void;
}

type myStatus = "participation" | "pending";

function StudyNavigation({
  id,
  date,
  myStatus,
  hasOtherStudy,
  defaultCoordinates,
  // isVoting,
  // pageType,
  // isArrived,
  studyType,
}: IStudyNavigation) {
  const router = useRouter();
  const toast = useToast();

  // const { data: session } = useSession();
  const {
    voteStudy: { vote, participate, change, absence, cancel },
    realTimeStudy: { vote: realTimeVote, change: realTimeChange, cancel: realTimeCancel },
  } = useStudyMutations(dayjs(date));

  const [isTimeRulletModal, setIsTimeRulletModal] = useState(false);
  const [voteModalType, setVoteModalType] = useState<"vote" | "free">(null);
  const [voteTime, setVoteTime] = useState<DayjsTimeProps>();
  const [isAbsentModal, setIsAbsentModal] = useState(false);
  const [alertModalInfo, setAlertModalInfo] = useState<IAlertModalOptions>();

  const [drawerType, setDrawerType] = useState<
    "apply" | "applyChange" | "realTimeVote" | "dailyVote"
  >(null);

  // const myStudyInfo = findMyStudyInfo(findStudy, session?.user.id);

  // const myStudyStatus = evaluateMyStudyStatus(findStudy, session?.user.id, pageType, isVoting);

  const getNavigationProps = (studyType: StudyTypeStatus, myStatus: myStatus): NavigationProps => {
    switch (studyType) {
      case "participations":
      case "expectedResult":
        if (myStatus === "pending") {
          return {
            text: "스터디 신청",
            type: "single",
            colorScheme: "mint",
            func: () => {
              setDrawerType("apply");
            },
          };
        } else {
          return {
            text: "참여 날짜 변경/취소",
            type: "single",
            colorScheme: "mint",
            func: () => {
              setDrawerType("applyChange");
            },
          };
        }
      case "openRealTimes":
        if (myStatus === "pending") {
          return {
            text: "스터디 참여",
            type: "single",
            colorScheme: "mint",
            func: () => {
              setDrawerType("realTimeVote");
            },
          };
        } else if (myStatus === "participation") {
          return {
            text: "참여 취소",
            type: "single",
            colorScheme: "mint",
            func: () => {
              realTimeCancel();
            },
          };
        }
      case "voteResult":
        if (myStatus === "pending") {
          if (hasOtherStudy) {
            toast("info", "다른 스터디에 참여중입니다");
            return;
          }
          return {
            text: "스터디 참여",
            type: "single",
            colorScheme: "mint",
            func: () => {
              setDrawerType("dailyVote");
            },
          };
        } else if (myStatus === "participation") {
          return {
            text: "출석 체크",
            type: "multi",
            colorScheme: "mint",
            func: () => router.push(`/vote/attend/configuration?date=${date}&id=${id}`),
          };
        }
      case "soloRealTimes":
        if (myStatus === "pending") {
          if (hasOtherStudy) {
            toast("info", "다른 스터디에 참여중입니다");
            return;
          }
          return {
            text: "개인 스터디 인증",
            type: "multi",
            colorScheme: "mint",
            func: () => router.push(`/vote/attend/certification?date=${date}&id=${id}`),
          };
        } else if (myStatus === "participation") {
          return {
            text: "출석 체크",
            type: "multi",
            colorScheme: "mint",
            func: () => router.push(`/vote/attend/configuration?date=${date}&id=${id}`),
          };
        }
      default:
        break;
    }
  };

  // const NAVIGATION_PROPS_MAPPING: Record<Exclude<MyStudyStatus, "expired">, NavigationProps> = {
  //   pending: {
  //     text: "참여 신청",
  //     type: "single",
  //     colorScheme: "mint",
  //     func: () => {
  //       if (pageType === "recruiting") setVoteModalType("vote");
  //       else if (pageType === "expected") setIsTimeRulletModal(true);
  //     },
  //   },
  //   voting: {
  //     text: "참여 취소",
  //     type: "single",
  //     colorScheme: "red",
  //     func: () => cancel(),
  //   },
  //   open: {
  //     text: "출석 체크",
  //     type: "multi",
  //     colorScheme: "mint",
  //     func: () => router.push(`/vote/attend/configuration?date=${date}&id=${id}`),
  //   },
  //   free: {
  //     text: "출석 체크",
  //     type: "multi",
  //     colorScheme: "mint",
  //     func: () => router.push(`/vote/attend/certification?date=${date}&id=${id}`),
  //   },
  //   todayPending:
  //     pageType === "solo" && isArrived
  //       ? { text: "출석 완료", type: "single", colorScheme: "black" }
  //       : pageType === "solo" && isVoting
  //       ? {
  //           text: "출석 체크",
  //           type: "single",
  //           colorScheme: "mint",
  //           func: () => router.push(`/vote/attend/certification?date=${date}`),
  //         }
  //       : {
  //           text: "스터디 참여",
  //           type: "single",
  //           colorScheme: "mint",
  //           func: () => {
  //             if (pageType === "solo") {
  //               setVoteModalType("free");
  //               return;
  //             }
  //             if (hasOtherStudy) {
  //               toast("warning", "다른 스터디에 참여중입니다.");
  //               return;
  //             }
  //             if (
  //               findStudy?.members.filter((member) => member?.attendance.type !== "absenced")
  //                 .length >= 8
  //             ) {
  //               toast("warning", "인원이 마감되었습니다.");
  //               return;
  //             }
  //             setIsTimeRulletModal(true);
  //           },
  //         },
  //   arrived: { text: "출석 완료", type: "multi", colorScheme: "black" },
  //   absenced: { text: "당일 불참", type: "single", colorScheme: "red" },
  // };

  const handleAction = () => {
    setIsTimeRulletModal(false);

    // if (myStudyStatus === "pending") {
    //   vote({
    //     latitude: findStudy.place.latitude,
    //     longitude: findStudy.place.longitude,
    //     start: voteTime.start,
    //     end: voteTime.end,
    //   });
    //   return;
    // }

    // if (!myStudyInfo) {
    //   if (findStudy.status === "free") {
    //     const place = findStudy.place;
    //     realTimeVote({
    //       place: {
    //         latitude: place.latitude,
    //         longitude: place.longitude,
    //         name: place.name,
    //         address: place.address,
    //       },
    //       time: voteTime,
    //     });

    //     return;
    //   }
    //   participate({ placeId: id, ...voteTime });
    //   return;
    // }

    // if (myStudyStatus === "open") {
    //   change(voteTime);
    // } else {
    //   realTimeChange(voteTime);
    // }
  };

  const drawerOptions: BottomFlexDrawerOptions = {
    header: {
      title: "스터디 참여 시간 선택",
      subTitle: "예상 시작 시간과 종료 시간을 선택해 주세요",
    },
    footer: {
      text: "",
      // myStudyStatus === "pending"
      //   ? "신청 완료"
      //   : myStudyStatus === "open" || myStudyStatus === "free"
      //   ? "시간 변경"
      //   : "참여 완료",
      func: handleAction,
    },
  };

  // const onClickStudyVote = (voteTime: IStudyVoteTime) => {
  //   if (myStudyParticipation) {
  //     setVoteTime(voteTime);
  //     setAlertModalInfo({
  //       title: "스터디 장소 변경",
  //       subTitle: "장소를 변경하는 경우 기존에 투표 장소는 취소됩니다.",
  //       text: "변경합니다",
  //       func: () => {
  //         handleVote(voteTime);
  //         setAlertModalInfo(null);
  //       },
  //       subFunc: () => {
  //         setModalType(null);
  //         setAlertModalInfo(null);
  //       },
  //     });
  //     return;
  //   }
  //   handleVote(voteTime);
  // };
  // const handleVote = (time?: IStudyVoteTime) => {
  //   if (studyType === "public") {
  //     studyVote({
  //       place: id,
  //       subPlace: subArr.map((sub) => sub.place._id),
  //       start: time?.start || voteTime?.start,
  //       end: time?.end || voteTime?.end,
  //     });
  //   } else {
  //     realTimeStudyVote({
  //       place,
  //       time: {
  //         start: time?.start || voteTime?.start,
  //         end: time?.end || voteTime?.end,
  //       },
  //     });
  //   }
  // };

  const handleChangeTime = () => {
    setIsTimeRulletModal(true);
  };

  const navigationProps = getNavigationProps(studyType, myStatus);

  return (
    <>
      <Slide isFixed={true} posZero="top">
        {navigationProps && (
          <Flex
            borderTop="var(--border)"
            align="center"
            bg="white"
            h="calc(64px + env(safe-area-inset-bottom))"
            pt={2}
            pb="calc(8px + env(safe-area-inset-bottom))"
            px={5}
          >
            {navigationProps.type === "multi" && (
              <>
                <IconTextColButton
                  icon={<XCircleIcon size="md" />}
                  text="당일 불참"
                  func={() => {
                    // if (myStudyStatus === "arrived" || myStudyStatus === "absenced") {
                    //   toast(
                    //     "info",
                    //     myStudyStatus === "arrived"
                    //       ? "이미 출석 처리되었습니다."
                    //       : "이미 결석 처리되었습니다.",
                    //   );
                    //   return;
                    // }
                    setIsAbsentModal(true);
                  }}
                />
                <IconTextColButton icon={<ClockIcon />} text="시간 변경" func={handleChangeTime} />
              </>
            )}
            <Button
              size="lg"
              flex={1}
              colorScheme={navigationProps.colorScheme}
              onClick={navigationProps?.func}
              isDisabled={!navigationProps?.func}
            >
              {navigationProps.text}
            </Button>
          </Flex>
        )}
      </Slide>
      {/* {(pageType === "recruiting" || pageType === "solo") && (
        <StudyControlDrawer
          date={date}
          studyDrawerType={voteModalType}
          onClose={() => setVoteModalType(null)}
          studyResults={null}
          currentLocation={null}
        />
      )} */}

      {/* {isAbsentModal && (
        <StudyAbsentModal
          studyType={myStudyStatus === "open" ? "voteStudy" : "realTimeStudy"}
          myStudyInfo={myStudyInfo}
          handleAbsence={(props) => {
            if (myStudyStatus === "open") absence(props);
            else realTimeCancel("cancel");
            setIsAbsentModal(false);
          }}
          setIsModal={setIsAbsentModal}
        />
      )} */}

      {alertModalInfo && (
        <AlertModal
          options={alertModalInfo}
          colorType="red"
          setIsModal={() => setAlertModalInfo(null)}
        />
      )}

      {/* {isTimeRulletModal && (
        <StudyVoteTimeRulletDrawer
          defaultVoteTime={
            myStudyInfo
              ? {
                  start: adjustTime30Minutes(dayjs(myStudyInfo.time.start)),
                  end: adjustTime30Minutes(dayjs(myStudyInfo.time.end)),
                }
              : findStudy?.status === "free"
              ? { start: dayjs(), end: dayjs() }
              : null
          }
          zIndex={300}
          setVoteTime={setVoteTime}
          setIsModal={setIsTimeRulletModal}
          drawerOptions={drawerOptions}
        />
      )} */}
      {(drawerType === "apply" || drawerType === "applyChange") && (
        <StudyApplyDrawer
          onClose={() => setDrawerType(null)}
          defaultDate={date}
          defaultCoordinates={defaultCoordinates}
          canChange={drawerType === "applyChange"}
        />
      )}
    </>
  );
}

export default StudyNavigation;

const adjustTime30Minutes = (time: Dayjs) => {
  const ceiled = time.minute(Math.ceil(time.minute() / 30) * 30).second(0);
  const adjusted = ceiled.minute() === 60 ? ceiled.add(1, "hour").minute(0) : ceiled;
  return adjusted;
};
