import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import Slide from "../components/layouts/PageSlide";
import { useStudySetQuery } from "../hooks/custom/StudyHooks";
import { useStudyVoteQuery } from "../hooks/study/queries";
import { setStudyOneDayData } from "../libs/study/studyConverters";
import StudyPageCalendar from "../pageTemplates/studyPage/StudyPageCalendar";
import StudyPageChallenge from "../pageTemplates/studyPage/StudyPageChallenge";
import StudyPageHeader from "../pageTemplates/studyPage/StudyPageHeader";
import StudyPageMap from "../pageTemplates/studyPage/studyPageMap/StudyPageMap";
import StudyPageNav from "../pageTemplates/studyPage/StudyPageNav";
import StudyPagePlaceSection from "../pageTemplates/studyPage/StudyPagePlaceSection";
import StudyControlButton from "../pageTemplates/vote/StudyControlButton";
export default function StudyPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const searchParams = useSearchParams();

  const dateParam = searchParams.get("date");
  const isGuest = session?.user.role === "guest";

  const [tab, setTab] = useState<"스터디 참여" | "카공 지도">("스터디 참여");
  const [date, setDate] = useState<string>(null);

  const todayStart = dayjs().startOf("day");
  const dateStart = date ? dayjs(date).startOf("day") : null;

  const isPassedDate = !!dateStart && dateStart.isBefore(todayStart);

  const { studySet } = useStudySetQuery(date, !!date && !isPassedDate);

  const { data: passedStudyData } = useStudyVoteQuery(date, {
    enabled: !!date && !!isPassedDate,
  });

  useEffect(() => {
    if (!dateParam || dateParam === date) return;
    setDate(dateParam);
  }, [dateParam]);

  useEffect(() => {
    if (!date || dateParam === date) return;
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("date", date);
    router.replace(`/studyPage?${newSearchParams.toString()}`, { scroll: false });
  }, [date]);

  return (
    <>
      <StudyPageHeader />
      <Slide isNoPadding>
        <StudyPageNav tab={tab} setTab={setTab} />
      </Slide>
      <Slide>
        {tab === "스터디 참여" ? (
          <>
            <StudyPageCalendar date={date} setDate={setDate} />
            <StudyPagePlaceSection
              studySet={isPassedDate ? setStudyOneDayData(passedStudyData) : studySet}
              date={date}
              setDate={setDate}
            />
            {/* <StudyPageSettingBlock /> */}
            <StudyPageChallenge />
            {/* <StudyPageRecordBlock userInfo={userInfo} /> */}
            {/* <StudyPageAddPlaceButton setIsPlaceMap={setIsPlaceMap} /> */}
          </>
        ) : (
          <StudyPageMap />
        )}
      </Slide>
      {!isGuest && (
        <Box mb={20} mt={5}>
          <StudyControlButton
            // studyResults={!studyVoteData ? setStudyWeekData(studyVoteData) : []}
            date={date}
            // myVoteStatus={myVoteStatus}
            // currentLocation={currentLocation}
            // unmatchedUsers={studyVoteData?.unmatchedUsers}
          />
        </Box>
      )}
    </>
  );
}
