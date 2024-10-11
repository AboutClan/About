import "swiper/css";
import "swiper/css/navigation";

import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";

import Slide from "../../components/layouts/PageSlide";
import { USER_LOCATION } from "../../constants/keys/localStorage";
import { useStudyVoteQuery } from "../../hooks/study/queries";
import { ActiveLocation } from "../../types/services/locationTypes";
import { dayjsToFormat, dayjsToStr } from "../../utils/dateTimeUtils";
import HomeGatherCol from "./HomeGatherCol";
import StudyCardCol from "./study/StudyCardCol";

function HomeRecommendationSection() {
  const { data: session } = useSession();

  const userLocation = localStorage.getItem(USER_LOCATION) as ActiveLocation;
  console.log(session, userLocation);
  const { data: studyVoteData, isLoading } = useStudyVoteQuery(
    dayjsToStr(dayjs()),
    userLocation || session?.user.location,

    {
      enabled: !!userLocation || !!session?.user.location,
    },
  );

  return (
    <>
      <Box p={4}>
        <Box fontSize="18px" fontWeight={600} mb={4}>
          {dayjsToFormat(dayjs(), "M월 D일")} 카공 스터디
        </Box>

        <StudyCardCol
          participations={studyVoteData?.participations}
          isLoading={isLoading}
          date={dayjsToStr(dayjs())}
        />
      </Box>
      <Slide>
        <HomeGatherCol />
      </Slide>
    </>
  );
}

export default HomeRecommendationSection;
