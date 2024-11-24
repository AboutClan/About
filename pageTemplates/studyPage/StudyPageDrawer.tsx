import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { AnimatePresence, motion, PanInfo } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import {
  StudyThumbnailCard,
  StudyThumbnailCardProps,
} from "../../components/molecules/cards/StudyThumbnailCard";
import WeekSlideCalendar from "../../components/molecules/WeekSlideCalendar";
import BottomFlexDrawer from "../../components/organisms/drawer/BottomFlexDrawer";
import { StudyThumbnailCardSkeleton } from "../../components/skeleton/StudyThumbnailCardSkeleton";
import { useUserInfoQuery } from "../../hooks/user/queries";
import { convertStudyToParticipations } from "../../libs/study/getMyStudyMethods";
import { setStudyToThumbnailInfo } from "../../libs/study/setStudyToThumbnailInfo";
import { CoordinateProps } from "../../types/common";
import { DispatchBoolean, DispatchString } from "../../types/hooks/reactTypes";
import { StudyDailyInfoProps } from "../../types/models/studyTypes/studyDetails";
import { IStudyVotePlaces } from "../../types/models/studyTypes/studyInterActions";
import { ActiveLocation } from "../../types/services/locationTypes";
import { dayjsToStr } from "../../utils/dateTimeUtils";
import { iPhoneNotchSize } from "../../utils/validationUtils";
import StudyPageDrawerFilterBar from "./studyPageDrawer/StudyPageDrawerFilterBar";
import StudyPageDrawerHeader from "./studyPageDrawer/StudyPageDrawerHeader";
interface StudyPageDrawerProps {
  studyVoteData: StudyDailyInfoProps;
  date: string;
  setDate: DispatchString;
  location: ActiveLocation;
  currentLocation: CoordinateProps;
  isDrawerUp: boolean;
  setIsDrawerUp: DispatchBoolean;
}

type SelectOption = "인원순" | "거리순" | "선호순";

function StudyPageDrawer({
  studyVoteData,
  location,
  date,
  setDate,
  currentLocation,
  isDrawerUp,
  setIsDrawerUp,
}: StudyPageDrawerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);
  const [thumbnailCardInfoArr, setThumbnailCardinfoArr] = useState<StudyThumbnailCardProps[]>();
  const [selectOption, setSelectOption] = useState<SelectOption>("인원순");

  const { data: userInfo } = useUserInfoQuery();
  const preference = userInfo?.studyPreference;

  useEffect(() => {
    if (!studyVoteData || !currentLocation) return;

    const participations = convertStudyToParticipations(studyVoteData, location, false);

    const getThumbnailCardInfoArr = setStudyToThumbnailInfo(
      participations,
      preference,
      currentLocation,
      date,
      true,
      location,
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
    router.replace(`/studyPage?${newSearchParams.toString()}`);
  };

  const screenHeight = window.innerHeight;
  const adjustedHeight = (screenHeight - 52 - iPhoneNotchSize()) * 0.9;

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
    <BottomFlexDrawer
      isOverlay={false}
      height={adjustedHeight}
      isDrawerUp={isDrawerUp}
      setIsModal={setIsDrawerUp}
    >
      <Flex flexDir="column" w="100%" overflow="hidden">
        <StudyPageDrawerHeader date={date} setDate={setDate} isDrawerUp={isDrawerUp} />
        <Box overflow="hidden">
          <WeekSlideCalendar selectedDate={date} func={handleSelectDate} />
          <StudyPageDrawerFilterBar
            selectOption={selectOption}
            setSelectOption={setSelectOption}
            placeCnt={thumbnailCardInfoArr?.length}
          />
          <Box overflowY="scroll" overscrollBehaviorY="contain" h={`${adjustedHeight - 210}px`}>
            <AnimatePresence initial={false}>
              <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.3}
                onDragEnd={(_, panInfo) => onDragEnd(panInfo)}
              >
                {thumbnailCardInfoArr
                  ? thumbnailCardInfoArr.map(({ participants, ...thumbnailCardInfo }, idx) => (
                      <Box key={idx} mb={3}>
                        <StudyThumbnailCard
                          {...thumbnailCardInfo}
                          participantCnt={participants.length}
                        />
                      </Box>
                    ))
                  : [1, 2, 3, 4, 5].map((idx) => <StudyThumbnailCardSkeleton key={idx} />)}
              </motion.div>
            </AnimatePresence>
          </Box>
        </Box>
      </Flex>
    </BottomFlexDrawer>
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
