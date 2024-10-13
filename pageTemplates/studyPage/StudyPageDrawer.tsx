import { Box } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import WeekSlideCalendar from "../../components/molecules/WeekSlideCalendar";
import { convertStudyToParticipations } from "../../libs/study/getMyStudyMethods";
import { DispatchString } from "../../types/hooks/reactTypes";
import {
  StudyDailyInfoProps,
  StudyMergeParticipationProps,
} from "../../types/models/studyTypes/studyDetails";
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

  const [participationArr, setParticipationArr] = useState<StudyMergeParticipationProps[]>();

  useEffect(() => {
    const participations = convertStudyToParticipations(studyVoteData);
    setParticipationArr(participations);
  }, []);

  const handleChangeDate = () => {};

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
        <WeekSlideCalendar
          // voteCntArr={voteCntArr}
          selectedDate={date}
          func={handleSelectDate}
        />
        <StudyPageDrawerFilterBar />
      </Box>
    </>
  );
}

export default StudyPageDrawer;
