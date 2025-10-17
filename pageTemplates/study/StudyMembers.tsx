import { Badge, Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import Image from "next/image";
import { useState } from "react";

import { MainLoadingAbsolute } from "../../components/atoms/loaders/MainLoading";
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
import { navigateExternalLink } from "../../utils/navigateUtils";

interface IStudyMembers {
  date: string;
  members: StudyConfirmedMemberProps[] | StudyParticipationProps[];
  studyType: StudyType;
  hasStudyLink: boolean;
}

export default function StudyMembers({ studyType, date, members, hasStudyLink }: IStudyMembers) {
  const resetStudy = useResetStudyQuery();
  const typeToast = useTypeToast();
  // const [hasModalMemo, setHasModalMemo] = useState<string>();
  const [hasImageProps, setHasImageProps] = useState<{
    image: string;
    toUid: string;
  }>();

  const [isOpen, setIsOpen] = useState(false);

  const { mutate: setRealTimeComment } = useRealTimeCommentMutation(date, {
    onSuccess: () => handleSuccessChange(),
  });
  const { mutate: setVoteComment } = useStudyCommentMutation(date, {
    onSuccess: () => handleSuccessChange(),
  });

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

  const filterMembers =
    studyType !== "participations"
      ? members
      : isOpen
      ? (members as StudyParticipationProps[])?.filter((member) => member.dates.includes(date))
      : (members as StudyParticipationProps[])
          ?.filter((member) => member.dates.includes(date))
          ?.map((member) => ({
            ...member,
            dates: member.dates.filter((date2) =>
              dayjs(date2).isAfter(dayjs(date).subtract(1, "day")),
            ),
          }));
  console.log("f", members, isOpen, filterMembers, date);
  const userCardArr: IProfileCommentCard[] = filterMembers?.map((member) => {
    const user = member.user;
    // const badgeText = locationMapping?.find((mapping) => mapping?.id === user._id)?.branch;
    if (studyType === "participations") {
      const participant = member as StudyParticipationProps;

      let month = dayjs(participant.dates[0]).month();
      return {
        user: user,
        memo: participant.user.comment,
        rightComponent: (
          <Badge variant="subtle" colorScheme="blue" size="md">
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
  console.log(44, members, userCardArr);
  return (
    <>
      {userCardArr?.length ? (
        <>
          <ProfileCardColumn
            userCardArr={
              isOpen || studyType !== "participations" ? userCardArr : userCardArr?.slice(0, 5)
            }
            hasCommentButton={studyType !== "participations"}
          />
          {!isOpen && userCardArr.length > 5 && (
            <Button
              mt={2}
              w="100%"
              h="40px"
              bgColor="white"
              border="0.5px solid #E8E8E8"
              onClick={() => setIsOpen(true)}
            >
              더보기
            </Button>
          )}
        </>
      ) : members?.length ? (
        <Box position="relative" mt="100px" bottom="0" left="50%" transform="translate(-50%,-50%)">
          <MainLoadingAbsolute size="sm" />
        </Box>
      ) : (
        <Flex
          align="center"
          justify="center"
          h="200px"
          color="var(--gray-600)"
          fontSize="16px"
          textAlign="center"
        >
          <Box as="p">
            {studyType === "soloRealTimes"
              ? "첫 번째로 공부 인증하면 당첨 확률 UP!"
              : "현재 참여중인 멤버가 없습니다."}
          </Box>
        </Flex>
      )}
      {hasStudyLink && (
        <Button
          mt={4}
          mb={2}
          borderRadius={8}
          color="mint"
          border="1px solid var(--color-mint)"
          bg="white"
          w="full"
          onClick={() => {
            navigateExternalLink("https://open.kakao.com/o/gCRegnOh");
          }}
        >
          스터디 단톡방 입장하기
        </Button>
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
