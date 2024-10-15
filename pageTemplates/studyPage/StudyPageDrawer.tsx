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
import { convertStudyToParticipations } from "../../libs/study/getMyStudyMethods";
import { setStudyToThumbnailInfo } from "../../libs/study/setStudyToThumbnailInfo";
import { DispatchString } from "../../types/hooks/reactTypes";
import { StudyDailyInfoProps } from "../../types/models/studyTypes/studyDetails";
import { ActiveLocation } from "../../types/services/locationTypes";
import StudyPageDrawerFilterBar from "./studyPageDrawer/StudyPageDrawerFilterBar";
import StudyPageDrawerHeader from "./studyPageDrawer/StudyPageDrawerHeader";

interface StudyPageDrawerProps {
  studyVoteData: StudyDailyInfoProps;
  date: string;
  setDate: DispatchString;
  location: ActiveLocation;
}

function StudyPageDrawer({ studyVoteData, location, date, setDate }: StudyPageDrawerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);
  const drawerParam = searchParams.get("drawer") as "up" | "down";

  const { currentLocation } = useCurrentLocation();

  const [thumbnailCardInfoArr, setThumbnailCardinfoArr] = useState<StudyThumbnailCardProps[]>();

  useEffect(() => {
    if (!studyVoteData) return;
    const participations = convertStudyToParticipations(studyVoteData, location);
    const getThumbnailCardInfoArr = setStudyToThumbnailInfo(
      participations,
      currentLocation,
      date,
      location,
    );
    setThumbnailCardinfoArr(getThumbnailCardInfoArr);
  }, [studyVoteData]);

  const handleSelectDate = (moveDate: string) => {
    if (date === moveDate) return;
    setThumbnailCardinfoArr(null);
    setDate(moveDate);
    newSearchParams.set("date", moveDate);
    router.replace(`/studyPage?${newSearchParams.toString()}`);
  };

  return (
    <BottomFlexDrawer height={618}  isDrawerUp={drawerParam !== "down"}>
      <Box w="100%" h="400px">
        <StudyPageDrawerHeader date={date} />
        <WeekSlideCalendar selectedDate={date} func={handleSelectDate} />
        <StudyPageDrawerFilterBar
          thumbnailCardInfoArr={thumbnailCardInfoArr}
          setThumbnailCardInfoArr={setThumbnailCardinfoArr}
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

export default StudyPageDrawer;
