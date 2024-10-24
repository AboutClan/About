import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
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
  const router = useRouter();
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);

  //session이나 userInfo보다 더 빠른 속도를 위해. 그래야 메인 데이터도 빨리 가져옴
  const userLocation =
    (localStorage.getItem(USER_LOCATION) as ActiveLocation) || session?.user.location;

  const viewDayjs = getStudyViewDayjs(dayjs());

  const [isLeft, setIsLeft] = useState(true);
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

  console.log(date);
  const tabOptionsArr: ITabNavOptions[] = [
    {
      text: dayjsToKr(isLeft ? dayjs(date) : dayjs(date).subtract(1, "day")),
      func: () => {
        setDate((old) => dayjsToStr(dayjs(old).subtract(1, "day")));
        newSearchParams.set("date", dayjsToStr(dayjs(date).subtract(1, "day")));
        setIsLeft(true);
        router.replace(`/home?${newSearchParams.toString()}`, { scroll: false });
      },
    },
    {
      text: dayjsToKr(isLeft ? dayjs(date).add(1, "day") : dayjs(date)),
      func: () => {
        setDate((old) => dayjsToStr(dayjs(old).add(1, "day")));
        newSearchParams.set("date", dayjsToStr(dayjs(date).add(1, "day")));
        setIsLeft(false);
        router.replace(`/home?${newSearchParams.toString()}`, { scroll: false });
      },
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
