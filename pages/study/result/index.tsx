import { Badge, Box, Button, Flex, Grid, GridItem } from "@chakra-ui/react";
import { minutesToHours } from "date-fns";
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
import { STUDY_RECORD_MODAL_AT } from "../../../constants/keys/queryKeys";
import { useTypeToast } from "../../../hooks/custom/CustomToast";
import { useStudyPassedDayQuery } from "../../../hooks/study/queries";
import { useUserInfoQuery } from "../../../hooks/user/queries";
import { useCollectionAlphabetQuery } from "../../../hooks/user/sub/collection/queries";
import { findMyStudyByUserId, findMyStudyInfo } from "../../../libs/study/studySelectors";
import PointScoreBar from "../../../pageTemplates/point/pointScore/PointScoreBar";
import StudyHeader from "../../../pageTemplates/study/StudyHeader";
import { changeAlphabet } from "../../../pageTemplates/user/UserCollection2";
import { dayjsToFormat, dayjsToTime } from "../../../utils/dateTimeUtils";
import { getRandomIdx } from "../../../utils/mathUtils";
function StudyResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeToast = useTypeToast();
  const dateParam = searchParams.get("date");

  const { data: userInfo } = useUserInfoQuery();
  const { data: collectionInfo } = useCollectionAlphabetQuery();

  useEffect(() => {
    localStorage.setItem(STUDY_RECORD_MODAL_AT, null);
  }, []);

  const { data: studyVoteData } = useStudyPassedDayQuery(dateParam, {
    enabled: !!dateParam,
  });
  const myStudy = findMyStudyByUserId(studyVoteData, userInfo?._id);
  const myStudyInfo = findMyStudyInfo(myStudy, userInfo?._id);
  const place = myStudy?.place;

  const alphabet =
    collectionInfo?.stamps === 0
      ? collectionInfo?.collects?.[collectionInfo?.collects?.length - 1]
      : null;

  //스터디 기본 이미지
  const { text: badgeText, colorScheme: badgeColorScheme } =
    STUDY_STATUS_TO_BADGE[myStudy?.status] || {};

  const studyTime = dayjs(myStudyInfo?.time.end).diff(dayjs(myStudyInfo?.attendance?.time), "m");

  const getStudyTime = `${Math.floor(studyTime / 60)}시간 ${studyTime % 60}분`;
  const members = myStudy?.members;

  const lateTime =
    dayjs(myStudyInfo?.attendance?.time).diff(dayjs(myStudyInfo?.time.start), "m") > 0
      ? `${dayjs(myStudyInfo?.attendance?.time).diff(dayjs(myStudyInfo?.time.start), "m")}분 지각`
      : "빠른 출석";

  const accumulationHour =
    userInfo &&
    `${Math.ceil(userInfo.studyRecord.monthMinutes / 60)}시간 ${
      userInfo.studyRecord.monthMinutes % 60
    }분`;

  const gridProps = myStudyInfo && [
    {
      title: "당일 목표 시간",
      text: `${dayjsToTime(dayjs(myStudyInfo.time.start))} ~ ${dayjsToTime(
        dayjs(myStudyInfo.time.end),
      )}`,
    },
    {
      title: "출석 체크",
      text: `${dayjsToTime(dayjs(myStudyInfo.attendance.time))}(${lateTime})`,
    },
    {
      title: "달성 시간",
      text: getStudyTime,
    },
    {
      title: "월간 누적 스터디 시간",
      text: accumulationHour,
    },
  ];

  const targetHour = userInfo?.monthStudyTarget;

  const myRank =
    myStudy && myStudy.members
      ? [...myStudy.members]
          .sort((a, b) => {
            const aTime = dayjs(a.attendance.time).diff(a.time.end);
            const bTime = dayjs(b.attendance.time).diff(b.time.end);
            return aTime - bTime;
          })
          .findIndex((who) => who.user._id === userInfo?._id)
      : null;

  return (
    <>
      {myStudy && <StudyHeader placeInfo={myStudy?.place} />}
      <Slide isNoPadding>
        {myStudyInfo && (
          <>
            <Box position="relative" w="full" aspectRatio={1 / 1}>
              <Image
                src={
                  myStudyInfo.attendance?.attendanceImage ||
                  place?.image ||
                  STUDY_MAIN_IMAGES[getRandomIdx(STUDY_MAIN_IMAGES.length)]
                }
                fill
                alt="studyRecordImage"
              />
            </Box>
            <Flex mx={5} align="center" mt="30px" mb={4} justify="space-between">
              <Box fontWeight="bold" fontSize="20px" lineHeight="32px">
                {dayjsToFormat(dayjs(dateParam).locale("ko"), "M월 D일(ddd) 스터디 기록")}
              </Box>
              <Badge size="lg" colorScheme={badgeColorScheme}>
                {badgeText}
              </Badge>
            </Flex>
            <Flex
              mx={5}
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
                <Box color="gray.500">월간 목표 시간</Box>
                <Box color="gray.800">
                  {targetHour ? `${minutesToHours(targetHour)}시간` : "미설정"}
                </Box>
              </Flex>
              <Flex justify="space-between" w="full" h={2}>
                <Box w="1px" bg="gray.200" />
                <Box w="1px" bg="gray.200" />
              </Flex>
              <ProgressBar value={(userInfo?.studyRecord.monthMinutes / 1) * 60} size="sm" />
              <Flex
                lineHeight="12px"
                mt={2}
                fontSize="11px"
                fontWeight="regular"
                justify="space-between"
              >
                <Box color="gray.500">월간 누적 스터디 시간</Box>
                <Box color="blue" fontWeight="bold">
                  {accumulationHour}
                </Box>
              </Flex>
            </Flex>
            <Grid
              mx={5}
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
            <Flex direction="column" mx={5}>
              <Flex mb={4} lineHeight="28px" justify="space-between">
                <Box fontSize="18px" fontWeight="bold">
                  오늘 스터디 랭킹
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
                    <RankingNumIcon num={myRank + 1} />
                  </Box>
                }
              />
              <Box pt={1} pb={3} borderTop="var(--border)" borderBottom="var(--border)">
                <Box mt={3}>
                  <PointScoreBar />
                </Box>
                <IconRowBlock
                  func={() => {
                    typeToast("inspection");
                  }}
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
            <Box fontSize="18px" fontWeight="bold" mx={5}>
              같이 공부한 인원
            </Box>
            <Box mb={10} mx={5}>
              {members.map((member, idx) => {
                const isMyFriend = userInfo?.friend.includes(member.user.uid);

                return (
                  <ProfileCommentCard
                    user={member.user}
                    memo={member.user.comment}
                    key={idx}
                    rightComponent={
                      <Flex>
                        {member.user._id !== userInfo?._id && (
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
                        )}
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
      <BottomNavButton text="카페 후기 작성하기" color="black" func={() => typeToast("not-yet")} />
    </>
  );
}

export default StudyResultPage;
