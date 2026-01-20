import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { AnimatePresence, motion, PanInfo } from "framer-motion";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import SectionFooterButton from "../../components/atoms/SectionFooterButton";
import {
  StudyThumbnailCard,
  StudyThumbnailCardProps,
} from "../../components/molecules/cards/StudyThumbnailCard";
import { StudyThumbnailCardSkeleton } from "../../components/skeleton/StudyThumbnailCardSkeleton";
import {
  setStudyThumbnailCard,
  sortThumbnailCardInfoArr,
} from "../../libs/study/thumbnailCardLibs";
import { DispatchString } from "../../types/hooks/reactTypes";
import { StudySetProps } from "../../types/models/studyTypes/study-set.types";
import { getNewDateBySwipe } from "../../utils/animateUtils";
import { dayjsToStr } from "../../utils/dateTimeUtils";

interface StudyPagePlaceSectionProps {
  studySet: StudySetProps;
  date: string;
  setDate: DispatchString;
}

export type StudySortedOption = "날짜순" | "인원순" | "거리순";

function StudyPagePlaceSection({ studySet, date, setDate }: StudyPagePlaceSectionProps) {
  const { data: session } = useSession();

  const [thumbnailCardInfoArr, setThumbnailCardinfoArr] = useState<StudyThumbnailCardProps[]>();
  const [sortedOption, setSortedOption] = useState<StudySortedOption>("날짜순");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    if (!studySet) {
      setThumbnailCardinfoArr(null);
      return;
    }
    const getThumbnailCardInfoArr = setStudyThumbnailCard(
      date,
      studySet,
      date === dayjsToStr(dayjs()) ? session?.user.id : null,
    );
    setThumbnailCardinfoArr(
      sortThumbnailCardInfoArr(sortedOption, getThumbnailCardInfoArr, session?.user.id),
    );
    return () => clearTimeout(timer);
  }, [studySet, sortedOption, session, date]);

  const onDragEnd = (panInfo: PanInfo) => {
    const newDate = getNewDateBySwipe(panInfo, date as string);
    if (newDate !== date) {
      setDate(newDate);
    }
  };

  return (
    <Flex flexDir="column" mb={8}>
      <Box>
        <Box my={4} />
        <Box overflowY="scroll" overscrollBehaviorY="contain">
          <AnimatePresence initial={false}>
            <motion.div>
              {thumbnailCardInfoArr?.length && !isLoading
                ? thumbnailCardInfoArr
                    .slice(0, 6)
                    .sort((a, b) =>
                      a.place.name === "셀렉티드닉스" && b.place.name !== "실시간 공부 인증"
                        ? -1
                        : a.place.name === "실시간 공부 인증"
                        ? -1
                        : 1,
                    )
                    .map((thumbnailCardInfo, idx) => (
                      <Box key={idx} mb={3}>
                        <StudyThumbnailCard {...thumbnailCardInfo} />
                      </Box>
                    ))
                : [1, 2, 3].map((idx) => <StudyThumbnailCardSkeleton key={idx} />)}
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
