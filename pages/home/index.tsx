import { Box } from "@chakra-ui/react";

import Divider from "@/components/atoms/Divider";
import Slide from "@/components/layouts/PageSlide";
import HomeActivityDrawer from "@/components/overlay/HomeActivityDrawer";
import HomeActivityIntroPopup from "@/components/overlay/HomeActivityIntroPopup";
import ChallengeSection from "@/features/home/screens/ChallengeSection";
import HomeBannerSlide from "@/features/home/screens/HomeBannerSlide";
import HomeFooter from "@/features/home/screens/HomeFooter";
import HomeGatherSection from "@/features/home/screens/HomeGatherSection";
import HomeGroupSection from "@/features/home/screens/HomeGroupSection";
import HomeHeader from "@/features/home/screens/homeHeader/HomeHeader";
import HomeHotClubSection from "@/features/home/screens/HomeHotClubSection";
import HomeInitialSetting from "@/features/home/screens/HomeInitialSetting";
import HomeNav from "@/features/home/screens/HomeNav";
import HomeReviewSection from "@/features/home/screens/HomeReviewSection";
import HomeStudySection from "@/features/home/screens/HomeStudySection";

function Home() {
  return (
    <>
      <HomeInitialSetting />
      {/* <HomeActivityIntroPopup /> */}
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
      <Box h={2} />
      <Slide isNoPadding>
        <HomeHotClubSection />
      </Slide>
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
      {/* <HomeFooter /> */}
      {/* <Slide isNoPadding>
        <HomeStudySection />
      </Slide> */}
    </>
  );
}

export default Home;
