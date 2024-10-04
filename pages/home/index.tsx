import { Box } from "@chakra-ui/react";
import { useState } from "react";

import Slide from "../../components/layouts/PageSlide";
import HomeCalendarSection from "../../pageTemplates/home/HomeCalendarSection";
import HomeGatherSection from "../../pageTemplates/home/HomeGatherSection";
import HomeHeader from "../../pageTemplates/home/homeHeader/HomeHeader";
import HomeInitialSetting from "../../pageTemplates/home/HomeInitialSetting";
import HomeRecommendationSection from "../../pageTemplates/home/HomeRecommendationSection";
import HomeStudySection from "../../pageTemplates/home/HomeStudySection";
import HomeCategoryNav, { HomeTab } from "../../pageTemplates/home/HomeTab";
import EventBanner from "../../pageTemplates/home/study/EventBanner";
function Home() {
  const [tab, setTab] = useState<HomeTab>();

  return (
    <>
      <HomeInitialSetting />
      <HomeHeader />
      <Slide isNoPadding>
        <HomeCategoryNav tab={tab} setTab={setTab} />
        {tab !== "스터디" && <EventBanner tab={tab} />}
      </Slide>

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
    </>
  );
}

export default Home;
