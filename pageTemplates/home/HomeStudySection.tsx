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
import TabNav, { ITabNavOptions } from "../../components/molecules/navs/TabNav";
import { StudyThumbnailCardSkeleton } from "../../components/skeleton/StudyThumbnailCardSkeleton";
import { useStudySetQuery } from "../../hooks/study/queries";
import {
  setStudyThumbnailCard,
  sortThumbnailCardInfoArr,
} from "../../libs/study/thumbnailCardLibs";
import { backUrlState } from "../../recoils/navigationRecoils";
import { dayjsToStr, getTodayStr } from "../../utils/dateTimeUtils";

type StudyTab = "오늘 날짜 스터디" | "진행 예정 스터디";

function HomeStudySection() {
  const { data: studySet } = useStudySetQuery(dayjsToStr(dayjs()));
  const setBackUrl = useSetRecoilState(backUrlState);

  const [tab, setTab] = useState<StudyTab>("오늘 날짜 스터디");
  const [thumbnailCardInfoArr, setThumbnailCardinfoArr] = useState<StudyThumbnailCardProps[]>();
  const [cardArr, setCardArr] = useState<StudyThumbnailCardProps[]>();

  useEffect(() => {
    if (!studySet) {
      setThumbnailCardinfoArr(null);
      return;
    }
    const getThumbnailCardInfoArr = setStudyThumbnailCard(dayjsToStr(dayjs()), studySet, null, () =>
      setBackUrl("/home"),
    );
    setThumbnailCardinfoArr(sortThumbnailCardInfoArr("날짜순", getThumbnailCardInfoArr, null));
  }, [studySet]);

  useEffect(() => {
    if (!thumbnailCardInfoArr) return;
    if (tab === "오늘 날짜 스터디") {
      setCardArr(
        thumbnailCardInfoArr
          .filter(
            (card) =>
              !card.place.date ||
              (dayjs().hour() >= 18
                ? card.place.date.isAfter(dayjs())
                : dayjsToStr(card.place.date) === getTodayStr() && card.participants.length > 1),
          )
          .slice(0, 5),
      );
    } else {
      setCardArr(
        thumbnailCardInfoArr
          .filter(
            (card) =>
              card.place.date && card.place.date.isAfter(dayjs()) && card.participants.length > 1,
          )
          .slice(0, 5),
      );
    }
  }, [tab, thumbnailCardInfoArr]);

  const tabOptionsArr: ITabNavOptions[] = [
    {
      text: "오늘 날짜 스터디",
      func: () => {
        setTab("오늘 날짜 스터디");
      },
    },
    {
      text: "진행 예정 스터디",
      func: () => {
        setTab("진행 예정 스터디");
      },
    },
  ];

  return (
    <>
      <Box px={5} mt={8}>
        <SectionHeader title="About 카공 스터디" subTitle="동네 친구와의 열공 스터디">
          <ButtonWrapper size="sm" url={`/studyPage?date=${dayjsToStr(dayjs())}`}>
            <ShortArrowIcon dir="right" />
          </ButtonWrapper>
        </SectionHeader>
      </Box>
      <Box px={5} mt={3} mb={5} borderBottom="var(--border)">
        <TabNav tabOptionsArr={tabOptionsArr} selected={tab} isFullSize />
      </Box>
      <Flex direction="column" px={5} mb={4}>
        {cardArr
          ? cardArr.map((thumbnailCardInfo, idx) => (
              <Box key={idx} mb={3}>
                <StudyThumbnailCard {...thumbnailCardInfo} />
              </Box>
            ))
          : [1, 2, 3].map((idx) => <StudyThumbnailCardSkeleton key={idx} />)}
        <SectionFooterButton url={`/studyList?date=${dayjsToStr(dayjs())}`} />
      </Flex>
    </>
  );
}

export default HomeStudySection;
