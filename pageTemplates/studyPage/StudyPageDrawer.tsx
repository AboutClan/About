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
import StudyPageDrawerFilterBar from "./studyPageDrawer/StudyPageDrawerFilterBar";
import StudyPageDrawerHeader from "./studyPageDrawer/StudyPageDrawerHeader";

interface StudyPageDrawerProps {
  studyVoteData: StudyDailyInfoProps;
  date: string;
  setDate: DispatchString;
}

function StudyPageDrawer({ studyVoteData, date, setDate }: StudyPageDrawerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);

  const { currentLocation } = useCurrentLocation();

  const [thumbnailCardInfoArr, setThumbnailCardinfoArr] = useState<StudyThumbnailCardProps[]>();
  console.log(555, thumbnailCardInfoArr);
  useEffect(() => {
    if (!studyVoteData) return;
    const participations = convertStudyToParticipations(studyVoteData);
    const getThumbnailCardInfoArr = setStudyToThumbnailInfo(participations, currentLocation, date);
    setThumbnailCardinfoArr(getThumbnailCardInfoArr);
  }, [studyVoteData]);

  const handleChangeDate = (moveDate: string) => {
    setDate(moveDate);
  };

  const handleSelectDate = (moveDate: string) => {
    console.log(52);
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
