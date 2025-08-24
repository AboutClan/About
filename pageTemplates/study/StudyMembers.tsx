import { Badge, Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useState } from "react";

import AttendanceBadge from "../../components/molecules/badge/AttendanceBadge";
import { IProfileCommentCard } from "../../components/molecules/cards/ProfileCommentCard";
import ProfileCardColumn from "../../components/organisms/ProfileCardColumn";
import { useResetStudyQuery } from "../../hooks/custom/CustomHooks";
import { useTypeToast } from "../../hooks/custom/CustomToast";
import { useRealTimeCommentMutation } from "../../hooks/realtime/mutations";
import { useStudyCommentMutation } from "../../hooks/study/mutations";
import ImageZoomModal from "../../modals/ImageZoomModal";
import {
  StudyConfirmedMemberProps,
  StudyParticipationProps,
} from "../../types/models/studyTypes/study-entity.types";
import { StudyType } from "../../types/models/studyTypes/study-set.types";
import { dayjsToFormat } from "../../utils/dateTimeUtils";
import { getPlaceBranch } from "../../utils/stringUtils";

interface IStudyMembers {
  date: string;
  members: StudyConfirmedMemberProps[] | StudyParticipationProps[];
  studyType: StudyType;
}

export default function StudyMembers({ studyType, date, members }: IStudyMembers) {
  const { data: session } = useSession();
  const resetStudy = useResetStudyQuery();
  const typeToast = useTypeToast();
  // const [hasModalMemo, setHasModalMemo] = useState<string>();
  const [hasImageProps, setHasImageProps] = useState<{
    image: string;
    toUid: string;
  }>();

  const { mutate: setRealTimeComment } = useRealTimeCommentMutation(date, {
    onSuccess: () => handleSuccessChange(),
  });
  const { mutate: setVoteComment } = useStudyCommentMutation(date, {
    onSuccess: () => handleSuccessChange(),
  });

  const isMyStudy = members?.some((who) => who.user.uid === session?.user.uid);

  const handleSuccessChange = () => {
    typeToast("change");
    resetStudy();
  };

  const changeComment = (comment: string) => {
    if (studyType === "results") {
      setVoteComment(comment);
    } else if (studyType === "openRealTimes" || studyType === "soloRealTimes")
      setRealTimeComment(comment);
  };

  const userCardArr: IProfileCommentCard[] = members?.map((member) => {
    const user = member.user;
    // const badgeText = locationMapping?.find((mapping) => mapping?.id === user._id)?.branch;
    if (studyType === "participations") {
      const participant = member as StudyParticipationProps;

      let month = dayjs(participant.dates[0]).month();
      return {
        user: user,
        memo: getPlaceBranch(participant.location.address),
        rightComponent: (
          <Badge variant="subtle" colorScheme="blue" size="md">
            {/* {!badgeText ? "알 수 없음" : badgeText} */}
            {participant.dates.map((date, idx) => {
              const newMonth = dayjs(date).month();
              if (month !== newMonth && idx !== 0) {
                month = newMonth;
                return dayjsToFormat(dayjs(date), "M월 D일");
              }
              if (idx === 0) return dayjsToFormat(dayjs(date), "M월 D일");
              else return dayjsToFormat(dayjs(date), ", D일");
            })}
          </Badge>
        ),
      };
    } else {
      const participant = member as StudyConfirmedMemberProps;
      const obj = composeUserCardArr(participant);
      const rightComponentProps = obj.rightComponentProps;
      const image = participant?.attendance?.attendanceImage;
      return {
        ...obj,
        changeComment,
        rightComponent: rightComponentProps ? (
          image ? (
            <>
              <Box
                position="relative"
                w="48px"
                h="48px"
                borderRadius="4px"
                overflow="hidden"
                onClick={() => setHasImageProps({ image, toUid: participant.user.uid })}
              >
                <Image src={image} fill alt="studyImage" />
              </Box>
              <Box mt={1} fontSize="11px" lineHeight="12px" color="gray.500" textAlign="center">
                {rightComponentProps.time}
              </Box>
            </>
          ) : (
            <AttendanceBadge type={rightComponentProps.type} time={rightComponentProps.time} />
          )
        ) : null,
      };
    }
  });

  return (
    <>
      {userCardArr.length ? (
        <>
          <ProfileCardColumn
            userCardArr={userCardArr}
            hasCommentButton={studyType !== "participations"}
          />
          {/* {isMyStudy && (
            <Box pt={4} pb={2}>
              <HighlightButton text="친구 초대 +" func={() => typeToast("not-yet")} />
            </Box>
          )} */}
        </>
      ) : (
        <Flex
          align="center"
          justify="center"
          h="200px"
          color="var(--gray-600)"
          fontSize="16px"
          textAlign="center"
        >
          <Box as="p">현재 참여중인 멤버가 없습니다.</Box>
        </Flex>
      )}

      {hasImageProps?.image && hasImageProps?.toUid && (
        <ImageZoomModal imageUrl={hasImageProps.image} setIsModal={() => setHasImageProps(null)} />
      )}
      {/* {hasModalMemo && (
        <StudyChangeMemoModal
          hasModalMemo={hasModalMemo}
          setIsModal={() => setHasModalMemo(null)}
        />
      )} */}
    </>
  );
}

interface IReturnProps extends Omit<IProfileCommentCard, "rightComponent"> {
  rightComponentProps?: {
    type: "attend" | "dismissed";
    time: string;
  };
}

const composeUserCardArr = (participant: StudyConfirmedMemberProps): IReturnProps => {
  const attendance = participant?.attendance;

  const type = attendance?.type;
  const time = type ? dayjsToFormat(dayjs(attendance.time), "HH:mm") : null;

  const memo = time ? attendance.memo || (type === "arrived" ? "출석" : "불참") : null;

  const user = participant.user;

  return {
    user: user,
    memo: memo || participant.user.comment,
    comment: participant?.comment,
    rightComponentProps: attendance?.type
      ? {
          type: type === "arrived" ? "attend" : "dismissed",
          time,
        }
      : undefined,
  };
};
