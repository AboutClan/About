import { Box } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRecoilValue } from "recoil";

import { IShadowCircleProps } from "../../../components/atoms/buttons/ShadowCircleButton";
import DateVoteBlock from "../../../components/molecules/DateVoteBlock";
import { useTypeToast } from "../../../hooks/custom/CustomToast";
import { myStudyState, studyDateStatusState } from "../../../recoils/studyRecoils";
import { DispatchType } from "../../../types/hooks/reactTypes";
import { IParticipation } from "../../../types/models/studyTypes/studyDetails";
import { StudyDateStatus } from "../../../types/models/studyTypes/studyInterActions";
import { VoteType } from "./StudyController";

export type StudyVoteActionType =
  | "참여 신청"
  | "투표 변경"
  | "출석 체크"
  | "출석 완료"
  | "당일 불참"
  | "기간 만료"
  | "당일 참여";

export const ACTION_TO_VOTE_TYPE: Record<StudyVoteActionType, VoteType> = {
  "참여 신청": "vote",
  "투표 변경": "voteChange",
  "출석 체크": "attendCheck",
  "출석 완료": "attendCompleted",
  "당일 불참": "absent",
  "기간 만료": "expired",
  "당일 참여": "todayVote",
};

interface IStudyControllerVoteButton {
  setModalType: DispatchType<VoteType>;
}

function StudyControllerVoteButton({ setModalType }: IStudyControllerVoteButton) {
  const typeToast = useTypeToast();
  const router = useRouter();
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);
  const isGuest = session?.user.name === "guest";

  const studyDateStatus = useRecoilValue(studyDateStatusState);
  const myStudy = useRecoilValue(myStudyState);

  const buttonProps = getStudyVoteButtonProps(studyDateStatus, myStudy, session?.user.uid);

  const handleModalOpen = () => {
    if (isGuest) {
      typeToast("guest");
      return;
    }
    const type = buttonProps.text;
    if (type === "참여 신청" || type === "투표 변경" || type === "당일 참여") {
      router.push(`/vote?${newSearchParams.toString()}`);
      return;
    }
    setModalType(ACTION_TO_VOTE_TYPE[type]);
  };

  return (
    <Box px="20px">
      <DateVoteBlock buttonProps={buttonProps} func={handleModalOpen} />
    </Box>
  );
}

export interface DateVoteButtonProps extends IShadowCircleProps {
  text: StudyVoteActionType;
}

export const getStudyVoteButtonProps = (
  studyDateStatus: StudyDateStatus,
  myStudy: IParticipation | null,
  myUid?: string,
): DateVoteButtonProps => {
  const isAttend = myStudy?.attendences.find((who) => who.user.uid === myUid)?.arrived;

  switch (studyDateStatus) {
    case "not passed":
      if (myStudy)
        return {
          text: "투표 변경",
          color: "#F6AD55",
          shadow: "#FEEBC8",
        };
      return {
        text: "참여 신청",
        color: "var(--color-mint)",
        shadow: "var(--color-mint-light)",
      };
    case "today":
      if (isAttend)
        return {
          text: "출석 완료",
          color: "#F6AD55",
          shadow: "#FEEBC8",
        };
      else if (false || myStudy)
        return {
          text: "출석 체크",
          color: "#00c2b3",
          shadow: "rgba(0, 194, 179, 0.1)",
        };
      return {
        text: "당일 참여",
        color: "var(--color-mint)",
        shadow: "var(--color-mint-light)",
      };
    case "passed":
      if (myStudy && isAttend)
        return {
          text: "출석 완료",
          color: "#F6AD55",
          shadow: "#FEEBC8",
        };
      else if (myStudy && myStudy.status !== "free")
        return {
          text: "당일 불참",
          color: "#FC8181",
          shadow: "#FED7D7",
        };
      return {
        text: "기간 만료",
        color: "var(--gray-400)",
        shadow: "var(--gray-200)",
      };
    default:
      return {
        text: "참여 신청",
        color: "var(--color-mint)",
        shadow: "var(--color-mint-light)",
      };
  }
};

export default StudyControllerVoteButton;
