import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSearchParams } from "next/navigation";

import Slide from "../../components/layouts/PageSlide";
import { useStudyVoteQuery } from "../../hooks/study/queries";
import { LocationEn } from "../../types/services/locationTypes";
import { convertLocationLangTo } from "../../utils/convertUtils/convertDatas";
import HomeLocationBar from "./study/HomeLocationBar";
import HomeNewStudySpace from "./study/HomeNewStudySpace";
import HomeStudyChart from "./study/HomeStudyChart";
import HomeStudyCol from "./study/HomeStudyCol";
import StudyController from "./study/studyController/StudyController";
//2
function HomeStudySection() {
  const searchParams = useSearchParams();
  const date = searchParams.get("date");
  const location = searchParams.get("location");
  const locationKr = convertLocationLangTo(location as LocationEn, "kr");

  const { data: studyVoteData } = useStudyVoteQuery(date as string, locationKr, {
    enabled: !!date && !!location,
  });

  const newStudyPlaces = studyVoteData
    ?.filter(
      (par) =>
        par.place?.registerDate &&
        dayjs(par.place.registerDate).isAfter(dayjs().subtract(2, "month")),
    )
    .map((par) => par.place);

  return (
    <>
      <Slide>
        <HomeLocationBar />
      </Slide>
      <Box px="16px">
        <StudyController studyVoteData={studyVoteData} />
        <HomeStudyCol />
      </Box>
      <Slide>
        <HomeNewStudySpace places={newStudyPlaces} />
        <HomeStudyChart />
      </Slide>
    </>
  );
}

export default HomeStudySection;
