import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import ButtonWrapper from "../../components/atoms/ButtonWrapper";
import SectionFooterButton from "../../components/atoms/SectionFooterButton";
import SectionHeader from "../../components/atoms/SectionHeader";
import { ShortArrowIcon } from "../../components/Icons/ArrowIcons";
import {
  StudyThumbnailCard,
  StudyThumbnailCardProps,
} from "../../components/molecules/cards/StudyThumbnailCard";
import TabNav, { ITabNavOptions } from "../../components/molecules/navs/TabNav";
import { StudyThumbnailCardSkeleton } from "../../components/skeleton/StudyThumbnailCardSkeleton";
import { useUserCurrentLocation } from "../../hooks/custom/CurrentLocationHook";
import { useStudyVoteQuery } from "../../hooks/study/queries";
import { getStudyViewDate } from "../../libs/study/date/getStudyDateStatus";
import { convertStudyToMergeStudy } from "../../libs/study/studyConverters";
import {
  setStudyThumbnailCard,
  sortThumbnailCardInfoArr,
} from "../../libs/study/thumbnailCardLibs";
import { dayjsToKr, dayjsToStr } from "../../utils/dateTimeUtils";

function HomeStudySection() {
  const { data: session } = useSession();
  const { currentLocation } = useUserCurrentLocation();

  const [date, setDate] = useState(getStudyViewDate(dayjs()));

  const [thumbnailCardInfoArr, setThumbnailCardinfoArr] = useState<StudyThumbnailCardProps[]>();

  const { data: studyVoteData } = useStudyVoteQuery(date, {
    enabled: !!date,
  });

  useEffect(() => {
    if (!studyVoteData) {
      setThumbnailCardinfoArr(null);
      return;
    }

    const getThumbnailCardInfoArr = setStudyThumbnailCard(
      date,
      studyVoteData?.participations,
      convertStudyToMergeStudy(studyVoteData),
      currentLocation,
    );

    setThumbnailCardinfoArr(
      sortThumbnailCardInfoArr("인원순", getThumbnailCardInfoArr, session?.user.id),
    );
  }, [studyVoteData, currentLocation, session]);

  const tabOptionsArr: ITabNavOptions[] = [
    {
      text: dayjsToKr(dayjs()),
      func: () => {
        setDate(dayjsToStr(dayjs()));
      },
    },
    {
      text: dayjsToKr(dayjs().add(1, "day")),
      func: () => {
        setDate(dayjsToStr(dayjs().add(1, "day")));
      },
    },
  ];

  return (
    <>
      <Box px={5} mt={5}>
        <SectionHeader title="About 카공 스터디" subTitle="동네 친구와의 열공 스터디">
          <ButtonWrapper size="xs" url={`/studyPage?date=${date}`}>
            <ShortArrowIcon dir="right" />
          </ButtonWrapper>
        </SectionHeader>
      </Box>
      <Box px={5} mt={3} mb={5} borderBottom="var(--border)">
        <TabNav tabOptionsArr={tabOptionsArr} selected={dayjsToKr(dayjs(date))} isFullSize />
      </Box>
      <Flex direction="column" px={5} mb={4}>
        {thumbnailCardInfoArr
          ? thumbnailCardInfoArr.slice(0, 3).map((thumbnailCardInfo, idx) => (
              <Box key={idx} mb={3}>
                <StudyThumbnailCard {...thumbnailCardInfo} />
              </Box>
            ))
          : [1, 2, 3].map((idx) => <StudyThumbnailCardSkeleton key={idx} />)}
        <SectionFooterButton url={`/studyList?date=${date}`} />
      </Flex>
    </>
  );
}

export default HomeStudySection;
