import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

import SectionHeader from "../../components/atoms/SectionHeader";
import { ShortArrowIcon } from "../../components/Icons/ArrowIcons";
import TabNav, { ITabNavOptions } from "../../components/molecules/navs/TabNav";
import { USER_LOCATION } from "../../constants/keys/localStorage";
import { useStudyVoteQuery } from "../../hooks/study/queries";
import { ActiveLocation } from "../../types/services/locationTypes";
import { convertLocationLangTo } from "../../utils/convertUtils/convertDatas";
import { dayjsToKr, dayjsToStr } from "../../utils/dateTimeUtils";
import StudyCardCol from "./study/StudyCardCol";
interface HomeStudySectionProps {}

function HomeStudySection({}: HomeStudySectionProps) {
  const { data: session } = useSession();
  //session이나 userInfo보다 더 빠른 속도를 위해. 그래야 메인 데이터도 빨리 가져옴
  const userLocation =
    (localStorage.getItem(USER_LOCATION) as ActiveLocation) || session?.user.location;

  const [date, setDate] = useState(dayjsToStr(dayjs()));

  const { data: studyVoteData } = useStudyVoteQuery(
    date,
    userLocation,

    {
      enabled: !!userLocation,
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
        <SectionHeader title="카공 스터디 같이 하실 분" subTitle="Study">
          <Link
            href={`/studyList?tab=study&location=${convertLocationLangTo(userLocation, "en")}&date=${date}`}
          >
            <ShortArrowIcon dir="right" />
          </Link>
        </SectionHeader>
      </Box>
      <Box px={5} mt={3} mb={5} borderBottom="var(--border)">
        <TabNav tabOptionsArr={tabOptionsArr} selected={dayjsToKr(dayjs(date))} isFullSize />
      </Box>
      <Box px={5}>
        <StudyCardCol participations={studyVoteData?.participations} date={date} />
      </Box>
    </>
  );
}

export default HomeStudySection;
