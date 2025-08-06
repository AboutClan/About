import { ThemeTypings } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import ControlButton from "../../components/ControlButton";
import {
  StudySoloIcon,
  StudyUserCancleIcon,
  StudyUserCheckIcon,
  StudyUserIcon,
} from "../../components/Icons/ControlButtonIcon";
import { useResetStudyQuery } from "../../hooks/custom/CustomHooks";
import { useToast } from "../../hooks/custom/CustomToast";
import { useStudyVoteMutation } from "../../hooks/study/mutations";
import StudyOpenCheckModal from "../../modals/study/StudyOpenCheckModal";
import { CoordinatesProps } from "../../types/common";
import { StudyMergeResultProps } from "../../types/models/studyTypes/derivedTypes";
import { MyStudyStatus } from "../../types/models/studyTypes/helperTypes";
import { dayjsToStr } from "../../utils/dateTimeUtils";
import StudyControlDrawer from "../study/modals/StudyControlDrawer";

export const UNMATCHED_POP_UP_STORAGE = "unmatchedPopUpStorage";
interface StudyControlButtonProps {
  date: string;
  myVoteStatus: MyStudyStatus;
  studyResults: StudyMergeResultProps[];
  currentLocation: CoordinatesProps;
  unmatchedUsers: string[];
}

function StudyControlButton({
  date,
  myVoteStatus,
  studyResults,
  currentLocation,
  unmatchedUsers,
}: StudyControlButtonProps) {
  const toast = useToast();
  const resetStudy = useResetStudyQuery();
  const { data: session } = useSession();
  const router = useRouter();
  const unmatchedPopupStorage = localStorage.getItem(UNMATCHED_POP_UP_STORAGE);

  const [studyDrawerType, setStudyDrawerType] = useState<"free" | "vote">(null);
  const [isModal, setIsModal] = useState(false);

  const { mutate: handleCancel } = useStudyVoteMutation(dayjs(date), "delete", {
    onSuccess() {
      resetStudy();
    },
  });

  useEffect(() => {
    if (dayjsToStr(dayjs()) !== date) return;
    if (!unmatchedUsers || !session) return;
    if (unmatchedUsers?.includes(session?.user.id) && unmatchedPopupStorage !== date) {
      localStorage.setItem(UNMATCHED_POP_UP_STORAGE, date);
      setIsModal(true);
    }
  }, [session, unmatchedUsers, unmatchedPopupStorage, date]);

  const onClickButton = () => {
    switch (myVoteStatus) {
      case "open":
        router.push(`/vote/attend/configuration?date=${date}`);
        break;
      case "pending":
        setStudyDrawerType("vote");
        break;
      case "todayPending":
        if (dayjs().isBefore(dayjs(date))) {
          toast("info", "00시 부터 사용 가능합니다.");
          return;
        }
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
      <ControlButton
        colorScheme={colorScheme}
        text={text}
        isDisabled={myVoteStatus === "arrived" || myVoteStatus === "absenced"}
        rightIcon={rightIcon}
        handleClick={onClickButton}
        hasBottomNav
      />

      <StudyControlDrawer
        date={date}
        studyResults={studyResults}
        currentLocation={currentLocation}
        studyDrawerType={studyDrawerType}
        onClose={() => setStudyDrawerType(null)}
      />
      {isModal && (
        <StudyOpenCheckModal
          setIsModal={setIsModal}
          handleButton={() => setStudyDrawerType("free")}
        />
      )}
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
    case "open":
      return {
        colorScheme: "orange",
        rightIcon: <StudyUserCheckIcon color="white" />,
        text: "출석 체크",
      };
    case "free":
      return {
        colorScheme: "orange",
        rightIcon: <StudyUserCheckIcon color="white" />,
        text: "출석 체크",
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
        text: "스터디 참여",
      };
    case "arrived":
      return {
        colorScheme: "orange",
        rightIcon: <StudyUserCheckIcon color="white" />,
        text: "출석 완료",
      };
    case "absenced":
      return {
        colorScheme: "red",
        rightIcon: <StudyUserCancleIcon />,
        text: "당일 불참",
      };
  }
};

export default StudyControlButton;
