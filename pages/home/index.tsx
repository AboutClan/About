import { Box } from "@chakra-ui/react";
import { useState } from "react";

import Slide from "../../components/layouts/PageSlide";
import HomeClubSection from "../../pageTemplates/home/HomeClubSection";
import HomeGatherSection from "../../pageTemplates/home/HomeGatherSection";
import HomeHeader from "../../pageTemplates/home/homeHeader/HomeHeader";
import HomeInitialSetting from "../../pageTemplates/home/HomeInitialSetting";
import HomeRankingSection from "../../pageTemplates/home/HomeRankingSection";
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
          {tab !== "추천" && <EventBanner tab={tab} />}
          {tab === "스터디" ? (
            <HomeStudySection />
          ) : tab === "번개" ? (
            <HomeGatherSection />
          ) : tab === "캘린더" ? (
            <HomeClubSection />
          ) : tab === "추천" ? (
            <HomeRankingSection />
          ) : null}
          <Box w="100%" h="40px" />
        </>
      </Slide>
    </>
  );
}

export default Home;
