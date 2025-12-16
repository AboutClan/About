import { Badge, Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import Image from "next/image";
import { useEffect, useState } from "react";

import { HeartIcon } from "../../components/Icons/HeartIcons";
import AttendanceBadge from "../../components/molecules/badge/AttendanceBadge";
import { IProfileCommentCard } from "../../components/molecules/cards/ProfileCommentCard";
import ProfileCardColumn from "../../components/organisms/ProfileCardColumn";
import { STUDY_HEART_ARR } from "../../constants/keys/localStorage";
import { useResetStudyQuery } from "../../hooks/custom/CustomHooks";
import { useToast, useTypeToast } from "../../hooks/custom/CustomToast";
import { useUserInfo } from "../../hooks/custom/UserHooks";
import {
  useRealTimeCommentMutation,
  useRealTimeHeartMutation,
} from "../../hooks/realtime/mutations";
import { useStudyCommentMutation } from "../../hooks/study/mutations";
import { getNearLocationCluster } from "../../libs/study/setStudyMapOptions";
import ImageZoomModal from "../../modals/ImageZoomModal";
import {
  StudyConfirmedMemberProps,
  StudyParticipationProps,
} from "../../types/models/studyTypes/study-entity.types";
import { StudyType } from "../../types/models/studyTypes/study-set.types";
import { dayjsToFormat, getTodayStr } from "../../utils/dateTimeUtils";
import { navigateExternalLink } from "../../utils/navigateUtils";
interface IStudyMembers {
  date: string;
  members: StudyConfirmedMemberProps[] | StudyParticipationProps[];
  studyType: StudyType;
  isAttend?: boolean;
}

export default function StudyMembers({
  studyType,
  date,
  members: prevMembers,
  isAttend,
}: IStudyMembers) {
  const userInfo = useUserInfo();
  const isGuest = userInfo?.role === "guest";
  const toast = useToast();
  const resetStudy = useResetStudyQuery();
  const typeToast = useTypeToast();
  // const [hasModalMemo, setHasModalMemo] = useState<string>();
  const [hasImageProps, setHasImageProps] = useState<{
    image: string;
    toUid: string;
  }>();

  const [members, setMembers] = useState<StudyConfirmedMemberProps[] | StudyParticipationProps[]>(
    [],
  );
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

  useEffect(() => {
    setMembers(prevMembers);
  }, [prevMembers]);

  const { mutate: increaseHeartCnt } = useRealTimeHeartMutation(date, {
    onSuccess(_, variables) {
      const prevStorage =
        (JSON.parse(localStorage.getItem(STUDY_HEART_ARR)) as {
          date: string;
          heartArr: string[];
        }[]) || [];
      const today = getTodayStr();
      let newStorage;

      const todayIndex = prevStorage.findIndex((item) => item.date === today);

      if (todayIndex !== -1) {
        newStorage = [...prevStorage];
        newStorage[todayIndex] = {
          ...newStorage[todayIndex],
          heartArr: [...newStorage[todayIndex].heartArr, variables.userId], // 여기
        };
      } else {
        newStorage = [...prevStorage, { date: today, heartArr: [variables.userId] }];
      }

      localStorage.setItem(STUDY_HEART_ARR, JSON.stringify(newStorage));

      setMembers((old) => {
        const data = old as StudyConfirmedMemberProps[];
        return data.map((props) => ({
          ...props,
          heartCnt: props.user._id === variables.userId ? props.heartCnt + 1 : props.heartCnt,
        }));
      });
    },
  });

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

  const tempArr =
    studyType === "participations"
      ? getNearLocationCluster(filterMembers as StudyParticipationProps[])
      : filterMembers;

  const userCardArr: IProfileCommentCard[] = tempArr?.map((member) => {
    const user = member.user;
    // const badgeText = locationMapping?.find((mapping) => mapping?.id === user._id)?.branch;
    if (studyType === "participations") {
      const participant = member as StudyParticipationProps;
      let month = dayjs(participant.dates[0]).month();
      const addressArr = participant.location.address.split(" ");
      return {
        user: user,
        memo: addressArr?.[0] + " " + addressArr?.[1],
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

      const heartStorage = JSON.parse(localStorage.getItem(STUDY_HEART_ARR)) as {
        date: string;
        heartArr: string[];
      }[];
      const hasMyHeart = heartStorage?.length
        ? heartStorage
            ?.find((props) => props.date === date)
            ?.heartArr?.includes(participant.user._id)
        : null;
      const arrived = participant.attendance?.time;

      const extraValue = dayjs(arrived).minute() % 10;

      const lastMinutes = dayjs(date).endOf("day").diff(dayjs(arrived), "minutes");

      const thresholds = Array.from({ length: 20 }, (_, i) => (i + 1) * 57);

      const diffMinutes = Math.abs(
        (dayjs(date).isBefore(dayjs().startOf("day")) ? dayjs(date).endOf("day") : dayjs()).diff(
          dayjs(arrived),
          "minutes",
        ),
      );
      let extraHeartCnt = 0;
      for (const t of thresholds) {
        const addValue = extraValue + t;

        if (addValue > lastMinutes) break;
        if (lastMinutes < addValue) break;
        if (diffMinutes > addValue) extraHeartCnt++;
      }

      return {
        ...obj,
        changeComment,
        rightComponent: rightComponentProps ? (
          studyType === "soloRealTimes" && image ? (
            <Flex alignItems="center">
              <Flex
                as="button"
                alignItems="center"
                p={3}
                mr={2}
                onClick={() => {
                  if (isGuest) {
                    typeToast("guest");
                    return;
                  }
                  if (date !== getTodayStr()) {
                    toast("info", "오늘 날짜의 인증에만 좋아요를 누를 수 있어요!");
                    return;
                  }
                  if (hasMyHeart) {
                    toast("info", "같은 사람에게는 매일 한번만 보낼 수 있어요!");
                    return;
                  }

                  increaseHeartCnt({ userId: participant.user._id });
                }}
              >
                <Box>
                  <HeartIcon color={hasMyHeart ? "red" : "gray"} fill size="md" />
                </Box>
                <Box
                  mt="2px"
                  ml={2}
                  fontSize="12px"
                  color={hasMyHeart ? "gray.600" : "gray.500"}
                  lineHeight="16px"
                >
                  {participant.heartCnt + extraHeartCnt}
                </Box>
              </Flex>
              <Flex flexDir="column">
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
              </Flex>
            </Flex>
          ) : (
            <AttendanceBadge
              type={rightComponentProps.type}
              time={rightComponentProps.time}
              handleButton={() => {
                if (image) {
                  setHasImageProps({ image, toUid: participant.user.uid });
                } else {
                  toast("info", "등록된 출석 이미지가 없습니다.");
                }
              }}
            />
          )
        ) : null,
      };
    }
  });

  return (
    <>
      {userCardArr?.length ? (
        <>
          <ProfileCardColumn
            userCardArr={
              isOpen || studyType !== "participations" ? userCardArr : userCardArr?.slice(0, 10)
            }
            hasCommentButton={studyType !== "participations" && isAttend}
          />
          {!isOpen && userCardArr.length > 10 && (
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
      {studyType !== "soloRealTimes" && (
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
