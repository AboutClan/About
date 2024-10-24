import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";

import ButtonWrapper from "../../components/atoms/ButtonWrapper";
import SectionHeader from "../../components/atoms/SectionHeader";
import { ShortArrowIcon } from "../../components/Icons/ArrowIcons";
import TabNav, { ITabNavOptions } from "../../components/molecules/navs/TabNav";
import { USER_LOCATION } from "../../constants/keys/localStorage";
import { useStudyVoteQuery } from "../../hooks/study/queries";
import { getStudyViewDayjs } from "../../libs/study/date/getStudyDateStatus";
import {
  convertStudyToParticipations,
  getMyStudyParticipation,
} from "../../libs/study/getMyStudyMethods";
import { myStudyParticipationState } from "../../recoils/studyRecoils";
import { ActiveLocation } from "../../types/services/locationTypes";
import { convertLocationLangTo } from "../../utils/convertUtils/convertDatas";
import { dayjsToKr, dayjsToStr } from "../../utils/dateTimeUtils";
import StudyCardCol from "./study/StudyCardCol";

function HomeStudySection() {
  const { data: session } = useSession();
  //session이나 userInfo보다 더 빠른 속도를 위해. 그래야 메인 데이터도 빨리 가져옴
  const userLocation =
    (localStorage.getItem(USER_LOCATION) as ActiveLocation) || session?.user.location;

  const viewDayjs = getStudyViewDayjs(dayjs());
  const nextDayjs = getStudyViewDayjs(dayjs().add(1, "day"));

  const [date, setDate] = useState(dayjsToStr(viewDayjs));

  const setMyStudyParticipation = useSetRecoilState(myStudyParticipationState);

  const { data: studyVoteData } = useStudyVoteQuery(date, userLocation, {
    enabled: !!userLocation,
  });

  const studyMergeParticipations = convertStudyToParticipations(studyVoteData, userLocation);

  useEffect(() => {
    if (!studyVoteData || !session?.user.uid) return;
    const findMyStudyParticipation = getMyStudyParticipation(studyVoteData, session.user.uid);
    setMyStudyParticipation(findMyStudyParticipation);
  }, [studyVoteData, session]);

  const tabOptionsArr: ITabNavOptions[] = [
    {
      text: dayjsToKr(getStudyViewDayjs(dayjs(date))),
      func: () => setDate(dayjsToStr(viewDayjs)),
    },
    {
      text: dayjsToKr(getStudyViewDayjs(dayjs(date).add(1, "day"))),
      func: () => setDate(dayjsToStr(nextDayjs)),
    },
  ];

  return (
    <>
      <Box px={5}>
        <SectionHeader title="카공 스터디 같이 하실 분" subTitle="Study">
          <ButtonWrapper
            size="xs"
            url={`/studyList?location=${convertLocationLangTo(userLocation, "en")}&date=${date}`}
          >
            <ShortArrowIcon dir="right" />
          </ButtonWrapper>
        </SectionHeader>
      </Box>
      <Box px={5} mt={3} mb={5} borderBottom="var(--border)">
        <TabNav tabOptionsArr={tabOptionsArr} selected={dayjsToKr(dayjs(date))} isFullSize />
      </Box>
      <Box px={5}>
        <StudyCardCol participations={studyMergeParticipations} date={date} setDate={setDate} />
      </Box>
    </>
  );
}

export default HomeStudySection;
