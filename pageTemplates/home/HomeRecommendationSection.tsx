import "swiper/css";
import "swiper/css/navigation";

import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { Swiper, SwiperSlide } from "swiper/react";

import {
  CalendarIcon,
  CampfireIcon,
  GroupIcon,
  MemberIcon,
  StoreIcon,
} from "../../components/atoms/Icons/AboutCategoryIcons";
import Slide from "../../components/layouts/PageSlide";
import { USER_LOCATION } from "../../constants/keys/localStorage";
import { STUDY_VOTE_END_HOUR } from "../../constants/settingValue/study/study";
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

  const todayDayjs = dayjs().hour() < STUDY_VOTE_END_HOUR ? dayjs() : dayjs().add(1, "day");
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
    { icon: <CampfireIcon />, title: "랭킹", url: "/ranking" },
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
                specialVoteData={studyVoteData?.[1]?.participations[0]}
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
      <Slide>
        <HomeGatherCol />
      </Slide>
    </>
  );
}

export default HomeRecommendationSection;
