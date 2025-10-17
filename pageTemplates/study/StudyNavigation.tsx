import { Button, Flex, ThemeTypings } from "@chakra-ui/react";
import dayjs, { Dayjs } from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import AlertModal, { IAlertModalOptions } from "../../components/AlertModal";
import IconTextColButton from "../../components/atoms/buttons/IconTextColButton";
import { XCircleIcon } from "../../components/Icons/CircleIcons";
import { ClockIcon } from "../../components/Icons/ClockIcons";
import Slide from "../../components/layouts/PageSlide";
import { BottomFlexDrawerOptions } from "../../components/organisms/drawer/BottomFlexDrawer";
import StudyVoteTimeRulletDrawer from "../../components/services/studyVote/StudyVoteTimeRulletDrawer";
import { useToast } from "../../hooks/custom/CustomToast";
import { useStudyMutations } from "../../hooks/custom/StudyHooks";
import { useUserInfoQuery } from "../../hooks/user/queries";
import StudyAbsentModal from "../../modals/study/StudyAbsentModal";
import { LocationProps } from "../../types/common";
import {
  MyStudyStatus,
  StudyConfirmedMemberProps,
  StudyConfirmedProps,
  StudyParticipationProps,
} from "../../types/models/studyTypes/study-entity.types";
import { StudyType } from "../../types/models/studyTypes/study-set.types";
// import { MyStudyStatus } from "../../types/models/studyTypes/helperTypes";
import { DayjsTimeProps } from "../../types/utils/timeAndDate";
import { dayjsToStr } from "../../utils/dateTimeUtils";
import StudyApplyDrawer from "../vote/voteDrawer/StudyApplyDrawer";

interface IStudyNavigation {
  myStudyInfo: StudyConfirmedMemberProps | StudyParticipationProps[];
  date: string;
  id: string;
  studyType: StudyType;
  location: LocationProps;
  myStudyStatus: MyStudyStatus;
  findStudy: StudyConfirmedProps;
  tempCheck: boolean;
}

interface NavigationProps {
  type: "single" | "multi";
  text: string;
  colorScheme: ThemeTypings["colorSchemes"];
  func?: () => void;
}

type DirectAction = "openRealTimesVote" | "dailyVote" | "timeChange" | "expectedVote";

