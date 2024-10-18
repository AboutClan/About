import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRecoilValue } from "recoil";

import HighlightButton from "../../components/atoms/HighlightButton";
import AttendanceBadge from "../../components/molecules/badge/AttendanceBadge";
import { IProfileCommentCard } from "../../components/molecules/cards/ProfileCommentCard";
import ProfileCardColumn from "../../components/organisms/ProfileCardColumn";
import { useTypeToast } from "../../hooks/custom/CustomToast";
import { useRealTimeCommentMutation } from "../../hooks/realtime/mutations";
import { useStudyCommentMutation } from "../../hooks/study/mutations";
import { checkStudyType } from "../../libs/study/getMyStudyMethods";
import ImageZoomModal from "../../modals/ImageZoomModal";
import StudyChangeMemoModal from "../../modals/study/StudyChangeMemoModal";
import { myStudyParticipationState } from "../../recoils/studyRecoils";
import { StudyMemberProps } from "../../types/models/studyTypes/studyDetails";
import { IAbsence } from "../../types/models/studyTypes/studyInterActions";
import { dayjsToFormat } from "../../utils/dateTimeUtils";

interface IStudyMembers {
  date?: string;
  members: StudyMemberProps[];
  absences: IAbsence[];
}
export default function StudyMembers({ date, members, absences }: IStudyMembers) {
  const { data: session } = useSession();
  const typeToast = useTypeToast();
  const [hasModalMemo, setHasModalMemo] = useState<string>();
  const [hasImageProps, setHasImageProps] = useState<{
    image: string;
    toUid: string;
  }>();
  console.log(34, members);

  const myStudyParticipation = useRecoilValue(myStudyParticipationState);
  const studyType = checkStudyType(myStudyParticipation);

  const { mutate: setRealTimeComment } = useRealTimeCommentMutation();
  const { mutate: setVoteComment } = useStudyCommentMutation(date);

  const isMyStudy = members?.some((who) => who.user.uid === session?.user.uid);

  const changeComment = (comment: string) => {
    if (studyType === "study") {
      setVoteComment(comment);
    } else if (studyType === "realTime") setRealTimeComment(comment);
  };

  const userCardArr: IProfileCommentCard[] = members.map((member) => {
    
    const togglehasModalMemo =
      member.user.uid === session?.user.uid && member.attendanceInfo.attendanceImage
        ? (memo: string) => setHasModalMemo(memo)
        : null;
    const obj = composeUserCardArr(
      member,
      togglehasModalMemo,
      absences?.find((who) => who.user.uid === member.user.uid),
    );

    const rightComponentProps = obj.rightComponentProps;
    const image = member?.attendanceInfo.attendanceImage;

    return {
      ...obj,
      changeComment,
      rightComponent: rightComponentProps ? (
        <>
          <Flex align="center">
            <AttendanceBadge
              type={rightComponentProps.type}
              time={rightComponentProps.time}
              setImageProps={() => setHasImageProps({ image, toUid: member.user.uid })}
            />
          </Flex>
        </>
      ) : null,
    };
  });

  return (
    <>
      {userCardArr.length ? (
        <>
          <ProfileCardColumn userCardArr={userCardArr} />
          {isMyStudy && (
            <Box pt={4} pb={2}>
              <HighlightButton text="친구 초대 +" func={() => typeToast("not-yet")} />
            </Box>
          )}
        </>
      ) : (
        <Flex
          align="center"
          justify="center"
          h="200"
          color="var(--gray-600)"
          fontSize="16px"
          textAlign="center"
        >
          <Box as="p" lineHeight="1.8">
            현재 참여중인 멤버가 없습니다.
            <br />
            지금 신청하면{" "}
            <Box as="b" color="var(--color-mint)">
              10 POINT
            </Box>{" "}
            추가 획득!
          </Box>
        </Flex>
      )}

      {hasImageProps?.image && hasImageProps?.toUid && (
        <ImageZoomModal imageUrl={hasImageProps.image} setIsModal={() => setHasImageProps(null)} />
      )}
      {hasModalMemo && (
        <StudyChangeMemoModal
          hasModalMemo={hasModalMemo}
          setIsModal={() => setHasModalMemo(null)}
        />
      )}
    </>
  );
}

interface IReturnProps extends Omit<IProfileCommentCard, "rightComponent"> {
  rightComponentProps?: {
    type: "attend" | "dismissed";
    time: string;
  };
}

const composeUserCardArr = (
  participant: StudyMemberProps,
  setHasModalMemo: (memo: string) => void,
  absence: IAbsence,
): IReturnProps => {
  const attendanceInfo = participant?.attendanceInfo;

  const arrived = attendanceInfo.arrived
    ? dayjsToFormat(dayjs(attendanceInfo.arrived).subtract(9, "hour"), "HH:mm")
    : null;

  const memo = attendanceInfo.arrivedMessage;

  const user = participant.user;

  return {
    user: user,
    memo: memo || (absence ? absence?.message || "불참" : null),
    comment: participant?.comment,
    setMemo: setHasModalMemo ? () => setHasModalMemo(memo) : null,
    rightComponentProps:
      arrived || absence
        ? {
            type: arrived ? "attend" : "dismissed",
            time: arrived || dayjsToFormat(dayjs(absence?.updatedAt), "HH:mm"),
          }
        : undefined,
  };
};
