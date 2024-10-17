import { Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
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
import { useRealtimeVoteMutation } from "../../hooks/realtime/mutations";
import { useStudyParticipationMutation } from "../../hooks/study/mutations";
import { myStudyParticipationState } from "../../recoils/studyRecoils";
import {
  StudyMemberProps,
  StudyMergeParticipationProps,
  StudyStatus,
} from "../../types/models/studyTypes/studyDetails";
import {
  IAbsence,
  IStudyVoteTime,
  StudyDateStatus,
} from "../../types/models/studyTypes/studyInterActions";
import { PlaceInfoProps } from "../../types/models/utilTypes";
import { iPhoneNotchSize } from "../../utils/validationUtils";

interface IStudyNavigation {
  mergeParticipations: StudyMergeParticipationProps[];
  myStudyInfo: StudyMemberProps;
  absences: IAbsence[];
  placeInfo: PlaceInfoProps;
  type: "private" | "public" | null;
  status: StudyStatus;
}

export type StudyModalType = "timeRullet";

type UserStudyStatus = "pending" | "voting" | "attended" | "cancelled" | "expired";

function StudyNavigation({
  mergeParticipations,

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

  const isGuest = session?.user.name === "guest";

  const myStudyParticipation = useRecoilValue(myStudyParticipationState);

  const [modalType, setModalType] = useState<StudyModalType>();

  const [voteTime, setVoteTime] = useState<IStudyVoteTime>();
  const [isAlertMoal, setIsAlertModal] = useState(false);

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

  const myStudyStatus = getMyStudyStatus(myStudyInfo, absences, session?.user.uid, date);
  const { text, type, colorScheme } = getStudyNavigationProps(myStudyStatus);

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
      if (status === "pending") handleCancel();
      else {
        setAlertModalInfo({
          title: "스터디 참여 취소",
          subTitle: "",
          func: () => {},
        });
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
      setIsAlertModal(true);
      return;
    }
    handleVote(voteTime);
  };

  const drawerOptions: BottomFlexDrawerOptions = {
    header: {
      title: dayjs(date).locale("ko").format("M월 D일 ddd요일"),
      subTitle: "스터디 참여시간을 선택해주세요!",
    },
    footer: {
      text: myStudyInfo ? "시간 변경" : "신청 완료",
      func: myStudyInfo ? () => handleTimeChange(voteTime) : () => onClickStudyVote(voteTime),
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
          setVoteTime={setVoteTime}
          setIsModal={() => setModalType(null)}
          drawerOptions={drawerOptions}
        />
      )}
      {alertModalInfo && (
        <AlertModal options={alertModalInfo} setIsModal={() => setAlertModalInfo(null)} />
      )}
      {/* <StudySimpleVoteModal studyVoteData={[]} /> */}
      {/* <StudyAttendCheckModal /> */}
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
      return { text: "불 참", type: "multi", colorScheme: "red" };
    case "pending":
      return { text: "스터디 투표", type: "single", colorScheme: "mint" };
    case "expired":
      return { text: "기간 만료", type: "single", colorScheme: "gray" };
  }
};

const getVotingType = (myStudy: StudyMergeParticipationProps, placeId: string) => {
  return !myStudy ? null : myStudy?.place?._id === placeId ? "same" : "other";
};

const checkMyAttend = (
  studyDateStatus: StudyDateStatus,
  myStudy: StudyMergeParticipationProps,
  uid: string,
) => {
  return !!(
    studyDateStatus !== "not passed" &&
    myStudy?.members.find((who) => who.user.uid === uid)?.attendanceInfo?.arrived
  );
};

const checkSubNavExists = (
  studyDateStatus: StudyDateStatus,
  votingType: "same" | "other" | null,
  isAttend: boolean,
): boolean => {
  if (isAttend) return false;
  switch (studyDateStatus) {
    case "passed":
      return false;
    case "not passed":
      if (votingType) return true;
      break;
    case "today": {
      if (votingType === "same") return true;
      return false;
    }
  }
};

export default StudyNavigation;
