import { Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";

import { IAlertModalOptions } from "../../components/AlertModal";
import IconTextColButton from "../../components/atoms/buttons/IconTextColButton";
import { IIconLinkTile } from "../../components/atoms/IconLinkTile";
import { XCircleIcon } from "../../components/Icons/CircleIcons";
import { ClockIcon } from "../../components/Icons/ClockIcons";
import Slide from "../../components/layouts/PageSlide";
import { STUDY_CHECK_POP_UP } from "../../constants/keys/localStorage";
import { useResetStudyQuery } from "../../hooks/custom/CustomHooks";
import { useToast, useTypeToast } from "../../hooks/custom/CustomToast";
import { useStudyParticipationMutation } from "../../hooks/study/mutations";
import { usePointSystemMutation } from "../../hooks/user/mutations";
import { usePointSystemLogQuery } from "../../hooks/user/queries";
import { myStudyParticipationState, studyDateStatusState } from "../../recoils/studyRecoils";
import {
  StudyMemberProps,
  StudyMergeParticipationProps,
  StudyStatus,
  StudyUserStatus,
} from "../../types/models/studyTypes/studyDetails";
import { IAbsence, StudyDateStatus } from "../../types/models/studyTypes/studyInterActions";
import { IPointLog } from "../../types/services/pointSystem";
import { iPhoneNotchSize } from "../../utils/validationUtils";

interface IStudyNavigation {
  memberCnt: number;
  mergeParticipations: StudyMergeParticipationProps[];
  myStudyInfo: StudyMemberProps;
  absences: IAbsence[];
}

type MainBtnType = "vote" | "freeOpen" | "attendCheck";
type SubNavBtn = "changeTime" | "absent" | "cancelVote";
export type StudyModalType = MainBtnType | SubNavBtn;

type UserStudyStatus = "pending" | "voting" | "attended" | "cancelled" | "expired";

function StudyNavigation({
  mergeParticipations,
  memberCnt,
  myStudyInfo,
  absences,
}: IStudyNavigation) {
  const router = useRouter();
  const toast = useToast();
  const typeToast = useTypeToast();
  const { data: session } = useSession();
  const { id, date } = useParams<{ id: string; date: string }>() || {};
  const searchParams = useSearchParams();
  const isPrivate = searchParams.get("isPrivate");
  const isFree = searchParams.get("isFree");
  const resetStudy = useResetStudyQuery();

  const isGuest = session?.user.name === "guest";

  const uid = session?.user.uid;

  const studyDateStatus = useRecoilValue(studyDateStatusState);
  const myStudyParticipation = useRecoilValue(myStudyParticipationState);

  const votingType = getVotingType(myStudyParticipation, id);

  const [modalType, setModalType] = useState<StudyModalType>();
  const [modalOptions, setModalOptions] = useState<IAlertModalOptions>();

  const isAttend = checkMyAttend(studyDateStatus, myStudyParticipation, uid);
  const isSubNav = checkSubNavExists(studyDateStatus, votingType, isAttend);

  const { mutate: getPoint } = usePointSystemMutation("point");

  const { data: pointLog } = usePointSystemLogQuery("point", true, {
    enabled: !!isSubNav,
  });
  const myPrevVotePoint = getMyPrevVotePoint(pointLog, date);
  const { mutate: handleAbsent } = useStudyParticipationMutation(dayjs(date), "delete", {
    onSuccess() {
      resetStudy();
      if (myPrevVotePoint) {
        getPoint({
          message: "스터디 투표 취소",
          value: -myPrevVotePoint,
        });
      }
      toast("success", "취소되었습니다.");
    },
    onError: () => typeToast("error"),
  });

  useEffect(() => {
    if (isPrivate === "on") setModalType("vote");
    if (isFree === "on") setModalType("freeOpen");
  }, [isPrivate, isFree]);

  const myStudyStatus = getMyStudyStatus(myStudyInfo, absences, session?.user.uid, date);
  const { text, type, colorScheme } = getStudyNavigationProps(myStudyStatus);

  const hasDismissedStudy = localStorage.getItem(STUDY_CHECK_POP_UP) === date;

  // const { text: mainText, funcType: mainFuncType } = getMainButtonStatus(
  //   memberCnt >= MAX_USER_PER_PLACE,
  //   studyDateStatus,
  //   votingType,
  //   isAttend,
  //   studyStatus,
  //   PLACE_TO_NAME[id] === "개인 스터디",
  //   hasDismissedStudy,
  // );

  const handleSubNav = (type: SubNavBtn) => {
    if (isGuest) {
      typeToast("guest");
      return;
    }
    if (type === "cancelVote") {
      if (studyDateStatus !== "not passed") {
        toast("error", "스터디 확정 이후에는 당일 불참만 가능합니다.");
        return;
      } else {
        setModalOptions({
          title: "참여 취소",
          subTitle: "스터디 신청을 취소하시겠습니까?",
          func: () => handleAbsent(),
        });
      }
    }

    if (type === "absent" && studyDateStatus === "not passed") {
      toast("error", "스터디 확정 이후부터 사용이 가능합니다.");
      return;
    }

    setModalType(type);
  };

  const handleMainButton = (type: MainBtnType) => {
    if (isGuest) {
      typeToast("guest");
      return;
    }
    // if (type === "attendCheck") {
    //   if (myStudy.status === "open") {
    //   } else if (myStudy.status === "free") {
    //   }

    //   return;
    // }
    setModalType(type);
  };

  const subNavOptions: IIconLinkTile[] = [
    {
      icon: <i className="fa-light fa-circle-xmark fa-xl" />,
      text: "참여 취소",
      func: () => handleSubNav("cancelVote"),
    },
    {
      icon: <i className="fa-light fa-clock fa-xl" />,
      text: "시간 변경",
      func: () => handleSubNav("changeTime"),
    },
    {
      icon: <i className="fa-light fa-ban fa-xl" />,
      text: "당일 불참",
      func: () => handleSubNav("absent"),
    },
  ];

  const handleNavButton = (type: "vote" | "attend" | "cancel" | "timeChange") => {
    switch (type) {
      case "vote":
    }
  };

  return (
    <>
      <Slide isFixed={true} posZero="top">
        <Flex
          borderTop="var(--border)"
          align="center"
          bg="white"
          h={`${64 + iPhoneNotchSize()}px`}
          mt={3}
          py={2}
          px={5}
        >
          {type === "multi" && (
            <>
              <IconTextColButton icon={<XCircleIcon size="md" />} text="참여 취소" />
              <IconTextColButton icon={<ClockIcon />} text="시간 변경" />
            </>
          )}
          <Button size="lg" flex={1} colorScheme={colorScheme}>
            {text}
          </Button>
        </Flex>
      </Slide>

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

const getMyPrevVotePoint = (pointLogs: IPointLog[], date: string) => {
  return pointLogs?.find((item) => item.message === "스터디 투표" && item.meta.sub === date)?.meta
    .value;
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

const getMainButtonStatus = (
  isMax: boolean,
  studyDateStatus: StudyDateStatus,
  votingType: "same" | "other" | null,
  isAttend: boolean,
  studyStatus: StudyStatus | StudyUserStatus,
): {
  text: string;
  funcType?: MainBtnType;
} => {
  if (isAttend) return { text: "출석 완료" };

  switch (studyDateStatus) {
    case "passed":
      return { text: "기간 만료" };
    case "not passed":
      if (votingType) return { text: "투표 완료" };
      if (isMax) return { text: "인원 마감" };
      return { text: "스터디 투표", funcType: "vote" };
    case "today":
      if (studyStatus === "dismissed") return { text: "FREE 오픈 신청", funcType: "freeOpen" };
      if (votingType === "same") return { text: "출석 체크", funcType: "attendCheck" };
      if (votingType === "other") return { text: "다른 스터디에 참여중입니다." };
      if (isMax) return { text: "인원 마감" };
      return { text: "스터디 투표", funcType: "vote" };
  }
};

const Layout = styled.nav`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 16px;
  background-color: white;
  z-index: 50;
  box-shadow:
    0 -1px 3px 0 rgba(0, 0, 0, 0.1),
    0 -1px 2px 0 rgba(0, 0, 0, 0.06);
  max-width: var(--max-width);
  margin: 0 auto;
`;

const Wrapper = styled.div`
  padding: 0 20px;
  padding-bottom: 12px;
`;

export default StudyNavigation;
