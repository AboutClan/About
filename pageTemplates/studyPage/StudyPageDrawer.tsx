import { Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { AnimatePresence, motion, PanInfo } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import SectionFooterButton from "../../components/atoms/SectionFooterButton";
import {
  StudyThumbnailCard,
  StudyThumbnailCardProps,
} from "../../components/molecules/cards/StudyThumbnailCard";
import WeekSlideCalendar from "../../components/molecules/WeekSlideCalendar";
import { StudyThumbnailCardSkeleton } from "../../components/skeleton/StudyThumbnailCardSkeleton";
import { useUserInfoQuery } from "../../hooks/user/queries";
import { convertStudyToParticipations } from "../../libs/study/getMyStudyMethods";
import { setStudyToThumbnailInfo } from "../../libs/study/setStudyToThumbnailInfo";
import { CoordinateProps } from "../../types/common";
import { DispatchString } from "../../types/hooks/reactTypes";
import { StudyDailyInfoProps } from "../../types/models/studyTypes/studyDetails";
import { IStudyVotePlaces } from "../../types/models/studyTypes/studyInterActions";
import { dayjsToStr } from "../../utils/dateTimeUtils";
import StudyPageDrawerFilterBar from "./studyPageDrawer/StudyPageDrawerFilterBar";
import StudyPageDrawerHeader from "./studyPageDrawer/StudyPageDrawerHeader";
interface StudyPageDrawerProps {
  studyVoteData: StudyDailyInfoProps;
  date: string;
  setDate: DispatchString;

  currentLocation: CoordinateProps;
}

type SelectOption = "인원순" | "거리순" | "선호순";

function StudyPageDrawer({ studyVoteData, date, setDate, currentLocation }: StudyPageDrawerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);
  const [thumbnailCardInfoArr, setThumbnailCardinfoArr] = useState<StudyThumbnailCardProps[]>();
  const [selectOption, setSelectOption] = useState<SelectOption>("인원순");

  const lastStudyHours = dayjs(date).hour(9).startOf("hour").diff(dayjs(), "m");

  const { data: userInfo } = useUserInfoQuery();
  const preference = userInfo?.studyPreference;

  useEffect(() => {
    if (!studyVoteData || !currentLocation) return;

    const participations = convertStudyToParticipations(studyVoteData, false);

    const getThumbnailCardInfoArr = setStudyToThumbnailInfo(
      lastStudyHours <= 0
        ? participations.filter((par) => par.status === "free" || par.status === "open")
        : participations,
      preference,
      currentLocation,
      date,
      true,
    );
    setThumbnailCardinfoArr(
      sortThumbnailCardInfoArr(selectOption, preference, getThumbnailCardInfoArr),
    );
  }, [studyVoteData, currentLocation]);

  useEffect(() => {
    if (!thumbnailCardInfoArr || (selectOption === "선호순" && !preference?.place)) return;
    setThumbnailCardinfoArr((old) => sortThumbnailCardInfoArr(selectOption, preference, old));
  }, [selectOption, preference]);

  const handleSelectDate = (moveDate: string) => {
    if (date === moveDate) return;
    setThumbnailCardinfoArr(null);
    setDate(moveDate);
    newSearchParams.set("date", moveDate);
    router.replace(`/studyPage?${newSearchParams.toString()}`, { scroll: false });
  };

  // const screenHeight = window.innerHeight;

  const onDragEnd = (panInfo: PanInfo) => {
    const newDate = getNewDateBySwipe(panInfo, date as string);
    if (newDate !== date) {
      setDate(newDate);
      newSearchParams.set("date", newDate);
      router.replace(`/studyPage?${newSearchParams.toString()}`, { scroll: false });
    }
    return;
  };
  const getNewDateBySwipe = (panInfo: PanInfo, date: string) => {
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

  return (
    <Flex flexDir="column" mt={5} mb={8}>
      <StudyPageDrawerHeader date={date} setDate={setDate} />
      <Box>
        <WeekSlideCalendar selectedDate={date} func={handleSelectDate} />
        {thumbnailCardInfoArr?.length ? (
          <StudyPageDrawerFilterBar
            selectOption={selectOption}
            setSelectOption={setSelectOption}
            placeCnt={thumbnailCardInfoArr?.filter((par) => par.participants.length > 0).length}
            date={date}
            lastStudyHours={lastStudyHours}
          />
        ) : (
          <Box my={4} />
        )}
        <Box overflowY="scroll" overscrollBehaviorY="contain">
          <AnimatePresence initial={false}>
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.3}
              onDragEnd={(_, panInfo) => onDragEnd(panInfo)}
            >
              {thumbnailCardInfoArr ? (
                thumbnailCardInfoArr.length ? (
                  thumbnailCardInfoArr
                    .slice(0, 3)
                    .map(({ participants, ...thumbnailCardInfo }, idx) => (
                      <Box key={idx} mb={3}>
                        <StudyThumbnailCard
                          {...thumbnailCardInfo}
                          participantCnt={participants.length}
                        />
                      </Box>
                    ))
                ) : (
                  <Flex
                    justify="center"
                    align="center"
                    fontSize="14px"
                    fontWeight="medium"
                    bg="gray.100"
                    px={3}
                    py={4}
                    minH="114px"
                    borderRadius="8px"
                    color="gray.600"
                    border="var(--border)"
                  >
                    {lastStudyHours > 0 ? (
                      <Box>
                        {location} 지역에 등록된 스터디 장소가 없습니다.
                        <br />
                        아래 버튼을 눌러 새로운 장소를 등록해보세요!
                        <Button borderRadius="8px" mt={4} colorScheme="mint" w="full">
                          신규 스터디 장소 추가
                        </Button>
                      </Box>
                    ) : (
                      <>
                        현재 진행중인 스터디가 없습니다.
                        <br />
                        하단의 개인 스터디 신청을 통해서 참여해 주세요!
                      </>
                    )}
                  </Flex>
                )
              ) : (
                [1, 2, 3].map((idx) => <StudyThumbnailCardSkeleton key={idx} />)
              )}
            </motion.div>
            {thumbnailCardInfoArr?.length && (
              <SectionFooterButton url={`/studyList?date=${date}`} />
            )}
          </AnimatePresence>
        </Box>
      </Box>
    </Flex>
  );
}

const sortThumbnailCardInfoArr = (
  selectOption: SelectOption,
  preference: IStudyVotePlaces,
  arr: StudyThumbnailCardProps[],
) => {
  return [...arr].sort((a, b) => {
    if (selectOption === "거리순") {
      if (a.place.distance > b.place.distance) return 1;
      else if (a.place.distance < b.place.distance) return -1;
      else return 0;
    }
    if (selectOption === "인원순") {
      if (a.participants.length > b.participants.length) return -1;
      if (a.participants.length < b.participants.length) return 1;
      return 0;
    }
    if (selectOption === "선호순") {
      // 1. main place가 있는 경우 우선순위
      if (a.id === preference.place && b.id !== preference.place) return -1;
      if (b.id === preference.place && a.id !== preference.place) return 1;

      // 2. sub place가 있는 경우 우선순위
      const aIsSub = preference.subPlace?.includes(a.id);
      const bIsSub = preference.subPlace?.includes(b.id);

      if (aIsSub && !bIsSub) return -1;
      if (!aIsSub && bIsSub) return 1;

      // 3. 나머지 (main도 sub도 아닌 경우)
      return 0;
    }
  });
};

export default StudyPageDrawer;
