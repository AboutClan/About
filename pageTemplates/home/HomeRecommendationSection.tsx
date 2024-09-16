import { Box, Flex } from "@chakra-ui/react";
import "swiper/css";
import "swiper/css/navigation";

import { Swiper, SwiperSlide } from "swiper/react";
import {
  CalendarIcon,
  CampfireIcon,
  MemberIcon,
  PlazaIcon,
  StoreIcon,
} from "../../components/atoms/Icons/AboutCategoryIcons";
import { useStudyVoteQuery } from "../../hooks/study/queries";
import HomeGatherCol from "./HomeGatherCol";
import HomeStudyCol from "./study/HomeStudyCol";

interface HomeRecommendationItemProps {
  icon: React.ReactNode;
  title: string;
  func: () => void;
}

function HomeRecommendationSection() {
  const { data: studyVoteData, isLoading } = useStudyVoteQuery("2024-09-02", "수원", {});

  const HOME_RECOMMENDATION_ICON_ARR: HomeRecommendationItemProps[] = [
    { icon: <CampfireIcon />, title: "랭킹", func: () => {} },
    { icon: <StoreIcon />, title: "스토어", func: () => {} },
    { icon: <MemberIcon />, title: "멤버", func: () => {} },
    { icon: <CalendarIcon />, title: "달력", func: () => {} },
    { icon: <PlazaIcon />, title: "디스코드", func: () => {} },
  ];
  return (
    <>
      {/* {HOME_RECOMMENDATION_TAB_CONTENTS.map((content) => (
        <RecommendationBannerCard key={content.title} {...content} />
      ))} */}
      <Flex justify="space-between" p={4} borderBottom="var(--border)">
        {HOME_RECOMMENDATION_ICON_ARR.map((item) => (
          <Flex justify="space-between" pb={1} direction="column" align="center">
            <Box p={1}>{item.icon}</Box>
            <Box fontSize="12px" mt={1}>
              {item.title}
            </Box>
          </Flex>
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
            <Box fontSize="18px" fontWeight={600}>
              9월 14일 카공 스터디
            </Box>
            <Box>
              <HomeStudyCol studyVoteData={studyVoteData} isLoading={isLoading} />
            </Box>
          </Box>
        </SwiperSlide>
        <SwiperSlide>
          <Box p={4} pl={0}>
            <Box fontSize="18px" fontWeight={600}>
              9월 14일 스터디
            </Box>
            <Box>
              <HomeStudyCol studyVoteData={studyVoteData} isLoading={isLoading} />
            </Box>
          </Box>
        </SwiperSlide>
      </Swiper>
      <HomeGatherCol />
    </>
  );
}

export default HomeRecommendationSection;
