import { Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRecoilValue } from "recoil";

import AlertModal, { IAlertModalOptions } from "../../components/AlertModal";
import IconTextColButton from "../../components/atoms/buttons/IconTextColButton";
import { XCircleIcon } from "../../components/Icons/CircleIcons";
import { ClockIcon } from "../../components/Icons/ClockIcons";
import Slide from "../../components/layouts/PageSlide";
import { BottomFlexDrawerOptions } from "../../components/organisms/drawer/BottomFlexDrawer";
import StudyVoteTimeRulletDrawer from "../../components/services/studyVote/StudyVoteTimeRulletDrawer";
import { useResetStudyQuery } from "../../hooks/custom/CustomHooks";
import { useToast, useTypeToast } from "../../hooks/custom/CustomToast";
import {
  useRealTimeCancelMutation,
  useRealTimeTimeChangeMutation,
  useRealtimeVoteMutation,
} from "../../hooks/realtime/mutations";
import { useStudyParticipationMutation } from "../../hooks/study/mutations";
import { ModalLayout } from "../../modals/Modals";
import StudyAbsentModal from "../../modals/study/StudyAbsentModal";
import { myStudyParticipationState } from "../../recoils/studyRecoils";
import { StudyMemberProps, StudyStatus } from "../../types/models/studyTypes/studyDetails";
import { IAbsence, IStudyVoteTime } from "../../types/models/studyTypes/studyInterActions";
import { PlaceInfoProps } from "../../types/models/utilTypes";
import { LocationEn } from "../../types/services/locationTypes";
import { iPhoneNotchSize } from "../../utils/validationUtils";

interface IStudyNavigation {
  date: string;

  myStudyInfo: StudyMemberProps;
  absences: IAbsence[];
  placeInfo: PlaceInfoProps;
  type: "private" | "public" | null;
  status: StudyStatus;
  locationEn: LocationEn;
}

export type StudyModalType = "timeRullet";

type UserStudyStatus = "pending" | "voting" | "attended" | "cancelled" | "expired";

