import { Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { LOCATION_OPEN } from "../../constants/location";
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

  const { data: studyVoteData, isLoading } = useStudyVoteQuery(date as string, locationKr, {
    enabled: !!date && !!location && LOCATION_OPEN.includes(locationKr as ActiveLocation),
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
      <Box p={4}>
        <Box fontSize="18px" fontWeight={600} py={4}>
          자동 빠른 스터디
        </Box>
        <Flex direction="column" p={4} bgColor="var(--color-mint-light)">
          <Flex justify="space-between">
            <Flex direction="column" pb={3}>
              <Box p={2} fontSize="18px" fontWeight={600}>
                바쁘다 바빠
                <br />
                알아서 좀 찾아주라
              </Box>
              <Box p={2} pt={1}>
                스터디 투표가 간단해요
              </Box>
            </Flex>
            <Flex justify="center" align="center" fontSize="24px" pr={4}>
              <i className="fa-solid fa-heart fa-2xl" />
            </Flex>
          </Flex>
          <Button colorScheme="mintTheme">스터디 투표하기</Button>
        </Flex>
      </Box>

      <HomeLocationBar />
      <Box px="16px">
        <StudyController
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          studyVoteData={studyVoteData}
          voteCntArr={voteCntArr}
        />
        <HomeStudyCol studyVoteData={studyVoteData} isLoading={isLoading} />
      </Box>
      <HomeNewStudySpace places={newStudyPlaces} />
      <HomeStudyChart voteCntArr={voteCntArr} />
    </>
  );
}

export default HomeStudySection;
