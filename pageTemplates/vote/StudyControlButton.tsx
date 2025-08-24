import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import ControlButton from "../../components/ControlButton";
import { useResetStudyQuery } from "../../hooks/custom/CustomHooks";
import { useToast } from "../../hooks/custom/CustomToast";
import { useStudyVoteMutation } from "../../hooks/study/mutations";
import StudyControlDrawer from "../study/modals/StudyControlDrawer";

export const UNMATCHED_POP_UP_STORAGE = "unmatchedPopUpStorage";
interface StudyControlButtonProps {
  date: string;

  // myVoteStatus: MyStudyStatus;
  // studyResults: StudyMergeResultProps[];
  // currentLocation: CoordinatesProps;
  // unmatchedUsers: string[];
}

function StudyControlButton({ date }: StudyControlButtonProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);
  const drawerParam = searchParams.get("drawer");
  const toast = useToast();
  const resetStudy = useResetStudyQuery();

  const { data: session } = useSession();

  const unmatchedPopupStorage = localStorage.getItem(UNMATCHED_POP_UP_STORAGE);

  const [isModal, setIsModal] = useState(false);

  const { mutate: handleCancel } = useStudyVoteMutation(dayjs(date), "delete", {
    onSuccess() {
      resetStudy();
    },
  });

  useEffect(() => {
    if (drawerParam === "on" || drawerParam === "apply") {
      setIsModal(true);
      newSearchParams.delete("drawer");
      router.replace(`/studyPage?${newSearchParams.toString()}`);
    }
  }, [drawerParam]);

  // useEffect(() => {
  //   if (dayjsToStr(dayjs()) !== date) return;
  //   if (!unmatchedUsers || !session) return;
  //   if (unmatchedUsers?.includes(session?.user.id) && unmatchedPopupStorage !== date) {
  //     localStorage.setItem(UNMATCHED_POP_UP_STORAGE, date);
  //     setIsModal(true);
  //   }
  // }, [session, unmatchedUsers, unmatchedPopupStorage, date]);

  const onClickButton = () => {
    setIsModal(true);
    // switch (myVoteStatus) {
    //   case "open":
    //     router.push(`/vote/attend/configuration?date=${date}`);
    //     break;
    //   case "pending":
    //     setStudyDrawerType("vote");
    //     break;
    //   case "todayPending":
    //     if (dayjs().isBefore(dayjs(date))) {
    //       toast("info", "00시 부터 사용 가능합니다.");
    //       return;
    //     }
    //     setStudyDrawerType("free");
    //     break;
    //   case "free":
    //     router.push(`/vote/attend/certification?date=${date}`);
    //     break;
    //   case "voting":
    //     handleCancel();
    //     break;
    // }

    // if (myVoteStatus === "todayPending" || myVoteStatus === "pending") {
    //   setIsStudyDrawer(true);
    // } else if (myVoteStatus === "voting") {
    //   handleCancel();
    // } else {
    //   router.push(`/vote/attend/configuration`);
    // }
  };

  // const { colorScheme, rightIcon, text } = getButtonOptions(myVoteStatus);

  return (
    <>
      <ControlButton
        colorScheme="black"
        text="스터디"
        // isDisabled={myVoteStatus === "arrived" || myVoteStatus === "absenced"}
        rightIcon={<CheckIcon />}
        handleClick={onClickButton}
        hasBottomNav
      />
      {isModal && (
        <StudyControlDrawer
          date={date}
          // studyResults={studyResults}
          // currentLocation={currentLocation}
          onClose={() => setIsModal(false)}
        />
      )}
      /
    </>
  );
}

// const getButtonOptions = (
//   myVoteStatus: MyStudyStatus,
// ): { colorScheme: ThemeTypings["colorSchemes"]; rightIcon: JSX.Element; text: string } => {
//   switch (myVoteStatus) {
//     case "voting":
//       return {
//         colorScheme: "red",
//         rightIcon: <StudyUserCancleIcon />,
//         text: "참여 취소",
//       };
//     case "open":
//       return {
//         colorScheme: "orange",
//         rightIcon: <StudyUserCheckIcon color="white" />,
//         text: "출석 체크",
//       };
//     case "free":
//       return {
//         colorScheme: "orange",
//         rightIcon: <StudyUserCheckIcon color="white" />,
//         text: "출석 체크",
//       };
//     case "pending":
//       return {
//         colorScheme: "mint",
//         rightIcon: <StudyUserIcon />,
//         text: "참여 신청",
//       };
//     case "todayPending":
//       return {
//         colorScheme: "blue",
//         rightIcon: <StudySoloIcon />,
//         text: "스터디 참여",
//       };
//     case "arrived":
//       return {
//         colorScheme: "orange",
//         rightIcon: <StudyUserCheckIcon color="white" />,
//         text: "출석 완료",
//       };
//     case "absenced":
//       return {
//         colorScheme: "red",
//         rightIcon: <StudyUserCancleIcon />,
//         text: "당일 불참",
//       };
//   }
// };

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
      <g clipPath="url(#clip0_2105_2224)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8.6 5.1L5.8 7.9C5.7 8 5.6 8.05 5.45 8.05C5.3 8.05 5.2 8 5.1 7.9L3.4 6.2C3.2 6 3.2 5.7 3.4 5.5C3.6 5.3 3.9 5.3 4.1 5.5L5.45 6.85L7.9 4.4C8.1 4.2 8.4 4.2 8.6 4.4C8.8 4.6 8.8 4.9 8.6 5.1Z"
          fill="white"
        />
        <path
          d="M6 1.5C8.5 1.5 10.5 3.5 10.5 6C10.5 8.5 8.5 10.5 6 10.5C3.5 10.5 1.5 8.5 1.5 6C1.5 3.5 3.5 1.5 6 1.5ZM6 0.5C2.95 0.5 0.5 2.95 0.5 6C0.5 9.05 2.95 11.5 6 11.5C9.05 11.5 11.5 9.05 11.5 6C11.5 2.95 9.05 0.5 6 0.5Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_2105_2224">
          <rect width="12" height="12" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default StudyControlButton;
