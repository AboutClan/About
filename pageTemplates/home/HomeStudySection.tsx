import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";

import ButtonWrapper from "../../components/atoms/ButtonWrapper";
import SectionFooterButton from "../../components/atoms/SectionFooterButton";
import SectionHeader from "../../components/atoms/SectionHeader";
import { ShortArrowIcon } from "../../components/Icons/ArrowIcons";
import {
  StudyThumbnailCard,
  StudyThumbnailCardProps,
} from "../../components/molecules/cards/StudyThumbnailCard";
import TabNav from "../../components/molecules/navs/TabNav";
import { StudyThumbnailCardSkeleton } from "../../components/skeleton/StudyThumbnailCardSkeleton";
import { useStudySetQuery } from "../../hooks/study/queries";
import {
  setStudyThumbnailCard,
  sortThumbnailCardInfoArr,
} from "../../libs/study/thumbnailCardLibs";
import { backUrlState } from "../../recoils/navigationRecoils";
import { dayjsToStr, getTodayStr } from "../../utils/dateTimeUtils";

const STUDY_TAB_ARR = ["오늘 날짜 스터디", "예정된 스터디"] as const;
type StudyTab = (typeof STUDY_TAB_ARR)[number];

function HomeStudySection() {
  const { data: studySet } = useStudySetQuery(dayjsToStr(dayjs()));

  const setBackUrl = useSetRecoilState(backUrlState);

  const [thumbnailCardInfoArr, setThumbnailCardinfoArr] = useState<StudyThumbnailCardProps[]>();
  const [cardArr, setCardArr] = useState<StudyThumbnailCardProps[]>();

  const [tab, setTab] = useState<StudyTab>("오늘 날짜 스터디");

  useEffect(() => {
    if (!studySet) {
      setThumbnailCardinfoArr(null);
      return;
    }
    const getThumbnailCardInfoArr = setStudyThumbnailCard(
      dayjsToStr(dayjs()),
      studySet,
      null,
      () => setBackUrl("/home"),
      true,
    );
    setThumbnailCardinfoArr(sortThumbnailCardInfoArr("날짜순", getThumbnailCardInfoArr, null));
  }, [studySet]);

  useEffect(() => {
    if (!thumbnailCardInfoArr) return;
    if (tab === "오늘 날짜 스터디") {
      setCardArr(
        thumbnailCardInfoArr
          .filter((card) => !card.place.date || dayjsToStr(card.place.date) === getTodayStr())
          .slice(0, 5),
      );
    } else {
      setCardArr(
        thumbnailCardInfoArr
          .filter((card) => card.place.date && card.place.date.isAfter(dayjs()))
          .slice(0, 5),
      );
    }
  }, [tab, thumbnailCardInfoArr]);

  // useEffect(() => {
  //   if (!thumbnailCardInfoArr) return;
  //   setCardArr(thumbnailCardInfoArr.slice(0, 5));
  // }, [thumbnailCardInfoArr]);

  return (
    <>
      <Box px={5} mt={5}>
        <SectionHeader title="About 카공 스터디" subTitle="동네 친구와의 열공 스터디">
          <ButtonWrapper size="sm" url={`/studyPage?date=${dayjsToStr(dayjs())}`}>
            <ShortArrowIcon dir="right" />
          </ButtonWrapper>
        </SectionHeader>
      </Box>
      <Box px={5} mt={3} mb={5} borderBottom="var(--border)">
        <TabNav
          tabOptionsArr={STUDY_TAB_ARR.map((s) => ({
            text: s,
            func: () => {
              setTab(s);
            },
          }))}
          selected={tab}
          isFullSize
        />
      </Box>
      <Flex direction="column" px={5} mb={4}>
        {cardArr
          ? cardArr.map((thumbnailCardInfo, idx) => (
              <Box key={idx} mb={3}>
                <StudyThumbnailCard {...thumbnailCardInfo} />
              </Box>
            ))
          : [1, 2, 3].map((idx) => <StudyThumbnailCardSkeleton key={idx} />)}
        <SectionFooterButton url={`/studyPage?date=${dayjsToStr(dayjs())}`} />
      </Flex>
    </>
  );
}

export default HomeStudySection;
