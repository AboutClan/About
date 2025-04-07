import { Box, Button, Flex } from "@chakra-ui/react";
import { AnimatePresence, motion, PanInfo } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import SectionFooterButton from "../../components/atoms/SectionFooterButton";
import {
  StudyThumbnailCard,
  StudyThumbnailCardProps,
} from "../../components/molecules/cards/StudyThumbnailCard";
import { StudyThumbnailCardSkeleton } from "../../components/skeleton/StudyThumbnailCardSkeleton";
import { convertRealTimesToResultFormat } from "../../libs/study/getMyStudyMethods";
import {
  setStudyThumbnailCard,
  sortThumbnailCardInfoArr,
} from "../../libs/study/thumbnailCardLibs";
import { CoordinatesProps } from "../../types/common";
import { DispatchString } from "../../types/hooks/reactTypes";
import { StudyVoteDataProps } from "../../types/models/studyTypes/studyDetails";
import { getNewDateBySwipe } from "../../utils/animateUtils";
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

  useEffect(() => {
    if (!studyVoteData) {
      setThumbnailCardinfoArr(null);
      return;
    }
    const convertedRealTimes = studyVoteData?.realTimes
      ? convertRealTimesToResultFormat(studyVoteData.realTimes)
      : [];
    const getThumbnailCardInfoArr = setStudyThumbnailCard(
      date,
      studyVoteData?.participations,
      [...studyVoteData.results, ...convertedRealTimes],
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
  console.log("thumb", thumbnailCardInfoArr);
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
                  thumbnailCardInfoArr
                    .slice(0, 3)
                    .map(({ participants, ...thumbnailCardInfo }, idx) => (
                      <Box key={idx} mb={3}>
                        <StudyThumbnailCard
                          {...thumbnailCardInfo}
                          participantCnt={participants.length}
                        />
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
                    minH="114px"
                    borderRadius="8px"
                    color="gray.600"
                    border="var(--border)"
                  >
                    {true ? (
                      <>
                        {location} 지역에 등록된 스터디 장소가 없습니다.
                        <br />
                        아래 버튼을 눌러 새로운 장소를 등록해보세요!
                        <Button borderRadius="8px" mt={4} colorScheme="mint" w="full">
                          신규 스터디 장소 추가
                        </Button>
                      </>
                    ) : (
                      <>
                        현재 진행중인 스터디가 없습니다.
                        <br />
                        하단의 개인 스터디 신청을 통해서 참여해 주세요!
                      </>
                    )}
                  </Flex>
                )
              ) : (
                [1, 2, 3].map((idx) => <StudyThumbnailCardSkeleton key={idx} />)
              )}
            </motion.div>
            {thumbnailCardInfoArr?.length && (
              <SectionFooterButton url={`/studyList?date=${date}`} />
            )}
          </AnimatePresence>
        </Box>
      </Box>
    </Flex>
  );
}

export default StudyPagePlaceSection;
