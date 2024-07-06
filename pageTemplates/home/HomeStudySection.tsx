import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { useStudyDailyVoteCntQuery, useStudyVoteQuery } from "../../hooks/study/queries";
import { ActiveLocation, LocationEn } from "../../types/services/locationTypes";
import { convertLocationLangTo } from "../../utils/convertUtils/convertDatas";
import HomeLocationBar from "./study/HomeLocationBar";
import HomeNewStudySpace from "./study/HomeNewStudySpace";
import HomeStudyChart from "./study/HomeStudyChart";
import HomeStudyCol from "./study/HomeStudyCol";
import StudyController from "./study/studyController/StudyController";

function HomeStudySection() {
  const searchParams = useSearchParams();
  const date = searchParams.get("date");
  const location = searchParams.get("location");
  const locationKr = convertLocationLangTo(location as LocationEn, "kr");

  const [selectedDate, setSelectedDate] = useState<string>();

  const { data: studyVoteData } = useStudyVoteQuery(date as string, locationKr, {
    enabled: !!date && !!location,
  });

  const selectedDateDayjs = dayjs(selectedDate);

  const { data: voteCntArr } = useStudyDailyVoteCntQuery(
    convertLocationLangTo(location as ActiveLocation, "kr"),
    selectedDateDayjs.startOf("month"),
    selectedDateDayjs.endOf("month"),
    {
      enabled: !!location,
    },
  );

  const newStudyPlaces = studyVoteData
    ?.filter(
      (par) =>
        par.place?.registerDate &&
        dayjs(par.place.registerDate).isAfter(dayjs().subtract(2, "month")),
    )
    .map((par) => par.place);

  return (
    <>
      <HomeLocationBar />
      <Box px="16px">
        <StudyController
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          studyVoteData={studyVoteData}
          voteCntArr={voteCntArr}
        />
        <HomeStudyCol />
      </Box>
      <HomeNewStudySpace places={newStudyPlaces} />
      <HomeStudyChart voteCntArr={voteCntArr} />
    </>
  );
}

export default HomeStudySection;
