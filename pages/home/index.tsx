import { Box } from "@chakra-ui/react";
import Slide from "../../components/layouts/PageSlide";
import HomeBannerSlide from "../../pageTemplates/home/HomeBannerSlide";
import HomeGatherSection from "../../pageTemplates/home/HomeGatherSection";
import HomeGroupSection from "../../pageTemplates/home/HomeGroupSection";
import HomeHeader from "../../pageTemplates/home/homeHeader/HomeHeader";
import HomeInitialSetting from "../../pageTemplates/home/HomeInitialSetting";
function Home() {
  return (
    <>
      <HomeInitialSetting />
      <HomeHeader />
      <Slide isNoPadding>
        <HomeBannerSlide />
      </Slide>
      <Slide isNoPadding>
        <Box h={2} />
        <HomeGatherSection />
      </Slide>
      {/* <Slide>
        <HomeReviewSection />
      </Slide> */}
      <Slide isNoPadding>
        <HomeGroupSection />
      </Slide>
      {/* <HomeGroupStudySection groups={data} /> */}
      {/* <HomeFooter /> */}
      {/* <Slide isNoPadding>
        <HomeStudySection />
      </Slide> */}
    </>
  );
}

export default Home;
