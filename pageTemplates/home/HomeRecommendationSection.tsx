import "swiper/css";
import "swiper/css/navigation";

import { Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { Swiper, SwiperSlide } from "swiper/react";

import Image from "next/image";
import {
  CalendarIcon,
  CampfireIcon,
  GroupIcon,
  MemberIcon,
  StoreIcon,
} from "../../components/atoms/Icons/AboutCategoryIcons";
import { USER_LOCATION } from "../../constants/keys/localStorage";
import { VOTER_DATE_END } from "../../constants/settingValue/study/study";
import { useStudyVoteQuery } from "../../hooks/study/queries";
import { studyPairArrState } from "../../recoils/studyRecoils";
import { ActiveLocation } from "../../types/services/locationTypes";
import { dayjsToFormat, dayjsToStr } from "../../utils/dateTimeUtils";
import HomeGatherCol from "./HomeGatherCol";
import HomeStudyCol from "./study/HomeStudyCol";
interface HomeRecommendationItemProps {
  icon: React.ReactNode;
  title: string;
  url: string;
}

function HomeRecommendationSection() {
  const { data: session } = useSession();

  const todayDayjs = dayjs().hour() < VOTER_DATE_END ? dayjs() : dayjs().add(1, "day");
  const setStudyPairArr = useSetRecoilState(studyPairArrState);

  const userLocation = localStorage.getItem(USER_LOCATION) as ActiveLocation;

  const { data: studyVoteData, isLoading } = useStudyVoteQuery(
    dayjsToStr(todayDayjs),
    userLocation || session?.user.location,
    true,
    true,
    {
      enabled: !!userLocation || !!session?.user.location,
    },
  );

  useEffect(() => {
    if (studyVoteData) {
      setStudyPairArr(studyVoteData);
    }
  }, [studyVoteData]);

  const HOME_RECOMMENDATION_ICON_ARR: HomeRecommendationItemProps[] = [
    { icon: <CampfireIcon />, title: "랭킹", url: "/statistics" },
    { icon: <StoreIcon />, title: "스토어", url: "/store" },
    {
      icon: <MemberIcon />,
      title: "멤버",
      url: `/member/${session?.user.location}`,
    },
    { icon: <CalendarIcon />, title: "캘린더", url: "/calendar" },
    { icon: <GroupIcon />, title: "디스코드", url: "https://discord.gg/dDu2kg2uez" },
  ];
  return (
    <>
      {/* {HOME_RECOMMENDATION_TAB_CONTENTS.map((content) => (
        <RecommendationBannerCard key={content.title} {...content} />
      ))} */}
      <Flex justify="space-between" p={4} borderBottom="var(--border)">
        {HOME_RECOMMENDATION_ICON_ARR.map((item) => (
          <Link href={item.url} key={item.title}>
            <Flex justify="space-between" pb={1} direction="column" align="center">
              <Box p={1}>{item.icon}</Box>
              <Box fontSize="12px" mt={1}>
                {item.title}
              </Box>
            </Flex>
          </Link>
        ))}
      </Flex>{" "}
      <Flex
        mx={4}
        direction="column"
        p={4}
        pt={2}
        bgColor="var(--color-mint-light)"
        borderRadius="var(--rounded-lg)"
      >
        <Flex justify="space-between">
          <Flex direction="column" pb={3} pt={2}>
            <Box p={1} fontSize="17px" fontWeight={600}>
              공부하고 있는 친구 없나?
              <br />
              실시간으로 한눈에 확인하자!
            </Box>
            <Box p={1}>실시간 참여 인원: 34</Box>
          </Flex>
          <Flex
            justify="center"
            position="relative"
            align="center"
            mb="auto"
            fontSize="24px"
            height="100px"
            width="100px"
            mr={2}
          >
            <Box>
              <Image
                src="https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%8F%99%EC%95%84%EB%A6%AC/%EB%8F%99%EC%95%84%EB%A6%AC+%EC%A7%84%EC%A7%9C+%EC%A7%80%EB%8F%84.png"
                width={100}
                height={100}
                alt="map"
              />
            </Box>
            <Box
              position="absolute"
              bottom="32px"
              right="4px"
              width="80px"
              height="30px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="var(--gray-600)"
            >
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                position="absolute"
                top="0"
                right="0"
                transform="translate(-50%, -50%)"
              >
                <Image
                  src="https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%8F%99%EC%95%84%EB%A6%AC/%EB%8F%8B%EB%B3%B4%EA%B8%B0%EC%9E%85%EB%8B%88%EB%8B%A4.png"
                  width={60}
                  height={60}
                  alt="돋보기"
                />
              </Box>
            </Box>
          </Flex>
        </Flex>
        <Button colorScheme="mintTheme">실시간 스터디 참여하기</Button>
      </Flex>
      <Swiper
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
        }}
        slidesPerView={1.1}
      >
        <SwiperSlide>
          <Box p={4}>
            <Box fontSize="18px" fontWeight={600} mb={4}>
              {dayjsToFormat(todayDayjs, "M월 D일")} 카공 스터디
            </Box>
            <Box>
              <HomeStudyCol
                studyVoteData={studyVoteData?.[0]?.participations}
                isLoading={isLoading}
                date={dayjsToStr(todayDayjs)}
                isShort
              />
            </Box>
          </Box>
        </SwiperSlide>
        <SwiperSlide>
          <Box p={4} pl={0}>
            <Box fontSize="18px" fontWeight={600} mb={4}>
              {dayjsToFormat(todayDayjs.add(1, "day"), "M월 D일")} 스터디
            </Box>
            <Box>
              <HomeStudyCol
                studyVoteData={studyVoteData?.[1]?.participations}
                isLoading={isLoading}
                date={dayjsToStr(todayDayjs.add(1, "day"))}
                isShort
              />
            </Box>
          </Box>
        </SwiperSlide>
      </Swiper>
      <HomeGatherCol />
    </>
  );
}

export default HomeRecommendationSection;
