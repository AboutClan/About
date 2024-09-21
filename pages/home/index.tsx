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
      <Slide>
        <HomeCategoryNav tab={tab} setTab={setTab} />
        <>
          {tab !== "스터디" && <EventBanner tab={tab} />}
          {tab === "스터디" ? (
            <HomeStudySection />
          ) : tab === "번개" ? (
            <HomeGatherSection />
          ) : tab === "캘린더" ? (
            <HomeCalendarSection />
          ) : tab === "추천" ? (
            <HomeRecommendationSection />
          ) : null}
          <Box w="100%" h="40px" />
        </>
      </Slide>
    </>
  );
}

export default Home;
