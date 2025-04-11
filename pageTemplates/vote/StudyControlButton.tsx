import { Button, Flex, ThemeTypings } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  StudySoloIcon,
  StudyUserCancleIcon,
  StudyUserCheckIcon,
  StudyUserIcon,
} from "../../components/Icons/StudyIcons";
import { useResetStudyQuery } from "../../hooks/custom/CustomHooks";
import { useStudyParticipationMutation } from "../../hooks/study/mutations";
import { CoordinatesProps } from "../../types/common";
import { StudyMergeResultProps } from "../../types/models/studyTypes/derivedTypes";
import { MyStudyStatus } from "../../types/models/studyTypes/helperTypes";

import { iPhoneNotchSize } from "../../utils/validationUtils";
import StudyControlDrawer from "../study/modals/StudyControlDrawer";

interface StudyControlButtonProps {
  date: string;
  myVoteStatus: MyStudyStatus;
  studyResults: StudyMergeResultProps[];
  currentLocation: CoordinatesProps;
}

function StudyControlButton({
  date,
  myVoteStatus,
  studyResults,
  currentLocation,
}: StudyControlButtonProps) {
  const resetStudy = useResetStudyQuery();
  const { data: session } = useSession();
  const router = useRouter();
  console.log(myVoteStatus);
  const [studyDrawerType, setStudyDrawerType] = useState<"free" | "vote">(null);

  const { mutate: handleCancel } = useStudyParticipationMutation(dayjs(date), "delete", {
    onSuccess() {
      resetStudy();
    },
  });
  console.log(myVoteStatus);
  const onClickButton = () => {
    switch (myVoteStatus) {
      case "open":
        break;
      case "pending":
        setStudyDrawerType("vote");
        break;
      case "todayPending":
        setStudyDrawerType("free");
        break;
      case "free":
        router.push(`/vote/attend/certification?date=${date}`);
        break;
      case "voting":
        handleCancel();
        break;
    }

    // if (myVoteStatus === "todayPending" || myVoteStatus === "pending") {
    //   setIsStudyDrawer(true);
    // } else if (myVoteStatus === "voting") {
    //   handleCancel();
    // } else {
    //   router.push(`/vote/attend/configuration`);
    // }
  };

  const { colorScheme, rightIcon, text } = getButtonOptions(myVoteStatus);

  return (
    <>
      <Flex
        position="fixed"
        zIndex="800"
        fontSize="12px"
        lineHeight="24px"
        fontWeight={700}
        bottom={`calc(var(--bottom-nav-height) + ${iPhoneNotchSize() + 12}px)`}
        right="20px"
      >
        <Button
          fontSize="12px"
          h="40px"
          color="white"
          px={4}
          borderRadius="20px"
          lineHeight="24px"
          iconSpacing={1}
          colorScheme={colorScheme}
          rightIcon={rightIcon}
          onClick={onClickButton}
          // isDisabled={!!isArrived}
          _hover={{
            background: undefined,
          }}
        >
          {text}
        </Button>
      </Flex>
      <StudyControlDrawer
        date={date}
        studyResults={studyResults}
        currentLocation={currentLocation}
        studyDrawerType={studyDrawerType}
        onClose={() => setStudyDrawerType(null)}
      />
    </>
  );
}

const getButtonOptions = (
  myVoteStatus: MyStudyStatus,
): { colorScheme: ThemeTypings["colorSchemes"]; rightIcon: JSX.Element; text: string } => {
  switch (myVoteStatus) {
    case "voting":
      return {
        colorScheme: "red",
        rightIcon: <StudyUserCancleIcon />,
        text: "참여 취소",
      };
    case "pending":
      return {
        colorScheme: "mint",
        rightIcon: <StudyUserIcon />,
        text: "참여 신청",
      };
    case "todayPending":
      return {
        colorScheme: "blue",
        rightIcon: <StudySoloIcon />,
        text: "자유 스터디 신청",
      };

    default:
      return {
        colorScheme: "orange",
        rightIcon: <StudyUserCheckIcon color="white" />,
        text: "출석 체크",
      };
  }
};

export default StudyControlButton;
