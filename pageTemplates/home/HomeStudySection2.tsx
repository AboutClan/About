import dayjs from "dayjs";
import { PanInfo } from "framer-motion";
import { useState } from "react";

import { dayjsToStr } from "../../utils/dateTimeUtils";

// const orbit = keyframes`
//   from {
//     transform: rotate(0deg);
//   }
//   to {
//     transform: rotate(360deg);
//   }
// `;
// const orbit2 = keyframes`
//   from {
//     transform: rotate(0deg);
//   }
//   to {
//     transform: rotate(-360deg);
//   }
// `;

function HomeStudySection() {
  // const { data: session } = useSession();
  // const router = useRouter();
  // const typeToast = useTypeToast();
  // const searchParams = useSearchParams();
  // const newSearchParams = new URLSearchParams(searchParams);
  // const date = searchParams.get("date");
  // const location = searchParams.get("location");
  // const locationKr = convertLocationLangTo(location as LocationEn, "kr");
  // const isGuest = session?.user.name === "guest";

  // const setStudyDateStatus = useSetRecoilState(studyDateStatusState);

  // const [selectedDate, setSelectedDate] = useState<string>();
  // const [studyVoteArr, setStudyVoteArr] = useState<StudyParticipationProps[]>();
  // const setMyStudy = useSetRecoilState(myStudyInfoState);
  // const setMyRealStudy = useSetRecoilState(myRealStudyInfoState);

  // const { data: studyVoteData, isLoading } = useStudyVoteQuery(date as string, locationKr, {
  //   enabled: !!date && !!locationKr && LOCATION_OPEN.includes(locationKr as ActiveLocation),
  // });

  // useEffect(() => {
  //   if (!selectedDate) setSelectedDate(date);
  //   setStudyDateStatus(getStudyDateStatus(date));
  // }, [date]);

  // useEffect(() => {
  //   if (!studyVoteData) return;
  //   const participations = studyVoteData.participations;
  //   setStudyVoteArr(participations);

  //   const tempStudy =
  //     participations.find((par) =>
  //       par.members.some((who) => who.user.uid === session?.user?.uid),
  //     ) || null;
  //   setMyStudy(tempStudy);
  //   const realTimeUsers = Array.isArray(studyVoteData.realTime) ? studyVoteData.realTime : [];
  //   const myRealStudy = realTimeUsers?.find((real) => real.user.uid === session?.user.uid);
  //   setMyRealStudy(myRealStudy);
  // }, [studyVoteData, session?.user.uid]);

  // const selectedDateDayjs = dayjs(selectedDate);

  // const handleMapVote = () => {
  //   if (isGuest) {
  //     typeToast("guest");
  //     return;
  //   }
  //   newSearchParams.delete("tab");
  //   router.push(`/vote?${newSearchParams.toString()}`);
  // };

  // const onDragEnd = (panInfo: PanInfo) => {
  //   const newDate = getNewDateBySwipe(panInfo, date as string);
  //   if (newDate !== date) {
  //     newSearchParams.set("date", newDate);
  //     setSelectedDate(newDate);
  //     router.replace(`/home?${newSearchParams.toString()}`, { scroll: false });
  //   }
  //   return;
  // };

  // const handleChangeDate = (date: string) => {
  //   setStudyVoteArr(null);
  //   setSelectedDate(date);
  // };

  const [bottomDrawerUp, setBottomDrawerUp] = useState(true);

  return (
    <>
      {/* <BottomFlexDrawer
        height={bottomDrawerUp ? 500 : 200}
        isLittleClose
        setIsModal={setBottomDrawerUp}
      /> */}
      {/* <Box p={4} pb={5}>
        <Box fontSize="18px" fontWeight={600} py={4} pt={2}>
          직관적인 장소 선택!
        </Box>
        <Flex
          direction="column"
          p={4}
          pt={2}
          bgColor="var(--color-mint-light)"
          borderRadius="var(--rounded-lg)"
        >
          <Flex justify="space-between">
            <Flex direction="column" pb={3} pt={2}>
              <Box p={1} fontSize="17px" fontWeight={600}>
                공부하고 있는 친구 없나?
                <br />
                실시간으로 한눈에 확인하자!
              </Box>
              <Box p={1}>실시간 참여 인원: 34</Box>
            </Flex>
            <Flex
              justify="center"
              position="relative"
              align="center"
              mb="auto"
              fontSize="24px"
              height="100px"
              width="100px"
              mr={2}
            >
              <Box>
                <Image
                  src="https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%8F%99%EC%95%84%EB%A6%AC/%EB%8F%99%EC%95%84%EB%A6%AC+%EC%A7%84%EC%A7%9C+%EC%A7%80%EB%8F%84.png"
                  width={100}
                  height={100}
                  alt="map"
                />
              </Box>
              <Box
                position="absolute"
                bottom="32px"
                right="4px"
                width="80px"
                height="30px"
                display="flex"
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
                  top="0"
                  right="0"
                  transform="translate(-50%, -50%)"
                  animation={`${orbit2} 3s linear infinite`}
                >
                  <Image
                    src="https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%8F%99%EC%95%84%EB%A6%AC/%EB%8F%8B%EB%B3%B4%EA%B8%B0%EC%9E%85%EB%8B%88%EB%8B%A4.png"
                    width={60}
                    height={60}
                    alt="돋보기"
                  />
                </Box>
              </Box>
            </Flex>
          </Flex>
          <Button colorScheme="mintTheme" onClick={handleMapVote}>
            실시간 스터디 참여하기
          </Button>
        </Flex>
      </Box>

      <HomeLocationBar />
      <Box px="16px">
        <StudyController
          selectedDate={selectedDate}
          handleChangeDate={handleChangeDate}
          studyVoteData={studyVoteArr}
          // voteCntArr={voteCntArr}
        />
        <AnimatePresence initial={false}>
          <MotionDiv
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(_, panInfo) => onDragEnd(panInfo)}
            className="study_space"
          >
            <StudyCardCol studyVoteData={studyVoteArr} isLoading={isLoading} date={date} />
          </MotionDiv>
        </AnimatePresence>
      </Box> */}
      {/* <HomeNewStudySpace places={newStudyPlaces} /> */}
      {/* <HomeStudyChart voteCntArr={voteCntArr} /> */}
    </>
  );
}

/* const MotionDiv = styled(motion.div)`
  margin-top: 16px;
  margin-bottom: 24px;
`; */

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
