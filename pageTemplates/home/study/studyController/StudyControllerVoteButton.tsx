function StudyControllerVoteButton() {
  return <></>;
}

export default StudyControllerVoteButton;

// import { Box } from "@chakra-ui/react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useSession } from "next-auth/react";
// import { useRecoilValue } from "recoil";

// import DateVoteBlock from "../../../../components/molecules/DateVoteBlock";
// import { useTypeToast } from "../../../../hooks/custom/CustomToast";
// import {
//   myRealStudyInfoState,
//   myStudyInfoState,
//   studyDateStatusState,
// } from "../../../../recoils/studyRecoils";
// import { DispatchType } from "../../../../types/hooks/reactTypes";
// import {
//   RealTimeMemberProps,
//   StudyParticipationProps,
// } from "../../../../types/models/studyTypes/studyDetails";
// import { StudyDateStatus } from "../../../../types/models/studyTypes/studyInterActions";

// export type StudyVoteActionType =
//   | "원클릭 스터디 투표"
//   | "투표 변경하기"
//   | "스터디 출석체크"
//   | "출석 완료"
//   | "당일 불참"
//   | "기간 만료"
//   | "당일 참여";

// export const ACTION_TO_VOTE_TYPE: Record<StudyVoteActionType, VoteType> = {
//   "원클릭 스터디 투표": "vote",
//   "투표 변경하기": "voteChange",
//   "스터디 출석체크": "attendCheck",
//   "출석 완료": "attendCompleted",
//   "당일 불참": "absent",
//   "기간 만료": "expired",
//   "당일 참여": "todayVote",
// };

// interface IStudyControllerVoteButton {
//   setModalType: DispatchType<VoteType>;
//   memberCnt: number;
// }

// function StudyControllerVoteButton({ setModalType, memberCnt }: IStudyControllerVoteButton) {
//   const typeToast = useTypeToast();
//   const router = useRouter();
//   const { data: session } = useSession();
//   const searchParams = useSearchParams();
//   const newSearchParams = new URLSearchParams(searchParams);
//   const isGuest = session?.user.name === "guest";

//   const studyDateStatus = useRecoilValue(studyDateStatusState);
//   const myStudy = useRecoilValue(myStudyInfoState);
//   const myRealStudy = useRecoilValue(myRealStudyInfoState);

//   const buttonProps = getStudyVoteButtonProps(
//     studyDateStatus,
//     myStudy,
//     myRealStudy,
//     session?.user.uid,
//   );

//   const handleModalOpen = () => {
//     if (isGuest) {
//       typeToast("guest");
//       return;
//     }
//     const type = buttonProps.text;

//     setModalType(ACTION_TO_VOTE_TYPE[type]);
//   };

//   return (
//     <Box mt="16px" pr="8px">
//       <DateVoteBlock cnt={memberCnt} buttonProps={buttonProps} func={handleModalOpen} />
//     </Box>
//   );
// }

// export interface DateVoteButtonProps {
//   text: StudyVoteActionType;
//   color: string;
//   type: "active" | "inactive";
// }

// export const getStudyVoteButtonProps = (
//   studyDateStatus: StudyDateStatus,
//   myStudy: StudyParticipationProps | null,
//   myRealStudy?: RealTimeMemberProps,
//   myUid?: string,
// ): DateVoteButtonProps => {
//   const isAttend = myStudy?.members.find((who) => who.user.uid === myUid)?.arrived;

//   switch (studyDateStatus) {
//     case "not passed":
//       if (myStudy || myRealStudy)
//         return {
//           text: "투표 변경하기",
//           color: "var(--color-mint)",
//           type: "active",
//         };
//       return {
//         text: "원클릭 스터디 투표",
//         color: "var(--color-mint)",
//         type: "active",
//       };
//     case "today":
//       if (isAttend)
//         return {
//           text: "출석 완료",
//           color: "var(--color-orange)",
//           type: "inactive",
//         };
//       else if (myStudy || myRealStudy)
//         return {
//           text: "스터디 출석체크",
//           color: "var(--color-orange)",
//           type: "active",
//         };
//       return {
//         text: "당일 참여",
//         color: "var(--color-mint)",
//         type: "active",
//       };
//     case "passed":
//       if (myStudy && isAttend)
//         return {
//           text: "출석 완료",
//           color: "#F6AD55",
//           type: "inactive",
//         };
//       else if (myStudy && myStudy.status !== "free")
//         return {
//           text: "당일 불참",
//           color: "#FC8181",
//           type: "inactive",
//         };
//       return {
//         text: "기간 만료",
//         color: "var(--gray-400)",
//         type: "inactive",
//       };
//     default:
//       return {
//         text: "원클릭 스터디 투표",
//         color: "var(--color-mint)",
//         type: "active",
//       };
//   }
// };

// export default StudyControllerVoteButton;
