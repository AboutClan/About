import "swiper/css";
import "swiper/css/navigation";

import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";

import Slide from "../../components/layouts/PageSlide";
import { dayjsToFormat } from "../../utils/dateTimeUtils";
import HomeGatherCol from "./HomeGatherCol";

function HomeRecommendationSection() {
  return (
    <>
      <Box p={4}>
        <Box fontSize="18px" fontWeight={600} mb={4}>
          {dayjsToFormat(dayjs(), "M월 D일")} 카공 스터디
        </Box>

        {/* <StudyCardCol participations={studyVoteData?.participations} date={dayjsToStr(dayjs())} /> */}
      </Box>
      <Slide>
        <HomeGatherCol />
      </Slide>
    </>
  );
}

export default HomeRecommendationSection;
