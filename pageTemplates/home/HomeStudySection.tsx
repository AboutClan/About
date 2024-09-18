import { Box, Button, Flex, keyframes } from "@chakra-ui/react";
import dayjs from "dayjs";
import { AnimatePresence, motion, PanInfo } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";

import { LOCATION_OPEN } from "../../constants/location";
import { useTypeToast } from "../../hooks/custom/CustomToast";
import { useStudyDailyVoteCntQuery, useStudyVoteQuery } from "../../hooks/study/queries";
import { studyPairArrState } from "../../recoils/studyRecoils";
import { IParticipation } from "../../types/models/studyTypes/studyDetails";
import { ActiveLocation, LocationEn } from "../../types/services/locationTypes";
import { convertLocationLangTo } from "../../utils/convertUtils/convertDatas";
import { dayjsToStr } from "../../utils/dateTimeUtils";
import HomeLocationBar from "./study/HomeLocationBar";
import HomeNewStudySpace from "./study/HomeNewStudySpace";
import HomeStudyChart from "./study/HomeStudyChart";
import HomeStudyCol from "./study/HomeStudyCol";
import StudyController from "./study/studyController/StudyController";

const orbit = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;
const orbit2 = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(-360deg);
  }
`;

function HomeStudySection() {
  const { data: session } = useSession();
  const router = useRouter();
  const typeToast = useTypeToast();
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);
  const date = searchParams.get("date");
  const location = searchParams.get("location");
  const locationKr = convertLocationLangTo(location as LocationEn, "kr");
  const isGuest = session?.user.name === "guest";

  const [studyPairArr, setStudyPairArr] = useRecoilState(studyPairArrState);
  const [selectedDate, setSelectedDate] = useState<string>();
  const [studyVoteArr, setStudyVoteArr] = useState<IParticipation[]>();

  const findStudyData = studyPairArr?.find(
    (study) => dayjsToStr(dayjs(study.date)) === date,
  )?.participations;

  const { data: studyVoteData, isLoading } = useStudyVoteQuery(
    date as string,
    locationKr,
    true,
    true,
    {
      enabled:
        !findStudyData &&
        !!date &&
        !!locationKr &&
        LOCATION_OPEN.includes(locationKr as ActiveLocation),
    },
  );
  useStudyVoteQuery(date, locationKr, false, false, {
    enabled: !!locationKr && !!date,
  });

  useEffect(() => {
    setStudyPairArr(null);
  }, [locationKr]);

  useEffect(() => {
    if (isLoading) return;
    if (studyVoteData) setStudyPairArr(studyVoteData);
    if (findStudyData) setStudyVoteArr(findStudyData);
  }, [findStudyData, studyVoteData, isLoading]);

  const selectedDateDayjs = dayjs(selectedDate);

  const { data: voteCntArr } = useStudyDailyVoteCntQuery(
    locationKr,
    selectedDateDayjs.startOf("month"),
    selectedDateDayjs.endOf("month"),
    {
      enabled: !!locationKr,
    },
  );

  const newStudyPlaces = studyVoteArr
    ?.filter(
      (par) =>
        par.place?.registerDate &&
        dayjs(par.place.registerDate).isAfter(dayjs().subtract(2, "month")),
    )
    .map((par) => par.place);

  const handleMapVote = () => {
    if (isGuest) {
      typeToast("guest");
      return;
    }

    newSearchParams.delete("tab");
    router.push(`/vote?${newSearchParams.toString()}`);
  };

  const onDragEnd = (panInfo: PanInfo) => {
    const newDate = getNewDateBySwipe(panInfo, date as string);
    if (newDate !== date) {
      newSearchParams.set("date", newDate);
      router.replace(`/home?${newSearchParams.toString()}`, { scroll: false });
    }
    return;
  };

  return (
    <>
      <Box p={4} pb={5}>
        <Box fontSize="18px" fontWeight={600} py={4} pt={2}>
          빠른 스터디 투표
        </Box>
        <Flex
          direction="column"
          p={4}
          bgColor="var(--color-mint-light)"
          borderRadius="var(--rounded-lg)"
        >
          <Flex justify="space-between">
            <Flex direction="column" pb={3}>
              <Box p={2} fontSize="18px" fontWeight={600}>
                바쁘다 바빠
                <br />
                알아서 좀 찾아주라
              </Box>
              <Box p={2} pt={1}>
                스터디 투표가 효율적이에요
              </Box>
            </Flex>
            <Flex justify="center" align="center" fontSize="24px" pr={4}>
              <Box position="relative" width="50px" height="50px">
                <Box
                  position="absolute"
                  top="-12px"
                  right="16px"
                  width="100%"
                  height="100%"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color="var(--color-mint)"
                >
                  <i className="fa-duotone fa-solid fa-map-location-dot fa-2x"></i>
                </Box>

                <Box
                  position="absolute"
                  bottom="12px"
                  right="12px"
                  display="flex"
                  width="20px"
                  height="20px"
                  alignItems="center"
                  justifyContent="center"
                  animation={`${orbit} 3s linear infinite`}
                  color="var(--gray-600)"
                >
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    position="absolute"
                    w="16px"
                    h="16px"
                    top="50%"
                    left="50%"
                    animation={`${orbit2} 3s linear infinite`}
                  >
                    <i className="fa-magnifying-glass fa-solid"></i>
                  </Box>
                </Box>
              </Box>
            </Flex>
          </Flex>
          <Button colorScheme="mintTheme" onClick={handleMapVote}>
            지도에서 스터디 투표하기
          </Button>
        </Flex>
      </Box>

      <HomeLocationBar />
      <Box px="16px">
        <StudyController
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          studyVoteData={studyVoteArr}
          voteCntArr={voteCntArr}
        />
        <AnimatePresence initial={false}>
          <MotionDiv
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(_, panInfo) => onDragEnd(panInfo)}
            className="study_space"
          >
            <HomeStudyCol studyVoteData={studyVoteArr} isLoading={!findStudyData} date={date} />
          </MotionDiv>
        </AnimatePresence>
      </Box>
      <HomeNewStudySpace places={newStudyPlaces} />
      <HomeStudyChart voteCntArr={voteCntArr} />
    </>
  );
}

const MotionDiv = styled(motion.div)`
  margin-top: 16px;
  margin-bottom: 24px;
`;

export const getNewDateBySwipe = (panInfo: PanInfo, date: string) => {
  const { offset, velocity } = panInfo;
  const swipe = swipePower(offset.x, velocity.x);

  let dateDayjs = dayjs(date);
  if (swipe < -swipeConfidenceThreshold) {
    dateDayjs = dateDayjs.add(1, "day");
  } else if (swipe > swipeConfidenceThreshold) {
    dateDayjs = dateDayjs.subtract(1, "day");
  }
  return dayjsToStr(dateDayjs);
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export default HomeStudySection;
