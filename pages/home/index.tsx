import { Box, Flex } from "@chakra-ui/react";
import { useState } from "react";

import Slide from "../../components/layouts/PageSlide";
import { useGatherQuery } from "../../hooks/gather/queries";
import HomeClubSection from "../../pageTemplates/home/HomeClubSection";
import HomeGatherSection from "../../pageTemplates/home/HomeGatherSection";
import HomeHeader from "../../pageTemplates/home/homeHeader/HomeHeader";
import HomeInitialSetting from "../../pageTemplates/home/HomeInitialSetting";
import HomeStudySection from "../../pageTemplates/home/HomeStudySection";
import HomeCategoryNav, { HomeTab } from "../../pageTemplates/home/HomeTab";
import EventBanner from "../../pageTemplates/home/study/EventBanner";

function Home() {
  const [tab, setTab] = useState<HomeTab>();

  useGatherQuery();

  return (
    <>
      <HomeInitialSetting />
      <HomeHeader />
      <Slide>
        <HomeCategoryNav tab={tab} setTab={setTab} />
        <>
          {tab !== "기타" && <EventBanner tab={tab} />}
          {tab === "스터디" ? (
            <HomeStudySection />
          ) : tab === "모임" ? (
            <HomeGatherSection />
          ) : tab === "동아리" ? (
            <HomeClubSection />
          ) : tab === "기타" ? (
            <Flex fontSize="20px" justify="center" align="center" h="200px">
              COMMING SOON
            </Flex>
          ) : null}
          <Box w="100%" h="40px" />
        </>
      </Slide>
    </>
  );
}

export default Home;
