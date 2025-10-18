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
      {/* <meta property="og:title" content="ABOUT" />
      <meta property="og:url" content={process.env.NEXT_PUBLIC_NEXTAUTH_URL} />
      <meta
        property="og:description"
        content="20대 모임 끝.판.왕!! 스터디, 취미, 친목, 취업 등. 너가 찾던 모든 모임을 한 곳에!"
      />
      <meta property="og:image" content="/images/thumbnail.jpg" /> */}
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

export async function getServerSideProps() {
  return { props: {} }; // 빈 props여도 OK — SSR 강제됨
}
