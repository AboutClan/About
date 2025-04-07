import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import Slide from "../components/layouts/PageSlide";
import { useUserCurrentLocation } from "../hooks/custom/CurrentLocationHook";
import { useToast, useTypeToast } from "../hooks/custom/CustomToast";
import { useStudyVoteQuery } from "../hooks/study/queries";
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

export default function StudyPage() {
  const { data: session } = useSession();
  const toast = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);
  const typeToast = useTypeToast();
  const dateParam = searchParams.get("date");

  //dateParam이 없는 경우, 저녁 9시 이전에는 당일/넘은 경우에는 내일 날짜를 보여줍니다.
  const [date, setDate] = useState(dateParam || getStudyViewDate(dayjs()));

  //중심 위치
  const [centerLocation, setCenterLocation] = useState<CoordinatesProps>(null);

  const [myVoteStatus, setMyVoteStatus] = useState<"voting" | "open" | "private" | null>(null);

  // const [myStudyParticipation, setMyStudyParticipation] = useRecoilState(myStudyParticipationState);

  const { currentLocation: coordinates } = useUserCurrentLocation();

  const { data: studyVoteData, isLoading } = useStudyVoteQuery("2024-12-29", {
    enabled: !!date,
  });

  // useEffect(() => {
  //   newSearchParams.set("date", `${getStudyViewDate(dayjs(date))}`);
  //   router.replace(`/studyPage?${newSearchParams.toString()}`);
  // }, [date]);

  useEffect(() => {
    if (!studyVoteData || !session?.user?.id) return;

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
    const realTimeResult = realTimes?.find((who) => who?.user?._id === userId);
    if (realTimeResult) {
      setMyVoteStatus("private");
      setCenterLocation({
        lat: realTimeResult.place.latitude,
        lon: realTimeResult.place.longitude,
      });
      return;
    }
    // 아무 경우도 아닐 때
    setMyVoteStatus(null);
  }, [studyVoteData, session?.user.uid, coordinates]);

  // const accumulationHour =
  //   userInfo &&
  //   `${Math.ceil(userInfo.weekStudyAccumulationMinutes / 60)}시간 ${
  //     userInfo.weekStudyAccumulationMinutes % 60
  //   }분`;
  console.log(studyVoteData);
  return (
    <>
      <StudyPageHeader />
      <Slide>
        <StudyPageIntroBox />
        <StudyPageMap
          studyVoteData={studyVoteData}
          coordinates={coordinates}
          setCenterLocation={setCenterLocation}
        />
        <StudyPageCalendar date={date} setDate={setDate} />
        <StudyPagePlaceSection
          studyVoteData={studyVoteData}
          date={date}
          setDate={setDate}
          currentLocation={coordinates}
        />
        <StudyPageSettingBlock />
        <StudyPageRecordBlock />
        <StudyPageAddPlaceButton />
      </Slide>
      <Box mb={20} mt={5}>
        <StudyControlButton date={date} setIsVoteDrawer={null} isVoting={null} />
      </Box>
    </>
  );
}
