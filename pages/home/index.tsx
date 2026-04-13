import { Box } from "@chakra-ui/react";

import Divider from "../../components/atoms/Divider";
import Slide from "../../components/layouts/PageSlide";
import { useUserTestQuery } from "../../hooks/user/queries";
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
  const { data } = useUserTestQuery();
  console.log(512, data);

  return (
    <>
      <HomeInitialSetting />
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
