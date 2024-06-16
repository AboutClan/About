import { Box } from "@chakra-ui/react";
import { useState } from "react";

import Slide from "../../components/layouts/PageSlide";
import { useGatherQuery } from "../../hooks/gather/queries";
import HomeGatherSection from "../../pageTemplates/home/HomeGatherSection";
import HomeHeader from "../../pageTemplates/home/homeHeader/HomeHeader";
import HomeInitialSetting from "../../pageTemplates/home/HomeInitialSetting";
import HomeStudySection from "../../pageTemplates/home/HomeStudySection";
import HomeCategoryNav from "../../pageTemplates/home/HomeTab";
import EventBanner from "../../pageTemplates/home/study/EventBanner";

function Home() {
  const [tab, setTab] = useState<"스터디" | "모임">("스터디");

  useGatherQuery();

  return (
    <>
      <HomeInitialSetting />
      <HomeHeader />
      <HomeCategoryNav tab={tab} setTab={setTab} />
      <Slide>
        <EventBanner />
      </Slide>
      {tab === "스터디" ? <HomeStudySection /> : <HomeGatherSection />}
      <Box w="100%" h="40px" />
    </>
  );
}

export default Home;
