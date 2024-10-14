import { Box } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  StudyThumbnailCard,
  StudyThumbnailCardProps,
} from "../../components/molecules/cards/StudyThumbnailCard";
import WeekSlideCalendar from "../../components/molecules/WeekSlideCalendar";
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
    setDate(moveDate);
    newSearchParams.set("date", moveDate);
    router.replace(`/studyPage?${newSearchParams.toString()}`);
  };

  return (
    <>
      <Box w="100%">
        <StudyPageDrawerHeader date={date} />
        <WeekSlideCalendar selectedDate={date} func={handleSelectDate} />
        <StudyPageDrawerFilterBar
          thumbnailCardInfoArr={thumbnailCardInfoArr}
          setThumbnailCardInfoArr={setThumbnailCardinfoArr}
          placeCnt={thumbnailCardInfoArr?.length}
        />
        {thumbnailCardInfoArr?.map((thumbnailCardInfo, idx) => (
          <Box key={idx} mb={3}>
            <StudyThumbnailCard {...thumbnailCardInfo} />
          </Box>
        ))}
      </Box>
    </>
  );
}

export default StudyPageDrawer;
