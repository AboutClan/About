import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import Slide from "../components/layouts/PageSlide";
import { useStudyVoteQuery, useStudyWeekQuery } from "../hooks/study/queries";
import { useUserInfoQuery } from "../hooks/user/queries";
import { setStudyWeekData } from "../libs/study/studyConverters";
import StudyPageCalendar from "../pageTemplates/studyPage/StudyPageCalendar";
import StudyPageHeader from "../pageTemplates/studyPage/StudyPageHeader";
import StudyPagePlaceSection from "../pageTemplates/studyPage/StudyPagePlaceSection";
import StudyPageRecordBlock from "../pageTemplates/studyPage/StudyPageRecordBlock";
import { StudySetProps } from "../types/models/studyTypes/derivedTypes";

export default function StudyPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const searchParams = useSearchParams();

  const dateParam = searchParams.get("date");
  const isGuest = session?.user.role === "guest";

  const [date, setDate] = useState<string>(null);
  const [studySet, setStudySet] = useState<StudySetProps>();

  const isPassedDate = date ? dayjs(date).isBefore(dayjs(), "day") : false;

  // const [studyPlaces, setStudyPlaces] = useState<StudyMergeResultProps[]>();

  // //중심 위치
  // const [centerLocation, setCenterLocation] = useState<CoordinatesProps>(null);

  // const [myVoteStatus, setMyVoteStatus] = useState<MyStudyStatus>(null);
  // const [isPlaceMap, setIsPlaceMap] = useState(false);

  // const [myStudyParticipation, setMyStudyParticipation] = useRecoilState(myStudyParticipationState);

  // const { currentLocation } = useUserCurrentLocation();
  const { data: userInfo } = useUserInfoQuery();

  const { data: weekData } = useStudyWeekQuery({ enabled: !isPassedDate });
  const { data: oneDayData } = useStudyVoteQuery(date, {
    enabled: !!isPassedDate,
  });
  // const { data: placeData } = useStudyPlacesQuery("all", null, {
  //   enabled: !!isPlaceMap,
  // });

  //dateParam이 아예 없는 경우가 있을 수 있을까?
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

  useEffect(() => {
    if (!weekData) return;
    const mergedStudyWeekData = setStudyWeekData(weekData);
    setStudySet(mergedStudyWeekData);
  }, [weekData]);

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

  const isExpireDate = dayjs(date).isBefore(dayjs().subtract(1, "day"));

  return (
    <>
      <StudyPageHeader />
      {/* <Slide>
        <StudyPageIntroBox />
      </Slide>
      <StudyPageMap
        centerLocation={centerLocation}
        studyVoteData={studyVoteData}
        currentLocation={currentLocation}
        setCenterLocation={setCenterLocation}
        date={date}
        myVoteCoordinates={
          findMyParticipation && {
            lat: findMyParticipation.latitude,
            lon: findMyParticipation.longitude,
          }
        }
        placeData={isPlaceMap && placeData}
        setIsPlaceMap={setIsPlaceMap}
      /> */}
      <Box h="28px" />
      <Slide>
        <StudyPageCalendar date={date} setDate={setDate} />
        <StudyPagePlaceSection
          studyVoteData={studyVoteData}
          date={date}
          setDate={setDate}
          currentLocation={currentLocation}
        />
        {/* <StudyPageSettingBlock /> */}
        <StudyPageRecordBlock userInfo={userInfo} />
        {/* <StudyPageAddPlaceButton setIsPlaceMap={setIsPlaceMap} /> */}
      </Slide>
      {!isGuest && (
        <Box mb={20} mt={5}>
          {/* <StudyControlButton
            studyResults={!studyVoteData ? setStudyWeekData(studyVoteData) : []}
            date={date}
            myVoteStatus={myVoteStatus}
            currentLocation={currentLocation}
            unmatchedUsers={studyVoteData?.unmatchedUsers}
          /> */}
        </Box>
      )}
    </>
  );
}
