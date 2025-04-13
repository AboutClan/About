import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import Slide from "../components/layouts/PageSlide";
import { useUserCurrentLocation } from "../hooks/custom/CurrentLocationHook";
import { useStudyResultDecideMutation } from "../hooks/study/mutations";
import { useStudyVoteQuery } from "../hooks/study/queries";
import { useUserInfoQuery } from "../hooks/user/queries";
import { convertStudyToMergeStudy } from "../libs/study/studyConverters";

import { findMyStudyByUserId, findMyStudyInfo } from "../libs/study/studySelectors";
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
import { MyStudyStatus } from "../types/models/studyTypes/helperTypes";

export default function StudyPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user.id;
  const searchParams = useSearchParams();
  const dateParam = searchParams.get("date");

  const [date, setDate] = useState<string>(null);

  //중심 위치
  const [centerLocation, setCenterLocation] = useState<CoordinatesProps>(null);

  const [myVoteStatus, setMyVoteStatus] = useState<MyStudyStatus>(null);

  // const [myStudyParticipation, setMyStudyParticipation] = useRecoilState(myStudyParticipationState);

  const { currentLocation } = useUserCurrentLocation();
  const { data: userInfo } = useUserInfoQuery();
  const { data: studyVoteData, isLoading } = useStudyVoteQuery(date, {
    enabled: !!date,
  });

  const { mutate } = useStudyResultDecideMutation(date);

  // useEffect(() => {
  //   if (date) {
  //     mutate();
  //   }
  // }, [date]);

  //dateParam이 아예 없는 경우가 있을 수 있을까?
  useEffect(() => {
    if (!dateParam) return;
    setDate(dateParam);
  }, [dateParam]);

  /** Center 기본값 설정
   * 스터디 투표중인 경우, 투표중인 장소로.
   * 투표중이지 않다면, 현재 위치로.
   * 투표중이지 않고, 현재 위치 파악이 안된다면, locationDetail로.
   */

  const findMyParticipation = studyVoteData?.participations?.find(
    (who) => who?.user?._id === userId,
  );

  useEffect(() => {
    if (!studyVoteData || !session?.user?.id) return;
    const findMyStudyResult = findMyStudyByUserId(studyVoteData, session?.user.id);
    const myStudyInfo = findMyStudyInfo(findMyStudyResult, session?.user.id);

    setCenterLocation(currentLocation);

    if (findMyParticipation) {
      setMyVoteStatus("voting");
      const { latitude: lat, longitude: lon } = findMyParticipation;
      setCenterLocation({ lat, lon });
      return;
    }

    if (findMyStudyResult) {
      const attendanceType = myStudyInfo?.attendance.type;
      if (attendanceType) {
        setMyVoteStatus(attendanceType);
      } else {
        setMyVoteStatus(findMyStudyResult.status === "open" ? "open" : "free");
      }
      setCenterLocation({
        lat: findMyStudyResult.place.latitude,
        lon: findMyStudyResult.place.longitude,
      });
      return;
    }

    if (currentLocation) {
      setCenterLocation(currentLocation);
    } else if (userInfo) {
      const { lat, lon } = userInfo.locationDetail;
      setCenterLocation({ lat, lon });
    }
    if (studyVoteData?.participations) setMyVoteStatus("pending");
    else setMyVoteStatus("todayPending");
  }, [studyVoteData, session, currentLocation, isLoading, userInfo]);

  const isExpireDate = dayjs(date).isBefore(dayjs().subtract(1, "day"));

  console.log("studyVoteData:", studyVoteData, myVoteStatus);

  return (
    <>
      <StudyPageHeader />
      <Slide>
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
      />
      <Slide>
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
