import { Box } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import Slide from "../../components/layouts/PageSlide";
import { HAS_STUDY_TODAY } from "../../constants/keys/localStorage";
import HomeCategoryNav from "../../pageTemplates/home/HomeCategoryNav";
import HomeGatherSection from "../../pageTemplates/home/HomeGatherSection";
import HomeHeader from "../../pageTemplates/home/homeHeader/HomeHeader";
import HomeInitialSetting from "../../pageTemplates/home/HomeInitialSetting";
import HomeLocationBar from "../../pageTemplates/home/HomeLocationBar";
import HomeReviewSection from "../../pageTemplates/home/HomeReviewSection";
import HomeStudySection from "../../pageTemplates/home/HomeStudySection";
import HomeWinRecordSection from "../../pageTemplates/home/HomeWinRecordSection";
import StudyController from "../../pageTemplates/home/studyController/StudyController";
import { LocationEn } from "../../types/services/locationTypes";
import { getUrlWithLocationAndDate } from "../../utils/convertUtils/convertTypes";

function Home() {
  const router = useRouter();
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const locationParam = searchParams.get("location") as LocationEn;
  const dateParam = searchParams.get("date");

  const hasStudyToday = localStorage.getItem(HAS_STUDY_TODAY);

  useEffect(() => {
    if (session?.user && (!locationParam || !dateParam)) {
      const initialUrl = getUrlWithLocationAndDate(
        locationParam,
        dateParam,
        session.user.location,
        hasStudyToday === "true",
      );
      router.replace(initialUrl);
    }
  }, [session?.user, locationParam, dateParam]);

  return (
    <>
      <HomeInitialSetting />
      <HomeHeader />
      {/* <HomeMainBanner /> */}

      <Slide>
        <HomeCategoryNav />
        <Box p="0 20px">
          <HomeLocationBar />
          <StudyController />
          <HomeStudySection />
          <HomeGatherSection />
          <HomeReviewSection />
          <HomeWinRecordSection />
        </Box>
      </Slide>
    </>
  );
}

export default Home;
