import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useState } from "react";
import SectionHeader from "../../components/atoms/SectionHeader";
import TabNav, { ITabNavOptions } from "../../components/molecules/navs/TabNav";
import { USER_LOCATION } from "../../constants/keys/localStorage";
import { useStudyVoteQuery } from "../../hooks/study/queries";
import { ActiveLocation } from "../../types/services/locationTypes";
import { dayjsToKr, dayjsToStr } from "../../utils/dateTimeUtils";
import StudyCardCol from "./study/StudyCardCol";

interface HomeStudySectionProps {}

function HomeStudySection({}: HomeStudySectionProps) {
  const { data: session } = useSession();
  //session이나 userInfo보다 더 빠른 속도를 위해. 그래야 메인 데이터도 빨리 가져옴
  const userLocation = localStorage.getItem(USER_LOCATION) as ActiveLocation;

  const [date, setDate] = useState(dayjsToStr(dayjs()));

  const { data: studyVoteData, isLoading } = useStudyVoteQuery(
    date,
    userLocation || session?.user.location,

    {
      enabled: !!userLocation || !!session?.user.location,
    },
  );

  const tabOptionsArr: ITabNavOptions[] = [
    {
      text: dayjsToKr(dayjs()),
      func: () => setDate(dayjsToStr(dayjs())),
    },
    {
      text: dayjsToKr(dayjs().add(1, "day")),
      func: () => setDate(dayjsToStr(dayjs().add(1, "day"))),
    },
  ];

  return (
    <>
      <Box px={5}>
        <SectionHeader title="카공 스터디 같이 하실 분" subTitle="Study" />
      </Box>
      <Box px={5} mt={3} mb={5} borderBottom="var(--border)">
        <TabNav tabOptionsArr={tabOptionsArr} selected={dayjsToKr(dayjs())} />
      </Box>
      <Box px={5}>
        <StudyCardCol participations={studyVoteData?.participations} date={date} />
      </Box>
    </>
  );
}

export default HomeStudySection;
