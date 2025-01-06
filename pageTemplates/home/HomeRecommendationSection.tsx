import "swiper/css";
import "swiper/css/navigation";

import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";

import { dayjsToFormat } from "../../utils/dateTimeUtils";

function HomeRecommendationSection() {
  return (
    <>
      <Box p={4}>
        <Box fontSize="18px" fontWeight={600} mb={4}>
          {dayjsToFormat(dayjs(), "M월 D일")} 카공 스터디
        </Box>

        {/* <StudyCardCol participations={studyVoteData?.participations} date={dayjsToStr(dayjs())} /> */}
      </Box>
    </>
  );
}

export default HomeRecommendationSection;
