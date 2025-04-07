import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import Slide from "../components/layouts/PageSlide";
import { useUserCurrentLocation } from "../hooks/custom/CurrentLocationHook";
import { useStudyVoteQuery } from "../hooks/study/queries";
import { useUserInfoQuery } from "../hooks/user/queries";
import { convertStudyToMergeStudy } from "../libs/study/convertStudyToMergeStudy";
import { getStudyViewDate } from "../libs/study/date/getStudyDateStatus";
import StudyPageAddPlaceButton from "../pageTemplates/studyPage/StudyPageAddPlaceButton";
import StudyPageCalendar from "../pageTemplates/studyPage/StudyPageCalendar";
import StudyPageHeader from "../pageTemplates/studyPage/StudyPageHeader";
import StudyPageIntroBox from "../pageTemplates/studyPage/StudyPageIntroBox";
import StudyPageMap from "../pageTemplates/studyPage/StudyPageMap";
import StudyPagePlaceSection from "../pageTemplates/studyPage/StudyPagePlaceSection";
import StudyPageRecordBlock from "../pageTemplates/studyPage/StudyPageRecordBlock";
import StudyPageSettingBlock from "../pageTemplates/studyPage/StudyPageSettingBlock";
import StudyControlButton from "../pageTemplates/vote/StudyControlButton";
import { CoordinatesProps } from "../types/common";
import { MyVoteStatus } from "../types/models/studyTypes/studyDetails";

export default function StudyPage() {
  const { data: session } = useSession();

  const searchParams = useSearchParams();

  const dateParam = searchParams.get("date");

  //dateParam이 없는 경우, 저녁 9시 이전에는 당일/넘은 경우에는 내일 날짜를 보여줍니다.
  const [date, setDate] = useState(dateParam || getStudyViewDate(dayjs()));

  //중심 위치
  const [centerLocation, setCenterLocation] = useState<CoordinatesProps>(null);

  const [myVoteStatus, setMyVoteStatus] = useState<MyVoteStatus>(null);

  // const [myStudyParticipation, setMyStudyParticipation] = useRecoilState(myStudyParticipationState);

  const { currentLocation } = useUserCurrentLocation();
  const { data: userInfo } = useUserInfoQuery();
  const { data: studyVoteData, isLoading } = useStudyVoteQuery(date, {
    enabled: !!date,
  });

  /** Center 기본값 설정
   * 스터디 투표중인 경우, 투표중인 장소로.
   * 투표중이지 않다면, 현재 위치로.
   * 투표중이지 않고, 현재 위치 파악이 안된다면, locationDetail로.
   */
  useEffect(() => {
    if (!studyVoteData || !session?.user?.id) {
      if (isLoading === false) {
        setMyVoteStatus("pending");
      }
      return;
    }

    const userId = session.user.id;
    const { participations, results, realTimes } = studyVoteData;

    // 참여 여부 확인
    if (participations?.some((who) => who?.user?._id === userId)) {
      setMyVoteStatus("voting");
      return;
    }
    // 결과 확인
    const studyResult = results?.find((who) =>
      who?.members.some((member) => member?.user._id === userId),
    );

    if (studyResult) {
      setMyVoteStatus("open");
      setCenterLocation({
        lat: studyResult.place.latitude,
        lon: studyResult.place.longitude,
      });
      return;
    }
    // 실시간 참여 확인
    const realTimeResult = realTimes?.userList.find((who) => who?.user?._id === userId);
    if (realTimeResult) {
      setMyVoteStatus("private");
      setCenterLocation({
        lat: realTimeResult.place.latitude,
        lon: realTimeResult.place.longitude,
      });
      return;
    }
    if (currentLocation) {
      setCenterLocation(currentLocation);
    } else {
      const { lat, lon } = userInfo.locationDetail;
      setCenterLocation({ lat, lon });
    }
    if (studyVoteData?.participations) setMyVoteStatus("pending");
    else setMyVoteStatus("todayPending");
  }, [studyVoteData, session?.user.uid, currentLocation, isLoading]);

  const isExpireDate = dayjs(date).isBefore(dayjs().subtract(1, "day"));

  console.log("studyVoteData", studyVoteData, isLoading);
  console.log("myVoteStatus", myVoteStatus);
  console.log("23", isExpireDate);

  return (
    <>
      <StudyPageHeader />
      <Slide>
        <StudyPageIntroBox />
        <StudyPageMap
          centerLocation={centerLocation}
          studyVoteData={studyVoteData}
          coordinates={currentLocation}
          setCenterLocation={setCenterLocation}
        />
        <StudyPageCalendar date={date} setDate={setDate} />
        <StudyPagePlaceSection
          studyVoteData={studyVoteData}
          date={date}
          setDate={setDate}
          currentLocation={currentLocation}
        />
        <StudyPageSettingBlock />
        <StudyPageRecordBlock />
        <StudyPageAddPlaceButton />
      </Slide>
      {!isExpireDate && myVoteStatus && (
        <Box mb={20} mt={5}>
          <StudyControlButton
            studyResults={studyVoteData ? convertStudyToMergeStudy(studyVoteData) : []}
            date={date}
            myVoteStatus={myVoteStatus}
            currentLocation={currentLocation}
          />
        </Box>
      )}
    </>
  );
}
