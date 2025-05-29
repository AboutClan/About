import Slide from "../../components/layouts/PageSlide";
import { useSendFCMTestQuery } from "../../hooks/FcmManger/mutations";
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

  const { data: data2 } = useSendFCMTestQuery();
  console.log(23, data2);

  return (
    <>
      <HomeInitialSetting />
      <HomeHeader />
      <Slide>
        <HomeBannerSlide />
        <HomeNav />
      </Slide>
      {/* <Slide isNoPadding>
        <HomeStudySection />
      </Slide> */}
      <Slide isNoPadding>
        <HomeGatherSection />
      </Slide>
      <Slide>
        <HomeReviewSection />
      </Slide>
      <Slide isNoPadding>
        <HomeGroupSection groups={data} />
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
