import Slide from "../../components/layouts/PageSlide";
import { useGroupSnapshotQuery } from "../../hooks/groupStudy/queries";
import HomeBannerSlide from "../../pageTemplates/home/HomeBannerSlide";
import HomeFooter from "../../pageTemplates/home/HomeFooter";
import HomeGatherSection from "../../pageTemplates/home/HomeGatherSection";
import HomeGroupSection from "../../pageTemplates/home/HomeGroupSection";
import HomeHeader from "../../pageTemplates/home/homeHeader/HomeHeader";
import HomeInitialSetting from "../../pageTemplates/home/HomeInitialSetting";
import HomeNav from "../../pageTemplates/home/HomeNav";
import HomeReviewSection from "../../pageTemplates/home/HomeReviewSection";

function Home() {
  const { data: data } = useGroupSnapshotQuery();

  return (
    <>
      <HomeInitialSetting />
      <HomeHeader />
      <Slide>
        <HomeBannerSlide />
        <HomeNav />
      </Slide>
      <Slide isNoPadding>
        <HomeGatherSection />
      </Slide>
      <Slide>
        {/* <HomeGroupStudySection groups={data} /> */}
        <HomeReviewSection />
      </Slide>
      <Slide isNoPadding>
        <HomeGroupSection groups={data} />
      </Slide>
      <HomeFooter />
      {/* <Slide isNoPadding>
        <HomeStudySection />
      </Slide> */}
    </>
  );
}

export default Home;
