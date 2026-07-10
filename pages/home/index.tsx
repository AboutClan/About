import { Box } from "@chakra-ui/react";

import Divider from "../../components/atoms/Divider";
import Slide from "../../components/layouts/PageSlide";
import HomeActivityDrawer from "../../components/overlay/HomeActivityDrawer";
import HomeActivityIntroPopup from "../../components/overlay/HomeActivityIntroPopup";
import ChallengeSection from "../../pageTemplates/home/ChallengeSection";
import HomeBannerSlide from "../../pageTemplates/home/HomeBannerSlide";
import HomeFooter from "../../pageTemplates/home/HomeFooter";
import HomeGatherSection from "../../pageTemplates/home/HomeGatherSection";
import HomeGroupSection from "../../pageTemplates/home/HomeGroupSection";
import HomeHeader from "../../pageTemplates/home/homeHeader/HomeHeader";
import HomeInitialSetting from "../../pageTemplates/home/HomeInitialSetting";
import HomeNav from "../../pageTemplates/home/HomeNav";
import HomeReviewSection from "../../pageTemplates/home/HomeReviewSection";
import HomeStudySection from "../../pageTemplates/home/HomeStudySection";

function Home() {
  console.log
  return (
    <>
      <HomeInitialSetting />
      <HomeActivityIntroPopup />
      <HomeActivityDrawer />
      <HomeHeader />
      <Slide isNoPadding>
        <HomeBannerSlide />
      </Slide>
      <Box h={4} />
      <Slide>
        <HomeNav />
      </Slide>
      <Box>
        <Divider />
      </Box>
      <Slide isNoPadding>
        <HomeStudySection />
      </Slide>
      <Box h={2} />
      <Slide isNoPadding>
        <HomeGatherSection />
      </Slide>
      <Slide>
        <HomeReviewSection />
      </Slide>{" "}
      <Slide isNoPadding>
        <HomeGroupSection />
        <ChallengeSection />
      </Slide>
      {/* <Slide isNoPadding>
        <HomeGroupSection2 />
      </Slide> */}
      {/* <HomeGroupStudySection groups={data} /> */}
      <HomeFooter />
      {/* <Slide isNoPadding>
        <HomeStudySection />
      </Slide> */}
    </>
  );
}

export default Home;
