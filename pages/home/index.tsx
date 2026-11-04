import { Box } from "@chakra-ui/react";

import Slide from "@/components/layouts/PageSlide";
import HomeActivityDrawer from "@/components/overlay/HomeActivityDrawer";
import ChallengeSection from "@/features/home/screens/ChallengeSection";
import HomeBannerSlide from "@/features/home/screens/HomeBannerSlide";
import HomeGatherSection from "@/features/home/screens/HomeGatherSection";
import HomeHeader from "@/features/home/screens/homeHeader/HomeHeader";
import HomeHotClubSection from "@/features/home/screens/HomeHotClubSection";
import HomeInitialSetting from "@/features/home/screens/HomeInitialSetting";
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
      <Box h={3} />
      {/* 동아리 카테고리 숨김 */}
      {/* <Slide>
        <HomeNav />
      </Slide> */}

      <Slide isNoPadding>
        <HomeGatherSection type="regular" />
      </Slide>
      <Slide isNoPadding>
        <HomeStudySection />
      </Slide>
      <Box h={2} />
      <Slide isNoPadding>
        <HomeGatherSection type="upcoming" />
      </Slide>
      <Slide isNoPadding>
        <HomeGatherSection type="partner" />
      </Slide>
      <Slide isNoPadding>
        <HomeGatherSection type="past" />
      </Slide>
      <Slide isNoPadding>
        <HomeHotClubSection />
      </Slide>
      {/* 후기 섹션 숨김 */}
      {/* <Slide>
        <HomeReviewSection />
      </Slide> */}
      <Slide isNoPadding>
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
