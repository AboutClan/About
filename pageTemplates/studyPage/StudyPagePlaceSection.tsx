import { Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { AnimatePresence, motion, PanInfo } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import SectionFooterButton from "../../components/atoms/SectionFooterButton";
import {
  StudyThumbnailCard,
  StudyThumbnailCardProps,
} from "../../components/molecules/cards/StudyThumbnailCard";
import { StudyThumbnailCardSkeleton } from "../../components/skeleton/StudyThumbnailCardSkeleton";
import { useKakaoMultipleLocationQuery } from "../../hooks/external/queries";
import { convertStudyToMergeStudy } from "../../libs/study/studyConverters";
import {
  setStudyThumbnailCard,
  sortThumbnailCardInfoArr,
} from "../../libs/study/thumbnailCardLibs";
import { CoordinatesProps } from "../../types/common";
import { DispatchString } from "../../types/hooks/reactTypes";
import { StudyVoteDataProps } from "../../types/models/studyTypes/baseTypes";
import { getNewDateBySwipe } from "../../utils/animateUtils";
import { dayjsToStr } from "../../utils/dateTimeUtils";
import StudyPagePlaceSectionFilterBar from "./studyPageDrawer/StudyPagePlaceBlockFilterBar";

interface StudyPagePlaceSectionProps {
  studyVoteData: StudyVoteDataProps;
  date: string;
  setDate: DispatchString;
  currentLocation: CoordinatesProps;
}

type SortedOption = "인원순" | "거리순";

function StudyPagePlaceSection({
  studyVoteData,
  date,
  setDate,
  currentLocation,
}: StudyPagePlaceSectionProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);

  const [thumbnailCardInfoArr, setThumbnailCardinfoArr] = useState<StudyThumbnailCardProps[]>();
  const [sortedOption, setSortedOption] = useState<SortedOption>("인원순");

  const coords = studyVoteData?.results.map((result) => ({
    lat: result?.center.lat,
    lon: result?.center.lon,
    id: result?.place._id,
  }));
  console.log(studyVoteData);
  const { data } = useKakaoMultipleLocationQuery(coords);
  console.log(4, data?.[0].region_2depth_name);

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
      true,
    );

    setThumbnailCardinfoArr(sortThumbnailCardInfoArr(sortedOption, getThumbnailCardInfoArr));
  }, [studyVoteData, currentLocation, sortedOption]);

  const onDragEnd = (panInfo: PanInfo) => {
    const newDate = getNewDateBySwipe(panInfo, date as string);
    if (newDate !== date) {
      setDate(newDate);
      newSearchParams.set("date", newDate);
      router.replace(`/studyPage?${newSearchParams.toString()}`, { scroll: false });
    }
  };
  return (
    <Flex flexDir="column" mt={5} mb={8}>
      <Box>
        {thumbnailCardInfoArr?.length ? (
          <StudyPagePlaceSectionFilterBar
            sortedOption={sortedOption}
            setSortedOption={setSortedOption}
            placeCnt={thumbnailCardInfoArr?.filter((par) => par.participants.length > 0).length}
            date={date}
          />
        ) : (
          <Box my={4} />
        )}
        <Box overflowY="scroll" overscrollBehaviorY="contain">
          <AnimatePresence initial={false}>
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.3}
              onDragEnd={(_, panInfo) => onDragEnd(panInfo)}
            >
              {thumbnailCardInfoArr ? (
                thumbnailCardInfoArr.length ? (
                  thumbnailCardInfoArr.slice(0, 3).map((thumbnailCardInfo, idx) => (
                    <Box key={idx} mb={3}>
                      <StudyThumbnailCard {...thumbnailCardInfo} />
                    </Box>
                  ))
                ) : (
                  <Flex
                    justify="center"
                    align="center"
                    fontSize="14px"
                    fontWeight="medium"
                    bg="gray.100"
                    px={3}
                    py={4}
                    minH="92px"
                    borderRadius="8px"
                    color="gray.600"
                    border="var(--border)"
                  >
                    {studyVoteData?.participations ? (
                      <>
                        지역에 등록된 스터디 장소가 없습니다.
                        <Button borderRadius="8px" mt={4} colorScheme="mint" w="full">
                          신규 스터디 장소 추가
                        </Button>
                      </>
                    ) : date === dayjsToStr(dayjs()) ? (
                      <>
                        현재 진행중인 스터디가 없습니다.
                        <br />
                        하단의 개인 스터디 신청을 통해서 참여해 주세요!
                      </>
                    ) : (
                      <>저장된 스터디 기록이 없습니다.</>
                    )}
                  </Flex>
                )
              ) : (
                [1, 2, 3].map((idx) => <StudyThumbnailCardSkeleton key={idx} />)
              )}
            </motion.div>
            {thumbnailCardInfoArr?.length && (
              <SectionFooterButton url={`/studyList?date=${date}`} key="sectionFooter" />
            )}
          </AnimatePresence>
        </Box>
      </Box>
    </Flex>
  );
}

export default StudyPagePlaceSection;
