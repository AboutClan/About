import { Badge, Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { toPng } from "html-to-image";
import Image from "next/image";
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";

import { GATHER_MAIN_IMAGE_ARR } from "../../assets/gather";
import { HeartIcon } from "../../components/Icons/HeartIcons";
import AttendanceBadge from "../../components/molecules/badge/AttendanceBadge";
import { IProfileCommentCard } from "../../components/molecules/cards/ProfileCommentCard";
import {
  StudyThumbnailCard,
  StudyThumbnailCardProps,
} from "../../components/molecules/cards/StudyThumbnailCard";
import ProfileCardColumn from "../../components/organisms/ProfileCardColumn";
import { STUDY_HEART_ARR } from "../../constants/keys/localStorage";
import { STUDY_LOCATION_CENTER_MAPPING } from "../../constants/service/study/place";
import { useResetStudyQuery } from "../../hooks/custom/CustomHooks";
import { useToast, useTypeToast } from "../../hooks/custom/CustomToast";
import { useUserInfo } from "../../hooks/custom/UserHooks";
import {
  useRealTimeCommentMutation,
  useRealTimeHeartMutation,
  useRealTimeStatusMutation,
} from "../../hooks/realtime/mutations";
import { useStudyCommentMutation } from "../../hooks/study/mutations";
import { getNearLocationCluster } from "../../libs/study/setStudyMapOptions";
import ImageZoomModal from "../../modals/ImageZoomModal";
import { CoordinatesProps } from "../../types/common";
import {
  StudyConfirmedMemberProps,
  StudyParticipationProps,
} from "../../types/models/studyTypes/study-entity.types";
import { StudyConfirmedSetProps, StudyType } from "../../types/models/studyTypes/study-set.types";
import { dayjsToFormat, dayjsToKr, getTodayStr } from "../../utils/dateTimeUtils";
import { getRandomImage } from "../../utils/imageUtils";
import { navigateExternalLink } from "../../utils/navigateUtils";
import StudyCrewStatsDrawer from "./modals/StudyCrewStatsDrawer";

const PARTICIPATIONS_MAX_VISIBLE = 10;
const NO_VOTE_KEY = "no-vote";
// 1x1 투명 픽셀. CORS로 인해 원본 이미지를 데이터URL로 embed하지 못했을 때
// html-to-image가 이걸 대신 써서 캡처 자체가 실패(reject)하지 않도록 한다.
const TRANSPARENT_PIXEL = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

interface IStudyMembers {
  date: string;
  members: StudyConfirmedMemberProps[] | StudyParticipationProps[];
  studyType: StudyType;
  isAttend?: boolean;
  isCrew: boolean;
  coordinates: CoordinatesProps;
  isCafeMap?: boolean;
  pendingResultsSet?: StudyConfirmedSetProps[] | null;
  crewMemberIds?: string[] | null;
}

export interface StudyMembersHandle {
  saveImage: () => Promise<void>;
}

const StudyMembers = forwardRef<StudyMembersHandle, IStudyMembers>(function StudyMembers(
  {
    studyType,
    date,
    members: prevMembers,
    isAttend,
    isCrew,
    isCafeMap,
    coordinates,
    pendingResultsSet,
    crewMemberIds,
  },
  ref,
) {
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
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const captureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedDate(null);
  }, [studyType, isCrew]);

  const handleSaveImage = async () => {
    if (!captureRef.current || isCapturing) return;
    setIsCapturing(true);
    try {
      const dataUrl = await toPng(captureRef.current, {
        backgroundColor: "#ffffff",
        pixelRatio: 2,
        cacheBust: true,
        // 프로필/장소 이미지가 S3 등 CORS 미허용 origin에서 오면 embed용 fetch가 실패하는데,
        // fallback이 없으면 해당 <img>가 onerror로 캡처 전체를 reject시킨다.
        imagePlaceholder: TRANSPARENT_PIXEL,
      });
      const link = document.createElement("a");
      link.download = `study-members-${date}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("StudyMembers image capture failed", error);
      toast("error", "이미지 저장에 실패했어요. 다시 시도해 주세요!");
    } finally {
      setIsCapturing(false);
    }
  };

  useImperativeHandle(ref, () => ({ saveImage: handleSaveImage }));

  const { mutate: setRealTimeComment } = useRealTimeCommentMutation(date, {
    onSuccess: () => handleSuccessChange(),
  });
  const { mutate: setVoteComment } = useStudyCommentMutation(date, {
    onSuccess: () => handleSuccessChange(),
  });
  const { mutate: changeStatus } = useRealTimeStatusMutation(date, {
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

  const findMine =
    (prevMembers as StudyConfirmedMemberProps[])?.find((t) => t?.status === "open")?.user._id ===
    userInfo?._id;

  const changeComment = (comment: string) => {
    if (studyType === "results") {
      setVoteComment(comment);
    } else if (studyType === "openRealTimes" || studyType === "soloRealTimes")
      setRealTimeComment(comment);
  };

  const filterMembers = (
    members as (StudyConfirmedMemberProps | StudyParticipationProps)[]
  )?.filter((member) => member?.user?._id !== "65df1ddcd73ecfd250b42c89") as
    StudyConfirmedMemberProps[] | StudyParticipationProps[];

  const tempArr =
    studyType === "participations" && !isCrew
      ? getNearLocationCluster(filterMembers as StudyParticipationProps[])
      : filterMembers;

  const buildParticipationCard = (participant: StudyParticipationProps): IProfileCommentCard => {
    const addressArr = participant.location?.address?.split(" ");
    const locationName = addressArr?.[1] || addressArr?.[0];
    return {
      user: participant.user,
      memo: participant.user?.comment,
      rightComponent: locationName ? (
        <Badge variant="subtle" colorScheme="blue" size="md" maxW="70px" isTruncated>
          {locationName}
        </Badge>
      ) : null,
    };
  };

  const participationMembers = (
    studyType === "participations" ? (tempArr as StudyParticipationProps[]) || [] : []
  ) as StudyParticipationProps[];

  const pendingStudyByDate = useMemo(() => {
    if (studyType !== "participations" || !pendingResultsSet?.length) {
      return {} as Record<string, StudyThumbnailCardProps[]>;
    }

    const filteredResults = pendingResultsSet
      .filter((result) => result?.study.status === "expected")
      .filter((result) => {
        if (!crewMemberIds) return true;
        const crewMemberCnt = result.study.members.filter((member) =>
          crewMemberIds.includes(member.user._id),
        ).length;
        return crewMemberCnt >= 3;
      });

    return filteredResults.reduce<Record<string, StudyThumbnailCardProps[]>>((acc, result, idx) => {
      const study = result.study;
      const placeInfo = study.place;
      const textArr = placeInfo.location?.address.split(" ");

      const card: StudyThumbnailCardProps = {
        place: {
          name: placeInfo.location.name,
          branch: textArr?.[0] + " " + textArr?.[1],
          address: placeInfo.location?.address,
          date: dayjs(result.date),
          imageProps: {
            image: placeInfo.image || getRandomImage(GATHER_MAIN_IMAGE_ARR["공부·자기계발"]),
            isPriority: idx < 4,
          },
          _id: placeInfo._id,
        },
        participants: study.members.map((att) => att.user),
        url: `/study/${placeInfo._id}/${result.date}?type=results`,
        studyType: "results",
        isMyStudy: study.members.map((member) => member.user._id).includes(userInfo?._id),
        dateStatus: dayjs(result.date).hour(9).isAfter(dayjs())
          ? "future"
          : result.date === getTodayStr()
            ? "current"
            : "prev",
      };

      acc[result.date] = [...(acc[result.date] || []), card];
      return acc;
    }, {});
  }, [pendingResultsSet, crewMemberIds, studyType, userInfo?._id]);

  const dateSections = useMemo(() => {
    if (studyType !== "participations") return [];

    const dateSet = new Set<string>();
    participationMembers.forEach((member) => member.dates?.forEach((d) => dateSet.add(d)));
    const sortedDates = Array.from(dateSet).sort((a, b) => dayjs(a).valueOf() - dayjs(b).valueOf());

    const sections = sortedDates.map((sectionDate) => ({
      key: sectionDate,
      date: sectionDate as string | null,
      members: participationMembers.filter((member) => member.dates?.includes(sectionDate)),
    }));

    const noVoteMembers = participationMembers.filter((member) => !member.dates?.length);
    if (noVoteMembers.length) {
      sections.push({ key: NO_VOTE_KEY, date: null, members: noVoteMembers });
    }

    return sections;
  }, [participationMembers, studyType]);

  const dateOnlySections = dateSections.filter((section) => section.date);

  const isPagedParticipationList = studyType === "participations" && !isCrew;
  const totalParticipationMemberCnt = dateSections.reduce(
    (sum, section) => sum + section.members.length,
    0,
  );

  let remainingVisibleCnt =
    isPagedParticipationList && !isOpen ? PARTICIPATIONS_MAX_VISIBLE : Infinity;
  const visibleDateSections = dateSections
    .map((section) => {
      if (remainingVisibleCnt <= 0) return null;
      const visibleMembers = section.members.slice(0, remainingVisibleCnt);
      remainingVisibleCnt -= visibleMembers.length;
      return { ...section, members: visibleMembers };
    })
    .filter((section) => section?.members.length);

  const displayedDateSections = selectedDate
    ? dateSections.filter((section) => section.date === selectedDate)
    : visibleDateSections;

  const showParticipationMoreButton =
    !selectedDate &&
    isPagedParticipationList &&
    !isOpen &&
    totalParticipationMemberCnt > PARTICIPATIONS_MAX_VISIBLE;

  const userCardArr: IProfileCommentCard[] =
    studyType === "participations"
      ? []
      : tempArr?.map((member) => {
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
            (dayjs(date).isBefore(dayjs().startOf("day"))
              ? dayjs(date).endOf("day")
              : dayjs()
            ).diff(dayjs(arrived), "minutes"),
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
            pendingType: (studyType === "openRealTimes" && participant.status === "pending"
              ? findMine
                ? "pendingOwner"
                : "pending"
              : null) as "pendingOwner" | "pending" | null,
            rightComponent:
              studyType === "openRealTimes" && participant.status === "pending" && findMine ? (
                <Flex mt={1}>
                  <Button
                    onClick={() => {
                      changeStatus({
                        userId: participant.user._id,
                        status: "participation",
                      });
                    }}
                    flex={1}
                    colorScheme="mint"
                    size="sm"
                    mr={2}
                  >
                    참여 승인
                  </Button>
                  <Button
                    onClick={() => {
                      changeStatus({
                        userId: participant.user._id,
                        status: "refuse",
                      });
                    }}
                    flex={1}
                    size="sm"
                  >
                    참여 거절
                  </Button>
                </Flex>
              ) : rightComponentProps ? (
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
                      <Box
                        mt={1}
                        fontSize="11px"
                        lineHeight="12px"
                        color="gray.500"
                        textAlign="center"
                      >
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
        });

  return (
    <>
      <Box ref={captureRef} bg="white">
        {studyType === "participations" ? (
          totalParticipationMemberCnt ? (
            <>
              {dateOnlySections.length > 1 && (
                <Box mb={5} border="var(--border)" borderRadius="12px" overflow="hidden">
                  <Flex
                    as="button"
                    type="button"
                    w="100%"
                    justify="space-between"
                    align="center"
                    px={4}
                    py={3}
                    bg={selectedDate === null ? "gray.800" : "white"}
                    onClick={() => setSelectedDate(null)}
                  >
                    <Box
                      fontSize="13px"
                      fontWeight="bold"
                      color={selectedDate === null ? "white" : "gray.800"}
                    >
                      투표 날짜 전체 보기
                    </Box>
                    <Box fontSize="12px" color={selectedDate === null ? "white" : "gray.500"}>
                      {totalParticipationMemberCnt}명 참여 중
                    </Box>
                  </Flex>
                  <Box
                    display="grid"
                    gridTemplateColumns="repeat(2, 1fr)"
                    gap={2}
                    p={2}
                    borderTop="var(--border)"
                  >
                    {dateOnlySections.map((section) => (
                      <Flex
                        key={section.key}
                        as="button"
                        type="button"
                        direction="column"
                        align="center"
                        justify="center"
                        py={2}
                        borderRadius="8px"
                        border="1px solid"
                        borderColor={selectedDate === section.date ? "mint" : "var(--gray-200)"}
                        bg={selectedDate === section.date ? "mint.50" : "white"}
                        onClick={() => setSelectedDate(section.date)}
                      >
                        <Box
                          fontSize="13px"
                          fontWeight={selectedDate === section.date ? "bold" : "medium"}
                          color={selectedDate === section.date ? "mint" : "gray.800"}
                        >
                          {dayjsToFormat(dayjs(section.date).locale("ko"), "D일(ddd)")}
                        </Box>
                        <Box
                          fontSize="11px"
                          color={selectedDate === section.date ? "mint" : "gray.500"}
                        >
                          {section.members.length}명
                        </Box>
                      </Flex>
                    ))}
                  </Box>
                </Box>
              )}
              {displayedDateSections.map((section) => (
                <Box key={section.key} mb={5}>
                  {section.date ? (
                    <Flex align="center" justify="center" mb={2}>
                      <Box h="1px" flex={1} bg="gray.200" />
                      <Flex mx={3} align="baseline" flexShrink={0}>
                        <Box fontSize="13px" fontWeight="bold" color="gray.800">
                          {dayjsToKr(dayjs(section.date))}
                        </Box>
                        <Box ml={1} fontSize="12px" color="gray.500">
                          · {section.members.length}명 투표중
                        </Box>
                      </Flex>
                      <Box h="1px" flex={1} bg="gray.200" />
                    </Flex>
                  ) : (
                    <Box
                      mb={2}
                      fontSize="13px"
                      fontWeight="bold"
                      color="gray.500"
                      textAlign="center"
                    >
                      투표 정보 없음 · {section.members.length}명
                    </Box>
                  )}
                  <ProfileCardColumn
                    userCardArr={section.members.map(buildParticipationCard)}
                    hasCommentButton={false}
                    isStudy={true}
                    isCafeMap={isCafeMap}
                  />
                  {section.date && pendingStudyByDate[section.date]?.length ? (
                    <Box mt={3} pt={3} borderTop="1px dashed var(--gray-300)">
                      <Box mb={1} fontSize="11px" fontWeight="medium" color="gray.500">
                        진행 예정 스터디
                      </Box>
                      <Flex direction="column">
                        {pendingStudyByDate[section.date].map((thumbnailCardInfo, idx, arr) => (
                          <StudyThumbnailCard
                            key={idx}
                            {...thumbnailCardInfo}
                            hasBorder={idx !== arr.length - 1}
                          />
                        ))}
                      </Flex>
                    </Box>
                  ) : null}
                </Box>
              ))}
              {showParticipationMoreButton && (
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
              <Box as="p">현재 참여중인 멤버가 없습니다.</Box>
            </Flex>
          )
        ) : userCardArr?.length ? (
          <>
            <ProfileCardColumn
              userCardArr={userCardArr}
              hasCommentButton={isAttend}
              isStudy={true}
              isSoloStudy={studyType === "soloRealTimes"}
              isCafeMap={isCafeMap}
            />
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
      </Box>
      {studyType !== "soloRealTimes" && !isGuest && (
        <Button
          mt={4}
          mb={2}
          borderRadius={8}
          color="mint"
          border="1px solid var(--color-mint)"
          bg="white"
          w="full"
          onClick={() => {
            if (isGuest) {
              typeToast("guest");
              return;
            }
            navigateLocationToLink({ latitude: coordinates.lat, longitude: coordinates.lon });
          }}
        >
          스터디 단톡방 입장하기
        </Button>
      )}
      {isCrew && studyType === "participations" && !!participationMembers.length && (
        <Button
          mt={2}
          borderRadius={8}
          color="gray.700"
          border="1px solid var(--gray-300)"
          bg="white"
          w="full"
          onClick={() => setIsStatsOpen(true)}
        >
          스터디 크루 상세 통계
        </Button>
      )}
      {isStatsOpen && (
        <StudyCrewStatsDrawer
          crewMembers={participationMembers}
          onClose={() => setIsStatsOpen(false)}
        />
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
});

export default StudyMembers;

interface IReturnProps extends Omit<IProfileCommentCard, "rightComponent"> {
  rightComponentProps?: {
    type: "attend" | "dismissed";
    time: string;
  };
}

type Coord = { latitude: number; longitude: number };
export const navigateLocationToLink = ({ latitude, longitude }: Coord) => {
  function getDistance(a: Coord, b: Coord) {
    const R = 6371; // km
    const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
    const dLon = ((b.longitude - a.longitude) * Math.PI) / 180;

    const lat1 = (a.latitude * Math.PI) / 180;
    const lat2 = (b.latitude * Math.PI) / 180;

    const x = Math.sin(dLat / 2) ** 2 + Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);

    return 2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  }

  function getClosestStudyCrewLink(target: Coord) {
    let minDistance = Infinity;
    let closestKey: keyof typeof STUDY_LOCATION_CENTER_MAPPING | null = null;

    for (const [key, coord] of Object.entries(STUDY_LOCATION_CENTER_MAPPING)) {
      const distance = getDistance(target, coord);

      if (distance < minDistance) {
        minDistance = distance;
        closestKey = key as keyof typeof STUDY_LOCATION_CENTER_MAPPING;
      }
    }
    switch (closestKey) {
      case "[강남/서초]":
        return "https://open.kakao.com/o/gumMh9qi";
      case "[마포/당산/영등포]":
        return "https://open.kakao.com/o/gJUzedri";
      case "[성북/동대문/노원]":
        return "https://open.kakao.com/o/gc6NV8qi";
      case "[성수/왕십리/건대]":
        return "https://open.kakao.com/o/ghxrj9qi";
      default:
        return "https://open.kakao.com/o/gCRegnOh";
    }
  }

  const result = getClosestStudyCrewLink({
    latitude,
    longitude,
  });

  navigateExternalLink(result);
};

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
