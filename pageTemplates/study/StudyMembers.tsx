import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

import HighlightButton from "../../components/atoms/HighlightButton";
import AttendanceBadge from "../../components/molecules/badge/AttendanceBadge";
import { IProfileCommentCard } from "../../components/molecules/cards/ProfileCommentCard";
import ProfileCardColumn from "../../components/organisms/ProfileCardColumn";
import { useTypeToast } from "../../hooks/custom/CustomToast";
import ImageZoomModal from "../../modals/ImageZoomModal";
import StudyChangeMemoModal from "../../modals/study/StudyChangeMemoModal";
import { DispatchBoolean } from "../../types/hooks/reactTypes";
import { StudyMemberProps } from "../../types/models/studyTypes/studyDetails";
import { dayjsToFormat } from "../../utils/dateTimeUtils";

interface IStudyMembers {
  members: StudyMemberProps[];
  setIsInviteModal: DispatchBoolean;
}
export default function StudyMembers({ members, setIsInviteModal }: IStudyMembers) {
  const { data: session } = useSession();
  const typeToast = useTypeToast();
  const [hasModalMemo, setHasModalMemo] = useState<string>();
  const [hasImageProps, setHasImageProps] = useState<{
    image: string;
    toUid: string;
  }>();

  const userCardArr: IProfileCommentCard[] = members.map((member) => {
    const togglehasModalMemo =
      member.user.uid === session?.user.uid && member.attendanceInfo.attendanceImage
        ? (memo: string) => setHasModalMemo(memo)
        : null;
    const obj = composeUserCardArr(member, togglehasModalMemo);

    const rightComponentProps = obj.rightComponentProps;
    const image = member?.attendanceInfo.attendanceImage;

    return {
      ...obj,
      rightComponent: rightComponentProps ? (
        <>
          <Flex align="center">
            {image && (
              <Box
                mr="12px"
                rounded="md"
                overflow="hidden"
                onClick={() => setHasImageProps({ image, toUid: member.user.uid })}
                w="50px"
                h="50px"
                position="relative"
              >
                <Image
                  src={image}
                  fill={true}
                  sizes="50px"
                  alt="studyAttend"
                  priority={true}
                  style={{ objectPosition: "center", objectFit: "cover" }}
                />
              </Box>
            )}
            <AttendanceBadge type={rightComponentProps.type} time={rightComponentProps.time} />
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
          <Box pt={4} pb={2}>
            <HighlightButton text="친구 초대 +" func={() => typeToast("not-yet")} />
          </Box>
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
): IReturnProps => {
  const attendanceInfo = participant?.attendanceInfo;
  const absences = participant?.absenceInfo;
  const arrived = attendanceInfo.arrived
    ? dayjsToFormat(dayjs(attendanceInfo.arrived).subtract(9, "hour"), "HH:mm")
    : null;

  const memo = attendanceInfo.arrivedMessage;
  const user = participant.user;

  return {
    user: user,
    comment: memo || absences?.text || "",
    setMemo: setHasModalMemo ? () => setHasModalMemo(memo) : null,
    rightComponentProps:
      arrived || absences
        ? {
            type: arrived ? "attend" : "dismissed",
            time: arrived || dayjsToFormat(dayjs(absences?.updatedAt), "HH:mm"),
          }
        : undefined,
  };
};