function StudyNavigation({
  id,
  date,
  myStudyInfo,
  myStudyStatus,
  location,
  studyType,
  findStudy,
  tempCheck,
}: IStudyNavigation) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const drawerTypeParam = searchParams.get("drawer") as "apply";

  const toast = useToast();

  const { data: userInfo } = useUserInfoQuery();
  const {
    voteStudy: { vote, participate, change },
    realTimeStudy: { vote: realTimesVote, change: realTimeChange, cancel: realTimeCancel },
    isLoading,
  } = useStudyMutations(dayjs(date));

  const resultStatus = findStudy?.status;

  const [voteTime, setVoteTime] = useState<DayjsTimeProps>();
  const [isAbsentModal, setIsAbsentModal] = useState(false);
  const [alertModalInfo, setAlertModalInfo] = useState<IAlertModalOptions>();

  const [drawerType, setDrawerType] = useState<
    "apply" | "applyChange" | "realTimesVote" | DirectAction
  >(null);

  useEffect(() => {
    if (drawerTypeParam === "apply") {
      setDrawerType("apply");
    }
  }, [drawerTypeParam]);

  // const myStudyInfo = findMyStudyInfo(findStudy, session?.user.id);

  // const myStudyStatus = evaluateMyStudyStatus(findStudy, session?.user.id, pageType, isVoting);

  const getNavigationProps = (studyType: StudyType, myStatus: MyStudyStatus): NavigationProps => {
    if (
      (myStudyInfo as StudyConfirmedMemberProps)?.attendance?.type ||
      dayjs(date).startOf("day").isBefore(dayjs().startOf("day"))
    ) {
      return null;
    }

    switch (studyType) {
      case "participations":
        if (myStatus === "pending" || tempCheck) {
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
        break;
      case "openRealTimes":
        if (myStatus === "pending") {
          return {
            text: "스터디 참여",
            type: "single",
            colorScheme: "mint",
            func: () => {
              setDrawerType("openRealTimesVote");
            },
          };
        } else if (myStatus === "participation") {
          if (date === dayjsToStr(dayjs())) {
            return {
              text: "출석 체크",
              type: "multi",
              colorScheme: "mint",
              func: () =>
                router.push(`/vote/attend/configuration?date=${date}&id=${id}&type=openRealTimes`),
            };
          }

          if (findStudy?.members?.[0]?.user._id === userInfo?._id) {
            return {
              text: "개설 취소",
              type: "single",
              colorScheme: "red",
              func: () => {
                setAlertModalInfo({
                  title: "스터디 개설 취소",
                  children2: (
                    <>
                      스터디 개설을 취소하시겠어요?
                      <br />
                      개설 지원금이 회수됩니다.
                    </>
                  ),
                  text: "취소합니다",
                  defaultText: "닫 기",
                  func: () => {
                    realTimeCancel();
                    setTimeout(() => {
                      router.push(`/studyPage?date=${dayjsToStr(dayjs())}`);
                    }, 300);
                  },
                });
              },
            };
          }
          return {
            text: "참여 취소",
            type: "single",
            colorScheme: "red",
            func: () => {
              realTimeCancel();
            },
          };
        }
        break;
      case "results":
        if (myStatus === "pending") {
          if (myStudyStatus === "otherParticipation") {
            return {
              text: "다른 스터디에 참여중입니다",
              type: "single",
              colorScheme: "black",
            };
          }
          if (resultStatus === "expected") {
            return {
              text: "스터디 매칭 예정",
              type: "single",
              colorScheme: "black",
            };
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
          if (resultStatus === "expected") {
            return {
              text: "참여 날짜 변경/취소",
              type: "single",
              colorScheme: "mint",
              func: () => {
                setDrawerType("applyChange");
              },
            };
          }
          return {
            text: "출석 체크",
            type: "multi",
            colorScheme: "mint",
            func: () =>
              router.push(`/vote/attend/configuration?date=${date}&id=${id}&type=results`),
          };
        }
        break;
      case "soloRealTimes":
        if (myStatus === "pending") {
          if (myStudyStatus === "otherParticipation") {
            return {
              text: "다른 스터디에 참여중입니다",
              type: "single",
              colorScheme: "black",
            };
          }
          return {
            text: "공부 인증",
            type: "single",
            colorScheme: "mint",
            func: () => router.push(`/vote/attend/certification?date=${date}&type=soloRealTimes`),
          };
        } else if (myStatus === "participation") {
          return {
            text: "공부 인증",
            type: "single",
            colorScheme: "mint",
            func: () => router.push(`/vote/attend/configuration?date=${date}&type=soloRealTimes`),
          };
        }
        break;
      default:
        break;
    }
  };

  const handleDirectAction = (drawerType: DirectAction) => {
    switch (drawerType) {
      case "dailyVote":
        participate({ placeId: id, ...voteTime });
        // vote({
        //   latitude: findStudy.place.latitude,
        //   longitude: findStudy.place.longitude,
        //   start: voteTime.start,
        //   end: voteTime.end,
        // });
        break;
      case "expectedVote":
        vote({
          latitude: findStudy.place.location.latitude,
          longitude: findStudy.place.location.longitude,
          locationDetail: findStudy.place.location.address,
          start: voteTime.start,
          end: voteTime.end,
        });
        break;
      case "openRealTimesVote":
        realTimesVote({
          place: location,
          time: voteTime,
          status: "participation",
        });
        break;
      case "timeChange":
        if (studyType === "results") {
          change(voteTime);
        } else {
          realTimeChange(voteTime);
        }
        break;
    }
    setDrawerType(null);
  };

  const drawerOptions: BottomFlexDrawerOptions = {
    header: {
      title: "스터디 참여 시간 선택",
      subTitle: "예상 시작 시간과 종료 시간을 선택해 주세요",
    },
    footer: {
      text:
        drawerType === "timeChange"
          ? "시간 변경"
          : drawerType === "openRealTimesVote" || drawerType === "expectedVote"
          ? "신청 완료"
          : "참여 완료",
      func: () => handleDirectAction(drawerType as DirectAction),
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

  const navigationProps = getNavigationProps(studyType, myStudyStatus);

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
                <IconTextColButton
                  icon={<ClockIcon />}
                  text="시간 변경"
                  func={() => {
                    if (!myStudyInfo || studyType === "participations") {
                      toast("error", "참여 정보를 찾을 수 없습니다.");
                      return;
                    }
                    setDrawerType("timeChange");
                  }}
                />
              </>
            )}
            <Button
              size="lg"
              flex={1}
              colorScheme={navigationProps.colorScheme}
              onClick={navigationProps?.func}
              isDisabled={!navigationProps?.func}
              isLoading={isLoading}
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

      {isAbsentModal && (
        <StudyAbsentModal
          type={studyType === "results" ? "study" : "realTimes"}
          // studyType={myStudyStatus === "open" ? "voteStudy" : "realTimeStudy"}
          // myStudyInfo={myStudyInfo}

          setIsModal={setIsAbsentModal}
        />
      )}
      {alertModalInfo && (
        <AlertModal
          options={alertModalInfo}
          colorType="red"
          setIsModal={() => setAlertModalInfo(null)}
        />
      )}
      {(drawerType === "openRealTimesVote" ||
        drawerType === "dailyVote" ||
        drawerType === "expectedVote" ||
        drawerType === "timeChange") && (
        <StudyVoteTimeRulletDrawer
          defaultVoteTime={
            drawerType === "timeChange"
              ? {
                  start: adjustTime30Minutes(
                    dayjs((myStudyInfo as StudyConfirmedMemberProps).time.start),
                  ),
                  end: adjustTime30Minutes(
                    dayjs((myStudyInfo as StudyConfirmedMemberProps).time.end),
                  ),
                }
              : drawerType === "dailyVote"
              ? null
              : null
          }
          zIndex={300}
          setVoteTime={setVoteTime}
          setIsModal={() => setDrawerType(null)}
          drawerOptions={drawerOptions}
        />
      )}
      {(drawerType === "apply" || drawerType === "applyChange") && (
        <StudyApplyDrawer
          onClose={() => setDrawerType(null)}
          defaultDate={date}
          location={location}
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
