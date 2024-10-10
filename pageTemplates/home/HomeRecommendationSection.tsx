import "swiper/css";
import "swiper/css/navigation";

import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import Link from "next/link";

import {
  CalendarIcon,
  CampfireIcon,
  GroupIcon,
  MemberIcon,
  StoreIcon,
} from "../../components/atoms/Icons/AboutCategoryIcons";
import Slide from "../../components/layouts/PageSlide";
import { USER_LOCATION } from "../../constants/keys/localStorage";
import { useStudyVoteQuery } from "../../hooks/study/queries";
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

  const userLocation = localStorage.getItem(USER_LOCATION) as ActiveLocation;

  const { data: studyVoteData, isLoading } = useStudyVoteQuery(
    dayjsToStr(dayjs()),
    userLocation || session?.user.location,

    {
      enabled: !!userLocation || !!session?.user.location,
    },
  );

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
      <Box p={4}>
        <Box fontSize="18px" fontWeight={600} mb={4}>
          {dayjsToFormat(dayjs(), "M월 D일")} 카공 스터디
        </Box>

        <HomeStudyCol
          studyVoteData={studyVoteData?.participations}
          isLoading={isLoading}
          date={dayjsToStr(dayjs())}
          isShort
        />
      </Box>
      <Slide>
        <HomeGatherCol />
      </Slide>
    </>
  );
}

export default HomeRecommendationSection;
