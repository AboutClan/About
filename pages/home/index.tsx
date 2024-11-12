import Slide from "../../components/layouts/PageSlide";
import HomeBannerSlide from "../../pageTemplates/home/HomeBannerSlide";
import HomeGatherSection from "../../pageTemplates/home/HomeGatherSection";
import HomeGroupSection from "../../pageTemplates/home/HomeGroupSection";
import HomeHeader from "../../pageTemplates/home/homeHeader/HomeHeader";
import HomeInitialSetting from "../../pageTemplates/home/HomeInitialSetting";
import HomeNav from "../../pageTemplates/home/HomeNav";
import HomeStudySection from "../../pageTemplates/home/HomeStudySection";

function Home() {
  return (
    <>
      <HomeInitialSetting />
      <HomeHeader />
      <Slide>
        <HomeBannerSlide />
        <HomeNav />
      </Slide>
      <Slide>
        <HomeGatherSection />
        <HomeGroupSection />
      </Slide>
      <Slide isNoPadding>
        <HomeStudySection />
      </Slide>
    </>
  );
}

export default Home;
