import { Button, Flex, ThemeTypings } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";

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
import { evaluateMyStudyStatus } from "../../libs/study/studyEvaluators";
import { findMyStudyInfo } from "../../libs/study/studySelectors";
import StudyAbsentModal from "../../modals/study/StudyAbsentModal";
import { StudyMergeResultProps } from "../../types/models/studyTypes/derivedTypes";
import { MyStudyStatus } from "../../types/models/studyTypes/helperTypes";
import { DayjsTimeProps } from "../../types/utils/timeAndDate";
import { iPhoneNotchSize } from "../../utils/validationUtils";

interface IStudyNavigation {
  date: string;
  findStudy: StudyMergeResultProps;
  hasOtherStudy: boolean;
  id: string;
  isVoting: boolean;
}

interface NavigationProps {
  type: "single" | "multi";
  text: string;
  colorScheme: ThemeTypings["colorSchemes"];
  func?: () => void;
}

function StudyNavigation({ id, date, findStudy, hasOtherStudy, isVoting }: IStudyNavigation) {
  const router = useRouter();
  const toast = useToast();

  const { data: session } = useSession();

  const { data: userInfo } = useUserInfoQuery();
  console.log(31, isVoting, findStudy);
  const {
    voteStudy: { vote, participate, change, absence, cancel },
    realTimeStudy: { vote: realTimeVote, change: realTimeChange, cancel: realTimeCancel },
  } = useStudyMutations(dayjs(date));

  const [isTimeRulletModal, setIsTimeRulletModal] = useState(false);
  const [voteTime, setVoteTime] = useState<DayjsTimeProps>();
  const [isAbsentModal, setIsAbsentModal] = useState(false);
  const [alertModalInfo, setAlertModalInfo] = useState<IAlertModalOptions>();

  const myStudyInfo = findMyStudyInfo(findStudy, session?.user.id);

  const myStudyStatus = evaluateMyStudyStatus(findStudy, session?.user.id, date, isVoting);
  console.log(myStudyStatus);
  const NAVIGATION_PROPS_MAPPING: Record<Exclude<MyStudyStatus, "expired">, NavigationProps> = {
    pending: {
      text: "참여 신청",
      type: "single",
      colorScheme: "mint",
      func: () => setIsTimeRulletModal(true),
    },
    voting: {
      text: "참여 취소",
      type: "single",
      colorScheme: "red",
      func: () => cancel(),
    },
    open: {
      text: "출석 체크",
      type: "multi",
      colorScheme: "mint",
      func: () => router.push(`/vote/attend/configuration?date=${date}&id=${id}`),
    },
    free: {
      text: "출석 체크",
      type: "multi",
      colorScheme: "mint",
      func: () => router.push(`/vote/attend/certification?date=${date}&id=${id}`),
    },
    todayPending: {
      text: "스터디 참여",
      type: "single",
      colorScheme: "mint",
      func: () => {
        if (hasOtherStudy) {
          toast("warning", "다른 스터디에 참여중입니다.");
          return;
        }
        setIsTimeRulletModal(true);
      },
    },
    arrived: { text: "출석 완료", type: "multi", colorScheme: "black" },
    absenced: { text: "당일 불참", type: "single", colorScheme: "red" },
  };
  const navigationProps: NavigationProps = NAVIGATION_PROPS_MAPPING[myStudyStatus];

  const handleAction = () => {
    setIsTimeRulletModal(false);

    if (myStudyStatus === "pending") {
      const { locationDetail } = userInfo;
      vote({
        latitude: locationDetail.lat,
        longitude: locationDetail.lon,
        start: voteTime.start,
        end: voteTime.end,
      });

      return;
    }

    if (!myStudyInfo) {
      if (findStudy.status === "free") {
        const place = findStudy.place;
        realTimeVote({
          place: {
            latitude: place.latitude,
            longitude: place.longitude,
            name: place.name,
            address: place.address,
          },
          time: voteTime,
        });

        return;
      }
      participate({ placeId: id, ...voteTime });
      return;
    }

    if (myStudyStatus === "open") {
      change(voteTime);
    } else {
      realTimeChange(voteTime);
    }
  };
  console.log(myStudyStatus);
  const drawerOptions: BottomFlexDrawerOptions = {
    header: {
      title: "스터디 참여 시간 선택",
      subTitle: "예상 시작 시간과 종료 시간을 선택해 주세요",
    },
    footer: {
      text:
        myStudyStatus === "pending"
          ? "신청 완료"
          : myStudyStatus === "open" || myStudyStatus === "free"
          ? "시간 변경"
          : "참여 완료",
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

  return (
    <>
      <Slide isFixed={true} posZero="top">
        {navigationProps && (
          <Flex
            borderTop="var(--border)"
            align="center"
            bg="white"
            h={`${64 + iPhoneNotchSize()}px`}
            pt={2}
            pb={`${8 + iPhoneNotchSize()}px`}
            px={5}
          >
            {navigationProps.type === "multi" && (
              <>
                <IconTextColButton
                  icon={<XCircleIcon size="md" />}
                  text="당일 불참"
                  func={() => {
                    if (myStudyStatus === "arrived" || myStudyStatus === "absenced") {
                      toast(
                        "info",
                        myStudyStatus === "arrived"
                          ? "이미 출석 처리되었습니다."
                          : "이미 결석 처리되었습니다.",
                      );
                      return;
                    }
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

      {isAbsentModal && (
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
      )}

      {alertModalInfo && (
        <AlertModal
          options={alertModalInfo}
          colorType="red"
          setIsModal={() => setAlertModalInfo(null)}
        />
      )}

      {isTimeRulletModal && (
        <StudyVoteTimeRulletDrawer
          defaultVoteTime={
            myStudyInfo
              ? {
                  start: dayjs(myStudyInfo.time.start),
                  end: dayjs(myStudyInfo.time.end),
                }
              : null
          }
          zIndex={300}
          setVoteTime={setVoteTime}
          setIsModal={setIsTimeRulletModal}
          drawerOptions={drawerOptions}
        />
      )}
    </>
  );
}

export default StudyNavigation;
