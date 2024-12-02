import { Badge, Box, Button, Flex, Grid, GridItem } from "@chakra-ui/react";
import dayjs from "dayjs";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { STUDY_MAIN_IMAGES } from "../../../assets/images/studyMain";
import { AboutIcon } from "../../../components/atoms/AboutIcons";
import IconRowBlock from "../../../components/atoms/blocks/IconRowBlock";
import BottomNavButton from "../../../components/atoms/BottomNavButton";
import UserPlusButton from "../../../components/atoms/buttons/UserPlusButton";
import ProgressBar from "../../../components/atoms/ProgressBar";
import { ShortArrowIcon } from "../../../components/Icons/ArrowIcons";
import HeartIcon from "../../../components/Icons/HeartIcon";
import { RankingNumIcon } from "../../../components/Icons/RankingIcons";
import { StarIcon } from "../../../components/Icons/StarIcons";
import Slide from "../../../components/layouts/PageSlide";
import ProfileCommentCard from "../../../components/molecules/cards/ProfileCommentCard";
import { STUDY_RECORD } from "../../../constants/keys/localStorage";
import { STUDY_STATUS_TO_BADGE } from "../../../constants/studyConstants";
import { useStudyVoteOneQuery } from "../../../hooks/study/queries";
import { useUserInfoQuery } from "../../../hooks/user/queries";
import { useCollectionAlphabetQuery } from "../../../hooks/user/sub/collection/queries";
import PointScoreBar from "../../../pageTemplates/point/pointScore/PointScoreBar";
import StudyHeader from "../../../pageTemplates/study/StudyHeader";
import { changeAlphabet } from "../../../pageTemplates/user/userCollection";
import {
  RealTimeInfoProps,
  StudyParticipationProps,
} from "../../../types/models/studyTypes/studyDetails";
import { dayjsToFormat, dayjsToTime } from "../../../utils/dateTimeUtils";
import { getRandomIdx } from "../../../utils/mathUtils";
function StudyResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const dateParam = searchParams.get("date");

  const { data: userInfo } = useUserInfoQuery();
  const { data: collectionInfo } = useCollectionAlphabetQuery();

  useEffect(() => {
    localStorage.setItem(STUDY_RECORD, null);
  }, []);

  const { data: studyVoteOne } = useStudyVoteOneQuery(dateParam, {
    enabled: !!dateParam,
  });

  const findRealTime = studyVoteOne?.data?.[0] as RealTimeInfoProps;

  const findParticipation = studyVoteOne?.data as StudyParticipationProps;
  const findParStudy = findParticipation?.members?.find((who) => who.user.uid === userInfo?.uid);

  const commonAttendanceInfo = findRealTime || findParStudy;
  const rankNum = studyVoteOne?.rankNum;

  const alphabet =
    collectionInfo?.stamps === 0
      ? collectionInfo?.collects?.[collectionInfo?.collects?.length - 1]
      : null;

  //스터디 기본 이미지
  const { text: badgeText, colorScheme: badgeColorScheme } =
    STUDY_STATUS_TO_BADGE[findRealTime?.status || findParticipation?.status] || {};

  const studyTime = dayjs(commonAttendanceInfo?.time.end).diff(
    dayjs(commonAttendanceInfo?.attendanceInfo?.arrived),
    "m",
  );

  const getStudyTime = `${Math.floor(studyTime / 60)}시간 ${studyTime % 60}분`;
  const members =
    findParticipation?.members?.filter((who) => who.user.uid !== userInfo?.uid) ||
    (studyVoteOne?.data as RealTimeInfoProps[])?.filter(
      (one) => one.place.name === findRealTime?.place.name && one.user.uid !== userInfo?.uid,
    );

  const lateTime =
    dayjs(commonAttendanceInfo?.attendanceInfo.arrived).diff(
      dayjs(commonAttendanceInfo?.time?.start),
      "m",
    ) > 0
      ? `${dayjs(commonAttendanceInfo?.attendanceInfo.arrived).diff(
          dayjs(commonAttendanceInfo?.time?.start),
          "m",
        )}분 지각`
      : "빠른 출석";

  const accumulationHour =
    userInfo &&
    `${Math.ceil(userInfo.weekStudyAccumulationMinutes / 60)}시간 ${
      userInfo.weekStudyAccumulationMinutes % 60
    }분`;

  const gridProps = commonAttendanceInfo && [
    {
      title: "목표 시간",
      text: `${dayjsToTime(dayjs(commonAttendanceInfo.time.start))} ~ ${dayjsToTime(
        dayjs(commonAttendanceInfo.time.end),
      )}`,
    },
    {
      title: "출석 체크",
      text: `${dayjsToTime(dayjs(commonAttendanceInfo.attendanceInfo.arrived))}(${lateTime})`,
    },
    {
      title: "달성 시간",
      text: getStudyTime,
    },
    {
      title: "이번 주 누적 시간",
      text: accumulationHour,
    },
  ];

  const targetHour = userInfo?.weekStudyTargetHour;

  return (
    <>
      <StudyHeader brand="스터디 결과" />
      <Slide>
        {studyVoteOne && (
          <>
            <Box position="relative" w="full" aspectRatio={1 / 1}>
              <Image
                src={
                  commonAttendanceInfo.attendanceInfo?.attendanceImage ||
                  STUDY_MAIN_IMAGES[getRandomIdx(STUDY_MAIN_IMAGES.length)]
                }
                fill
                alt="studyRecordImage"
              />
            </Box>
            <Flex align="center" mt="30px" mb={4} justify="space-between">
              <Box fontWeight="bold" fontSize="20px" lineHeight="32px">
                {dayjsToFormat(dayjs(dateParam).locale("ko"), "M월 D일(ddd) 스터디")}
              </Box>
              <Badge mr={2} size="lg" colorScheme={badgeColorScheme}>
                {badgeText}
              </Badge>
            </Flex>
            <Flex
              mb={4}
              direction="column"
              borderRadius="8px"
              p={3}
              border="var(--border)"
              borderColor="gray.200"
            >
              <Flex
                lineHeight="12px"
                mb={2}
                fontSize="11px"
                fontWeight="regular"
                justify="space-between"
              >
                <Box color="gray.500">주간 목표 시간</Box>
                <Box color="gray.800">{targetHour ? `${targetHour}시간` : "미설정"}</Box>
              </Flex>
              <Flex justify="space-between" w="full" h={2}>
                <Box w="1px" bg="gray.200" />
                <Box w="1px" bg="gray.200" />
              </Flex>
              <ProgressBar
                value={(userInfo?.weekStudyAccumulationMinutes / targetHour) * 60}
                size="sm"
              />
              <Flex
                lineHeight="12px"
                mt={2}
                fontSize="11px"
                fontWeight="regular"
                justify="space-between"
              >
                <Box color="gray.500">누적 스터디 시간</Box>
                <Box color="blue" fontWeight="bold">
                  {accumulationHour}
                </Box>
              </Flex>
            </Flex>
            <Grid
              border="var(--border)"
              borderColor="gray.200"
              borderRadius="12px"
              templateColumns="repeat(2,1fr)"
              py={1}
              px={3}
            >
              {gridProps.map((prop) => (
                <GridItem py={3} key={prop.text} display="flex" flexDir="column">
                  <Box
                    mb={1}
                    fontWeight="medium"
                    fontSize="11px"
                    color="gray.500"
                    lineHeight="12px"
                  >
                    {prop.title}
                  </Box>
                  <Box fontSize="14px" fontWeight="semibold" lineHeight="20px">
                    {prop.text}
                  </Box>
                </GridItem>
              ))}
            </Grid>
            <Box h={2} bg="gray.100" my={5}></Box>
            <Flex direction="column">
              <Flex mb={4} lineHeight="28px" justify="space-between">
                <Box fontSize="18px" fontWeight="bold">
                  스터디 랭킹
                </Box>
                <Button variant="unstyled" onClick={() => router.push("/ranking")}>
                  <ShortArrowIcon size="sm" dir="right" />
                </Button>
              </Flex>
              <ProfileCommentCard
                user={userInfo}
                memo={userInfo?.comment}
                rightComponent={
                  <Box mr="10px">
                    <RankingNumIcon num={rankNum} />
                  </Box>
                }
              />
              <Box pt={1} pb={3} borderTop="var(--border)" borderBottom="var(--border)">
                <Box mt={3}>
                  <PointScoreBar />
                </Box>
                <IconRowBlock
                  leftIcon={
                    alphabet ? (
                      <AboutIcon alphabet={alphabet} isActive size="sm" />
                    ) : (
                      <Flex
                        justify="center"
                        align="center"
                        w={8}
                        h={8}
                        borderRadius="50%"
                        bg="var(--color-mint)"
                      >
                        <StarIcon />
                      </Flex>
                    )
                  }
                  mainText={alphabet ? `알파벳 ${changeAlphabet(alphabet)} 획득` : "스탬프 획득"}
                  subText={
                    alphabet
                      ? "알파벳을 수집해 상품을 획득해 봐요!"
                      : "스탬프를 모아 알파벳을 획득해 봐요 !"
                  }
                />
              </Box>
            </Flex>{" "}
            <Box h={2} bg="gray.100" my={5}></Box>
            <Box fontSize="18px" fontWeight="bold">
              같이 공부한 인원
            </Box>
            <Box mb={10}>
              {members.map((member, idx) => {
                const isMyFriend = userInfo?.friend.includes(member.user.uid);

                return (
                  <ProfileCommentCard
                    user={member.user}
                    memo={member.user.comment}
                    key={idx}
                    rightComponent={
                      <Flex>
                        <Button
                          mr={1}
                          borderRadius="50%"
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          w={5}
                          h={5}
                          variant="unstyled"
                        >
                          <HeartIcon toUid={member.user.uid} />
                        </Button>
                        <UserPlusButton isMyFriend={isMyFriend} toUid={member.user.uid} />
                      </Flex>
                    }
                  />
                );
              })}
            </Box>
          </>
        )}
      </Slide>
      <BottomNavButton
        text="홈 화면으로 돌아가기"
        color="black"
        func={() => router.push("/home")}
      />
    </>
  );
}

export default StudyResultPage;
