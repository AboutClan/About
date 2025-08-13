import { Box } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import WeekSlideCalendar from "../../components/molecules/WeekSlideCalendar";
import { DispatchString } from "../../types/hooks/reactTypes";
import StudyPagePlaceSectionHeader from "./studyPageDrawer/StudyPagePlaceBlockHeader";

interface StudyPageCalendarProps {
  date: string;
  setDate: DispatchString;
}

function StudyPageCalendar({ date, setDate }: StudyPageCalendarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);

  const handleSelectDate = (moveDate: string) => {
    if (date === moveDate) return;
    setDate(moveDate);
    newSearchParams.set("date", moveDate);
    router.replace(`/studyPage?${newSearchParams.toString()}`, { scroll: false });
  };

  return (
    <Box mt={5}>
      <StudyPagePlaceSectionHeader date={date} setDate={setDate} />
      <WeekSlideCalendar selectedDate={date} func={handleSelectDate} />
    </Box>
  );
}

export default StudyPageCalendar;
