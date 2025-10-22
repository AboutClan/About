import Slide from "../../components/layouts/PageSlide";
import HomeBannerSlide from "../../pageTemplates/home/HomeBannerSlide";
import HomeGatherSection from "../../pageTemplates/home/HomeGatherSection";
import HomeGroupSection from "../../pageTemplates/home/HomeGroupSection";
import HomeHeader from "../../pageTemplates/home/homeHeader/HomeHeader";
import HomeInitialSetting from "../../pageTemplates/home/HomeInitialSetting";
import HomeNav from "../../pageTemplates/home/HomeNav";
import HomeReviewSection from "../../pageTemplates/home/HomeReviewSection";
import HomeStudySection from "../../pageTemplates/home/HomeStudySection";

function Home() {
  return (
    <>
      <HomeInitialSetting />
      <HomeHeader />
      <Slide isNoPadding>
        <HomeBannerSlide />
      </Slide>
      <Slide>
        <HomeNav />
      </Slide>
      <Slide isNoPadding>
        <HomeStudySection />
      </Slide>
      <Slide isNoPadding>
        <HomeGatherSection />
      </Slide>
      <Slide>
        <HomeReviewSection />
      </Slide>
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
