import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

import Slide from "../../components/layouts/PageSlide";
import AttendanceBadge from "../../components/molecules/badge/AttendanceBadge";
import { IProfileCommentCard } from "../../components/molecules/cards/ProfileCommentCard";
import ProfileCardColumn from "../../components/organisms/ProfileCardColumn";
import ImageZoomModal from "../../modals/ImageZoomModal";
import StudyChangeMemoModal from "../../modals/study/StudyChangeMemoModal";
import { IAttendance } from "../../types/models/studyTypes/studyDetails";
import { IAbsence } from "../../types/models/studyTypes/studyInterActions";
import { dayjsToFormat } from "../../utils/dateTimeUtils";

interface IStudyParticipants {
  participants: IAttendance[];
  absences: IAbsence[];
}
export default function StudyParticipants({ participants, absences }: IStudyParticipants) {
  const { data: session } = useSession();

  const [hasModalMemo, setHasModalMemo] = useState<string>();
  const [hasImageProps, setHasImageProps] = useState<{
    image: string;
    toUid: string;
  }>();

  const userCardArr: IProfileCommentCard[] = participants.map((par) => {
    const togglehasModalMemo =
      par.user.uid === session?.user.uid && par.memo
        ? (memo: string) => setHasModalMemo(memo)
        : null;
    const obj = composeUserCardArr(par, absences, togglehasModalMemo);

    const rightComponentProps = obj.rightComponentProps;

    return {
      ...obj,
      rightComponent: rightComponentProps ? (
        <>
          <Flex align="center">
            {par?.imageUrl && (
              <Box
                mr="12px"
                rounded="md"
                overflow="hidden"
                onClick={() => setHasImageProps({ image: par.imageUrl, toUid: par.user.uid })}
                w="50px"
                h="50px"
              >
                <Image
                  src={par.imageUrl}
                  width={50}
                  height={50}
                  alt="studyAttend"
                  priority={true}
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
      <Slide>
        {userCardArr.length ? (
          <ProfileCardColumn userCardArr={userCardArr} />
        ) : (
          <Flex
            align="center"
            justify="center"
            h="200"
            color="var(--gray-700)"
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
      </Slide>
      {hasImageProps?.image && hasImageProps?.toUid && (
        <ImageZoomModal
          imageUrl={hasImageProps.image}
          toUid={hasImageProps.toUid}
          setIsModal={() => setHasImageProps(null)}
        />
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
  participant: IAttendance,
  absences: IAbsence[],
  setHasModalMemo: (memo: string) => void,
): IReturnProps => {
  const arrived = participant?.arrived
    ? dayjsToFormat(dayjs(participant.arrived).subtract(9, "hour"), "HH:mm")
    : null;
  const absent = absences.find((absence) => absence.user.uid === participant.user.uid);
  const memo = participant.memo;
  const user = participant.user;

  return {
    user: user,
    comment: memo || absent?.message || "",
    setMemo: setHasModalMemo ? () => setHasModalMemo(memo) : null,
    rightComponentProps:
      arrived || absent
        ? {
            type: arrived ? "attend" : "dismissed",
            time: arrived || dayjsToFormat(dayjs(absent?.updatedAt), "HH:mm"),
          }
        : undefined,
  };
};