function StudyNavigation({
  locationEn,
  placeInfo,
  myStudyInfo,
  absences,
  status,
  type: studyType,
}: IStudyNavigation) {
  const router = useRouter();
  const toast = useToast();
  const typeToast = useTypeToast();
  const { data: session } = useSession();
  const { id, date } = useParams<{ id: string; date: string }>() || {};
  const searchParams = useSearchParams();

  const resetStudy = useResetStudyQuery();

  // const isGuest = session?.user.name === "guest";

  const myStudyParticipation = useRecoilValue(myStudyParticipationState);

  const [modalType, setModalType] = useState<StudyModalType>();

  const [voteTime, setVoteTime] = useState<IStudyVoteTime>();
  const [isCancelModal, setIsCancelModal] = useState(false);
  const [isAbsentModal, setIsAbsentModal] = useState(false);
  const [alertModalInfo, setAlertModalInfo] = useState<IAlertModalOptions>();

  const { mutate: realTimeStudyVote, isLoading: isLoading2 } = useRealtimeVoteMutation({
    onSuccess() {
      handleSuccess("vote");
    },
  });
  const { mutate: studyVote, isLoading: isLoading1 } = useStudyParticipationMutation(
    dayjs(),
    "post",
    {
      onSuccess() {
        handleSuccess("vote");
      },
    },
  );
  const { mutate: handleTimeChange } = useStudyParticipationMutation(dayjs(date), "patch", {
    onSuccess() {
      handleSuccess("change");
    },
  });
  const { mutate: handleCancel } = useStudyParticipationMutation(dayjs(date), "delete", {
    onSuccess() {
      handleSuccess("cancel");
    },
  });
[]
  const { mutate: handleRealTimeCancel } = useRealTimeCancelMutation({
    onSuccess() {
      handleSuccess("cancel");
      router.push(`/studyPage?${searchParams.toString()}`);
    },
  });
  const { mutate: handleRealTimeTimeChange } = useRealTimeTimeChangeMutation({
    onSuccess() {
      handleSuccess("change");
    },
  });

  const myStudyStatus = getMyStudyStatus(myStudyInfo, absences, session?.user.uid, date);
  const { text, type, colorScheme } = getStudyNavigationProps(myStudyStatus) || {};

  const handleSuccess = (type: "vote" | "cancel" | "change") => {
    if (type === "vote") typeToast("vote");
    else if (type === "cancel") toast("success", "취소되었습니다");
    else if (type === "change") toast("success", "변경되었습니다");
    resetStudy();
    setModalType(null);
  };

  const handleNavButton = (type: "main" | "cancel" | "timeChange") => {
    if (type === "main") {
      if (myStudyStatus === "pending") {
        setModalType("timeRullet");
      } else if (myStudyStatus === "voting") {
        router.push(
          `/vote/attend/${status === "open" ? `configuration` : `certification`}?${searchParams.toString()}`,
        );
      }
    } else if (type === "timeChange") {
      setModalType("timeRullet");
    } else if (type == "cancel") {
      if (myStudyInfo?.attendanceInfo.arrived) {
        toast("warning", "이미 출석을 완료했습니다");
        return;
      }
      if (status === "pending") {
        setIsCancelModal(true);
      } else {
        setIsAbsentModal(true);
      }
    }
  };

  const handleVote = (time?: IStudyVoteTime) => {
    if (studyType === "public") {
      studyVote({
        place: id,
        start: time?.start || voteTime?.start,
        end: time?.end || voteTime?.end,
      });
    } else {
      realTimeStudyVote({
        place: placeInfo,
        time: {
          start: time?.start || voteTime?.start,
          end: time?.end || voteTime?.end,
        },
      });
    }
  };

  const onClickStudyVote = (voteTime: IStudyVoteTime) => {
    if (myStudyParticipation) {
      setVoteTime(voteTime);
      setAlertModalInfo({
        title: "스터디 장소 변경",
        subTitle: "장소를 변경하는 경우 기존에 투표 장소는 취소됩니다.",
        text: "변경합니다",
        func: () => {
          handleVote(voteTime);
        },
        subFunc: () => {
          setModalType(null);
          setAlertModalInfo(null);
        },
      });
      return;
    }
    handleVote(voteTime);
  };

  const drawerOptions: BottomFlexDrawerOptions = {
    header: {
      title: "스터디 참여 시간 선택",
      subTitle: "예상 시작 시간과 종료 시간을 선택해 주세요!",
    },
    footer: {
      text: myStudyInfo ? "시간 변경" : "신청 완료",
      func: myStudyInfo
        ? studyType === "public"
          ? () => handleTimeChange(voteTime)
          : () => handleRealTimeTimeChange(voteTime)
        : () => onClickStudyVote(voteTime),
      loading: isLoading1 || isLoading2,
    },
  };

  return (
    <>
      <Slide isFixed={true} posZero="top">
        <Flex
          borderTop="var(--border)"
          align="center"
          bg="white"
          h={`${64 + iPhoneNotchSize()}px`}
          py={2}
          px={5}
        >
          {type === "multi" && (
            <>
              <IconTextColButton
                icon={<XCircleIcon size="md" />}
                text="참여 취소"
                func={() => handleNavButton("cancel")}
              />
              <IconTextColButton
                icon={<ClockIcon />}
                text="시간 변경"
                func={() => handleNavButton("timeChange")}
              />
            </>
          )}
          <Button
            size="lg"
            flex={1}
            colorScheme={colorScheme}
            onClick={() => handleNavButton("main")}
          >
            {text}
          </Button>
        </Flex>
      </Slide>
      {modalType === "timeRullet" && (
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
          setIsModal={() => setModalType(null)}
          drawerOptions={drawerOptions}
        />
      )}
      {alertModalInfo && (
        <AlertModal
          options={alertModalInfo}
          colorType="red"
          setIsModal={() => setAlertModalInfo(null)}
        />
      )}
      {isAbsentModal && <StudyAbsentModal setIsModal={setIsAbsentModal} />}

      {isCancelModal && (
        <ModalLayout
          setIsModal={setIsCancelModal}
          footerOptions={{
            main: {
              text: "장소 변경",
              func: () => {
                router.replace(`/studyPage?location=${locationEn}&date=${date}&voteDrawer=up  `);
              },
            },
            sub: {
              text: "참여 취소",
              func: () => {
                setIsCancelModal(false);
                if (studyType === "public") handleCancel();
                else if (studyType === "private") handleRealTimeCancel();
              },
            },
          }}
          title="참여를 취소하시겠어요?"
        >
          스터디 장소를 변경해 보는 건 어떨까요?
        </ModalLayout>
      )}
    </>
  );
}

const getMyStudyStatus = (
  myStudyInfo: StudyMemberProps,
  absences: IAbsence[],
  myUid: string,
  date: string,
): UserStudyStatus => {
  if (!myUid) return undefined;
  if (myStudyInfo?.attendanceInfo.arrived) return "attended";
  else if (absences?.map((absence) => absence.user.uid).includes(myUid)) return "cancelled";
  else if (dayjs(date).endOf("day").isBefore(dayjs())) return "expired";
  else if (myStudyInfo) return "voting";
  else if (!myStudyInfo) return "pending";
};

const getStudyNavigationProps = (
  myStudyStatus: UserStudyStatus,
): { type: "single" | "multi"; text: string; colorScheme: string } => {
  switch (myStudyStatus) {
    case "voting":
      return { text: "출석 체크", type: "multi", colorScheme: "mint" };
    case "attended":
      return { text: "출석 완료", type: "multi", colorScheme: "black" };
    case "cancelled":
      return { text: "당일 불참", type: "multi", colorScheme: "gray" };
    case "pending":
      return { text: "스터디 투표", type: "single", colorScheme: "mint" };
    case "expired":
      return { text: "기간 만료", type: "single", colorScheme: "gray" };
  }
};

export default StudyNavigation;
