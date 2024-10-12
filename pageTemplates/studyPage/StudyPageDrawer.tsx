import { Box } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import WeekSlideCalendar from "../../components/molecules/WeekSlideCalendar";
import { convertStudyToParticipations } from "../../libs/study/getMyStudyMethods";
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
  
  const A = convertStudyToParticipations(studyVoteData);

  const [participationArr, setParticipationArr] = useState();

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
