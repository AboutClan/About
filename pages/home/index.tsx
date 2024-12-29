import Slide from "../../components/layouts/PageSlide";
import { useGroupSnapshotQuery } from "../../hooks/groupStudy/queries";
import HomeBannerSlide from "../../pageTemplates/home/HomeBannerSlide";
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
      <Slide>
        {/* <HomeGroupStudySection groups={data} /> */}
        <HomeGatherSection />
        <HomeReviewSection />
        <HomeGroupSection groups={data} />
      </Slide>
      {/* <Slide isNoPadding>
        <HomeStudySection />
      </Slide> */}
    </>
  );
}

export default Home;
