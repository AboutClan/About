import { useEffect } from "react";

import Slide from "../../components/layouts/PageSlide";
import HomeBannerSlide from "../../pageTemplates/home/HomeBannerSlide";
import HomeGatherSection from "../../pageTemplates/home/HomeGatherSection";
import HomeGroupSection from "../../pageTemplates/home/HomeGroupSection";
import HomeHeader from "../../pageTemplates/home/homeHeader/HomeHeader";
import HomeInitialSetting from "../../pageTemplates/home/HomeInitialSetting";
import HomeNav from "../../pageTemplates/home/HomeNav";
import HomeReviewSection from "../../pageTemplates/home/HomeReviewSection";

function Home() {
  useEffect(() => {
    const naver = (window as any).naver;
    if (!naver?.maps?.Service) return;

    const lat = 37.264263;
    const lng = 127.033944;

    naver.maps.Service.reverseGeocode(
      {
        coords: new naver.maps.LatLng(lat, lng),
        orders: naver.maps.Service.OrderType.ADDR, // 필요시
      },
      (status: any, res: any) => {
        if (status !== naver.maps.Service.Status.OK) {
          console.error("reverseGeocode 실패:", status);
          return;
        }
        // 가장 기본 주소 꺼내기 예시
        const addrResult = res?.results?.find((r: any) => r.name === "addr") ?? res?.results?.[0];
        console.log("주소 결과:", res, addrResult);
      },
    );
  }, []);

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
