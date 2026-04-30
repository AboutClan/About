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
import { StudyThumbnailCardSkeleton } from "../../components/skeleton/StudyThumbnailCardSkeleton";
import { useStudySetQuery } from "../../hooks/study/queries";
import {
  setStudyThumbnailCard,
  sortThumbnailCardInfoArr,
} from "../../libs/study/thumbnailCardLibs";
import { backUrlState } from "../../recoils/navigationRecoils";
import { dayjsToStr } from "../../utils/dateTimeUtils";

function HomeStudySection() {
  const { data: studySet } = useStudySetQuery(dayjsToStr(dayjs()));

  const setBackUrl = useSetRecoilState(backUrlState);

  const [thumbnailCardInfoArr, setThumbnailCardinfoArr] = useState<StudyThumbnailCardProps[]>();
  const [cardArr, setCardArr] = useState<StudyThumbnailCardProps[]>();

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
    setCardArr(thumbnailCardInfoArr.slice(0, 5));
  }, [thumbnailCardInfoArr]);

  return (
    <>
      <Box px={5} mt={5}>
        <SectionHeader title="About 카공 스터디" subTitle="동네 친구와의 열공 스터디">
          <ButtonWrapper size="sm" url={`/studyPage?date=${dayjsToStr(dayjs())}`}>
            <ShortArrowIcon dir="right" />
          </ButtonWrapper>
        </SectionHeader>
      </Box>

      <Flex direction="column" px={5} mb={4} mt={4}>
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
