import { Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRecoilValue } from "recoil";
import styled from "styled-components";

import { IShadowCircleProps } from "../../../components/atoms/buttons/ShadowCircleButton";
import { useTypeToast } from "../../../hooks/custom/CustomToast";
import { myStudyState, studyDateStatusState } from "../../../recoils/studyRecoils";
import { DispatchType } from "../../../types/hooks/reactTypes";
import { IParticipation } from "../../../types/models/studyTypes/studyDetails";
import { StudyDateStatus } from "../../../types/models/studyTypes/studyInterActions";
import { dayjsToFormat } from "../../../utils/dateTimeUtils";
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
    <Flex px="20px" className="main_vote_btn" h="69px" justify="space-between" align="center">
      <Box fontSize="16px" fontWeight={500}>
        <Box as="span" mr="4px">
          오늘
        </Box>
        <Box as="span" color="var(--color-mint)">
          {dayjsToFormat(dayjs(), "D일")}
        </Box>
      </Box>
      <Button
        bgColor={buttonProps.color}
        color={buttonProps.color === "var(--gray-400)" ? "black" : "white"}
      >
        {buttonProps.text}
      </Button>
    </Flex>
  );
}

interface IReturn extends IShadowCircleProps {
  text: StudyVoteActionType;
}

export const getStudyVoteButtonProps = (
  studyDateStatus: StudyDateStatus,
  myStudy: IParticipation | null,
  myUid?: string,
): IReturn => {
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

const ButtonWrapper = styled.div``;

export default StudyControllerVoteButton;
