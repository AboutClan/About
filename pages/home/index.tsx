import { Box } from "@chakra-ui/react";

import Slide from "../../components/layouts/PageSlide";
import HomeBannerSlide from "../../pageTemplates/home/HomeBannerSlide";
import HomeGatherSection from "../../pageTemplates/home/HomeGatherSection";
import HomeHeader from "../../pageTemplates/home/homeHeader/HomeHeader";
import HomeInitialSetting from "../../pageTemplates/home/HomeInitialSetting";
import HomeNav from "../../pageTemplates/home/HomeNav";
import HomeStudySection from "../../pageTemplates/home/HomeStudySection";

function Home() {
  return (
    <>
      <HomeInitialSetting />
      <HomeHeader />

      <Slide>
        <HomeBannerSlide />
        <HomeNav />
      </Slide>

      <Slide isNoPadding>
        <HomeStudySection />
      </Slide>

      <Slide>
        <Box my={5}>
          <HomeGatherSection />
        </Box>
      </Slide>

      {/* <>
        {tab === "추천" ? (
          <HomeRecommendationSection />
        ) : tab === "스터디" ? (
          <HomeStudySection />
        ) : tab === "번개" ? (
          <HomeGatherSection />
        ) : tab === "캘린더" ? (
          <HomeCalendarSection />
        ) : null}
        <Box w="100%" h="40px" />
      </> */}
    </>
  );
}

export default Home;
