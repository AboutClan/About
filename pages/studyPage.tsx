import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import Slide from "../components/layouts/PageSlide";
import { useStudySetQuery } from "../hooks/custom/StudyHooks";
import { useStudyVoteQuery } from "../hooks/study/queries";
import { useUserInfoQuery } from "../hooks/user/queries";
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

  const { data: userInfo } = useUserInfoQuery();
  const { studySet } = useStudySetQuery(date, !!date && !isPassedDate);

  const { data: passedStudyData } = useStudyVoteQuery(date, {
    enabled: !!date && !!isPassedDate,
  });

  console.log(53, dateStart, todayStart, passedStudyData, isPassedDate);
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

  console.log("studySet", studySet);

  /** Center 기본값 설정
   * 스터디 투표중인 경우, 투표중인 장소로.
   * 투표중이지 않다면, 현재 위치로.
   * 투표중이지 않고, 현재 위치 파악이 안된다면, locationDetail로.
   */

  // const findMyParticipation = studyVoteData?.participations?.find(
  //   (who) => who?.user?._id === userInfo?._id,
  // );

  // useEffect(() => {
  //   if (!studyVoteData || !session?.user?.id) return;
  //   const findMyStudyResult = findMyStudyByUserId(studyVoteData, session?.user.id);
  //   const myStudyInfo = findMyStudyInfo(findMyStudyResult, session?.user.id);

  //   setCenterLocation(currentLocation);

  //   if (findMyParticipation) {
  //     setMyVoteStatus("voting");

  //     const { latitude: lat, longitude: lon } = findMyParticipation;
  //     setCenterLocation({ lat, lon });
  //     return;
  //   }

  //   if (findMyStudyResult) {
  //     const attendanceType = myStudyInfo?.attendance.type;
  //     if (attendanceType) {
  //       setMyVoteStatus(attendanceType);
  //     } else {
  //       setMyVoteStatus(findMyStudyResult.status === "open" ? "open" : "free");
  //     }

  //     setCenterLocation({
  //       lat: findMyStudyResult.place.latitude,
  //       lon: findMyStudyResult.place.longitude,
  //     });
  //     return;
  //   }

  //   if (currentLocation) {
  //     setCenterLocation(currentLocation);
  //   } else if (userInfo?.locationDetail) {
  //     const { lat, lon } = userInfo.locationDetail;
  //     setCenterLocation({ lat, lon });
  //   } else setCenterLocation({ lat: 37.5642135, lon: 127.0016985 });
  //   if (studyVoteData?.participations) setMyVoteStatus("pending");
  //   else setMyVoteStatus("todayPending");
  // }, [studyVoteData, session, currentLocation, isLoading, userInfo]);

  return (
    <>
      <StudyPageHeader />
      {/* <Box h="28px" /> */}
      <Slide isNoPadding>
        <StudyPageNav tab={tab} setTab={setTab} />
      </Slide>
      <Slide>
        <Box>
          {/* <StudyPage
            <TopBar locationDetail={userInfo?.locationDetail} /> */}
        </Box>

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
