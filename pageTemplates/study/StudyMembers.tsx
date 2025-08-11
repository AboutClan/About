import { Badge, Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";

import HighlightButton from "../../components/atoms/HighlightButton";
import AttendanceBadge from "../../components/molecules/badge/AttendanceBadge";
import { IProfileCommentCard } from "../../components/molecules/cards/ProfileCommentCard";
import ProfileCardColumn from "../../components/organisms/ProfileCardColumn";
import { useResetStudyQuery } from "../../hooks/custom/CustomHooks";
import { useTypeToast } from "../../hooks/custom/CustomToast";
import { useKakaoMultipleLocationQuery } from "../../hooks/external/queries";
import { useRealTimeCommentMutation } from "../../hooks/realtime/mutations";
import { useStudyCommentMutation } from "../../hooks/study/mutations";
import ImageZoomModal from "../../modals/ImageZoomModal";
import { StudyParticipationUserProps } from "../../pages/study/[id]/[date]";
import { StudyMemberProps, StudyStatus } from "../../types/models/studyTypes/baseTypes";
import { dayjsToFormat } from "../../utils/dateTimeUtils";

interface IStudyMembers {
  date: string;
  members: StudyMemberProps[] | StudyParticipationUserProps[];
  status: StudyStatus | "recruiting";
}

export default function StudyMembers({ date, members, status }: IStudyMembers) {
  const { data: session } = useSession();
  const resetStudy = useResetStudyQuery();
  const typeToast = useTypeToast();
  // const [hasModalMemo, setHasModalMemo] = useState<string>();
  const [hasImageProps, setHasImageProps] = useState<{
    image: string;
    toUid: string;
  }>();
  const [locationMapping, setLocationMapping] = useState<{ branch: string; id: string }[]>();

  const { data: locationMappingData } = useKakaoMultipleLocationQuery(
    members.map((member) => ({
      lat: member.lat,
      lon: member.lon,
      id: member.user._id,
    })),
    false,
    {
      enabled: !!members,
    },
  );

  useEffect(() => {
    if (!locationMappingData) return;
    setLocationMapping(locationMappingData);
  }, [locationMappingData]);

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
    if (status === "open") {
      setVoteComment(comment);
    } else if (status === "free") setRealTimeComment(comment);
  };

  const userCardArr: IProfileCommentCard[] = members.map((member) => {
    const user = member.user;
    const badgeText = locationMapping?.find((mapping) => mapping?.id === user._id)?.branch;
    if (status === "recruiting") {
      let month = dayjs(member.date[0]).month();
      return {
        user: user,
        memo: user.comment,
        rightComponent: (
          <Badge variant="subtle" colorScheme="blue" size="md">
            {/* {!badgeText ? "알 수 없음" : badgeText} */}
            {member.date.map((date, idx) => {
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
    }

    const obj = composeUserCardArr(member);

    const rightComponentProps = obj.rightComponentProps;
    const image = member?.attendance?.attendanceImage;

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
              onClick={() => setHasImageProps({ image, toUid: member.user.uid })}
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
  });

  return (
    <>
      {userCardArr.length ? (
        <>
          <ProfileCardColumn
            userCardArr={userCardArr}
            hasCommentButton={status === "open" || status === "free"}
          />
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

const composeUserCardArr = (participant: StudyMemberProps): IReturnProps => {
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
