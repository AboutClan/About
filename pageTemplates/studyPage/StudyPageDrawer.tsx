import { Box } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import {
  StudyThumbnailCard,
  StudyThumbnailCardProps,
} from "../../components/molecules/cards/StudyThumbnailCard";
import WeekSlideCalendar from "../../components/molecules/WeekSlideCalendar";
import BottomFlexDrawer from "../../components/organisms/drawer/BottomFlexDrawer";
import { StudyThumbnailCardSkeleton } from "../../components/skeleton/StudyThumbnailCardSkeleton";
import { useCurrentLocation } from "../../hooks/custom/CurrentLocationHook";
import { useUserInfoQuery } from "../../hooks/user/queries";
import { convertStudyToParticipations } from "../../libs/study/getMyStudyMethods";
import { setStudyToThumbnailInfo } from "../../libs/study/setStudyToThumbnailInfo";
import { DispatchString } from "../../types/hooks/reactTypes";
import { StudyDailyInfoProps } from "../../types/models/studyTypes/studyDetails";
import { IStudyVotePlaces } from "../../types/models/studyTypes/studyInterActions";
import { ActiveLocation } from "../../types/services/locationTypes";
import StudyPageDrawerFilterBar from "./studyPageDrawer/StudyPageDrawerFilterBar";
import StudyPageDrawerHeader from "./studyPageDrawer/StudyPageDrawerHeader";

interface StudyPageDrawerProps {
  studyVoteData: StudyDailyInfoProps;
  date: string;
  setDate: DispatchString;
  location: ActiveLocation;
}

type SelectOption = "인원순" | "거리순" | "선호순";

function StudyPageDrawer({ studyVoteData, location, date, setDate }: StudyPageDrawerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);
  const drawerParam = searchParams.get("drawer") as "up" | "down";

  const { currentLocation } = useCurrentLocation();

  const [thumbnailCardInfoArr, setThumbnailCardinfoArr] = useState<StudyThumbnailCardProps[]>();
  const [selectOption, setSelectOption] = useState<SelectOption>("인원순");

  const { data: userInfo } = useUserInfoQuery();
  const preference = userInfo?.studyPreference;

  useEffect(() => {
    if (!studyVoteData || !currentLocation) return;
    const participations = convertStudyToParticipations(studyVoteData, location);
    const getThumbnailCardInfoArr = setStudyToThumbnailInfo(
      participations,
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

  useEffect(() => {
    if (!drawerParam) {
      newSearchParams.set("drawer", "up");
      router.replace(`/studyPage?${newSearchParams.toString()}`);
    }
  }, [drawerParam]);

  const handleSelectDate = (moveDate: string) => {
    if (date === moveDate) return;
    setThumbnailCardinfoArr(null);
    setDate(moveDate);
    newSearchParams.set("date", moveDate);
    router.replace(`/studyPage?${newSearchParams.toString()}`);
  };

  const handleDrawerDown = () => {
    newSearchParams.set("category", "currentPlace");
    newSearchParams.set("drawer", "down");
    router.replace(`/studyPage?${newSearchParams.toString()}`);
    console.log(54);
  };

  return (
    <BottomFlexDrawer
      isOverlay={false}
      height={618}
      isDrawerUp={drawerParam !== "down"}
      setIsModal={() => handleDrawerDown()}
    >
      <Box w="100%" h="400px">
        <StudyPageDrawerHeader date={date} />
        <WeekSlideCalendar selectedDate={date} func={handleSelectDate} />
        <StudyPageDrawerFilterBar
          selectOption={selectOption}
          setSelectOption={setSelectOption}
          placeCnt={thumbnailCardInfoArr?.length}
        />
        <Box overflowY="scroll" h="411px">
          {thumbnailCardInfoArr
            ? thumbnailCardInfoArr.map(({ participants, ...thumbnailCardInfo }, idx) => (
                <Box key={idx} mb={3}>
                  <StudyThumbnailCard {...thumbnailCardInfo} participantCnt={participants.length} />
                </Box>
              ))
            : [1, 2, 3, 4, 5].map((idx) => <StudyThumbnailCardSkeleton key={idx} />)}
        </Box>
      </Box>
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
