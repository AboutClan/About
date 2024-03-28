import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import ShadowCircleButton, {
  IShadowCircleProps,
} from "../../../components2/atoms/buttons/ShadowCircleButton";
import { useTypeToast } from "../../../hooks/custom/CustomToast";

import {
  myStudyState,
  studyDateStatusState,
} from "../../../recoils/studyRecoils";
import { DispatchType } from "../../../types2/reactTypes";
import { StudyDateStatus } from "../../../types2/studyTypes/studySubTypes";
import { IParticipation } from "../../../types2/studyTypes/studyVoteTypes";
import { VoteType } from "./StudyController";

export type StudyVoteActionType =
  | "참여 신청"
  | "투표 변경"
  | "출석 체크"
  | "출석 완료"
  | "당일 불참"
  | "기간 만료"
  | "당일 참여";

const ACTION_TO_VOTE_TYPE: Record<StudyVoteActionType, VoteType> = {
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

function StudyControllerVoteButton({
  setModalType,
}: IStudyControllerVoteButton) {
  const typeToast = useTypeToast();
  const router = useRouter();
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);
  const isGuest = session?.user.name === "guest";

  const studyDateStatus = useRecoilValue(studyDateStatusState);
  const myStudy = useRecoilValue(myStudyState);

  const buttonProps = getStudyVoteButtonProps(
    studyDateStatus,
    myStudy,
    session?.user.uid
  );

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
    <>
      <ButtonWrapper className="main_vote_btn">
        <ShadowCircleButton
          buttonProps={buttonProps}
          onClick={handleModalOpen}
        />
      </ButtonWrapper>
    </>
  );
}

interface IReturn extends IShadowCircleProps {
  text: StudyVoteActionType;
}

export const getStudyVoteButtonProps = (
  studyDateStatus: StudyDateStatus,
  myStudy: IParticipation | null,
  myUid?: string
): IReturn => {
  const isAttend = myStudy?.attendences.find(
    (who) => who.user.uid === myUid
  )?.arrived;

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
        color: "var(--gray-5)",
        shadow: "var(--gray-7)",
      };
    default:
      return {
        text: "참여 신청",
        color: "var(--color-mint)",
        shadow: "var(--color-mint-light)",
      };
  }
};

const ButtonWrapper = styled.div`
  background-color: white;
  border-radius: 50%; /* rounded-full */

  display: flex;
  justify-content: center;
  align-items: center;
  padding: 6px;

  /* Custom after pseudo-element */
  &::after {
    content: "";
    /* Define your custom styles for the after pseudo-element here */
  }
`;

export default StudyControllerVoteButton;
