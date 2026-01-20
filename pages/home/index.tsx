import Slide from "../../components/layouts/PageSlide";
import HomeBannerSlide from "../../pageTemplates/home/HomeBannerSlide";
import HomeFooter from "../../pageTemplates/home/HomeFooter";
import HomeGatherSection from "../../pageTemplates/home/HomeGatherSection";
import HomeGroupSection from "../../pageTemplates/home/HomeGroupSection";
import HomeInitialSetting from "../../pageTemplates/home/HomeInitialSetting";
import HomeNav from "../../pageTemplates/home/HomeNav";
import HomeReviewSection from "../../pageTemplates/home/HomeReviewSection";

function Home() {
  return (
    <>
      <HomeInitialSetting />
      {/* <HomeHeader /> */}
      <Slide isNoPadding>
        <HomeBannerSlide />
      </Slide>
      <Slide>
        <HomeNav />
      </Slide>
      {/* <Slide isNoPadding>
        <HomeStudySection />
      </Slide> */}
      <Slide isNoPadding>
        <HomeGatherSection />
      </Slide>
      <Slide isNoPadding>
        <HomeGroupSection />
      </Slide>
      <Slide>
        <HomeReviewSection />
      </Slide>{" "}
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
