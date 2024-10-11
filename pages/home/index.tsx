import { Box } from "@chakra-ui/react";
import { useState } from "react";

import Slide from "../../components/layouts/PageSlide";
import HomeBannerSlide from "../../pageTemplates/home/HomeBannerSlide";
import HomeCalendarSection from "../../pageTemplates/home/HomeCalendarSection";
import HomeGatherSection from "../../pageTemplates/home/HomeGatherSection";
import HomeHeader from "../../pageTemplates/home/homeHeader/HomeHeader";
import HomeInitialSetting from "../../pageTemplates/home/HomeInitialSetting";
import HomeNav from "../../pageTemplates/home/HomeNav";
import HomeRecommendationSection from "../../pageTemplates/home/HomeRecommendationSection";
import HomeStudySection from "../../pageTemplates/home/HomeStudySection";

import { HomeTab } from "../../pageTemplates/home/HomeTab";
function Home() {
  const [tab, setTab] = useState<HomeTab>();

  return (
    <>
      <HomeInitialSetting />
      <HomeHeader />
      <Slide>
        <HomeBannerSlide tab={tab} />
        <HomeNav />
        <HomeStudySection />
        <>
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
        </>
      </Slide>
    </>
  );
}

export default Home;
