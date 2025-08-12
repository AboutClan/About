import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { AnimatePresence, motion, PanInfo } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import SectionFooterButton from "../../components/atoms/SectionFooterButton";
import {
  StudyThumbnailCard,
  StudyThumbnailCardProps,
} from "../../components/molecules/cards/StudyThumbnailCard";
import { StudyThumbnailCardSkeleton } from "../../components/skeleton/StudyThumbnailCardSkeleton";
import { useUserCurrentLocation } from "../../hooks/custom/CurrentLocationHook";
import {
  setStudyThumbnailCard,
  sortThumbnailCardInfoArr,
} from "../../libs/study/thumbnailCardLibs";
import { DispatchString } from "../../types/hooks/reactTypes";
import { StudySetProps } from "../../types/models/studyTypes/derivedTypes";
import { getNewDateBySwipe } from "../../utils/animateUtils";
import { dayjsToStr } from "../../utils/dateTimeUtils";
import StudyPagePlaceSectionFilterBar from "./studyPageDrawer/StudyPagePlaceBlockFilterBar";

interface StudyPagePlaceSectionProps {
  studySet: StudySetProps;
  date: string;
  setDate: DispatchString;
}

export type StudySortedOption = "날짜순" | "인원순" | "거리순";

function StudyPagePlaceSection({ studySet, date, setDate }: StudyPagePlaceSectionProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const { currentLocation } = useUserCurrentLocation();

  const [thumbnailCardInfoArr, setThumbnailCardinfoArr] = useState<StudyThumbnailCardProps[]>();
  const [sortedOption, setSortedOption] = useState<StudySortedOption>("날짜순");
  const [locationMapping, setLocationMapping] = useState<{ branch: string; id: string }[]>();

  // const { data: locationMappingData } = useKakaoMultipleLocationQuery(
  //   studySet
  //     .map((study) => ({
  //       lat: study.place.latitude,
  //       lon: study.place.longitude,
  //       id: study.place._id,
  //     })),
  //   true,
  //   {
  //     enabled: !!mergeStudy,
  //   },
  // );
  // useEffect(() => {
  //   if (locationMappingData) {
  //     setLocationMapping(locationMappingData);
  //   }
  // }, [locationMappingData]);

  useEffect(() => {
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
  }, [studySet, sortedOption, session]);

  const onDragEnd = (panInfo: PanInfo) => {
    const newDate = getNewDateBySwipe(panInfo, date as string);
    if (newDate !== date) {
      setDate(newDate);
      // newSearchParams.set("date", newDate);
      // router.replace(`/studyPage?${newSearchParams.toString()}`, { scroll: false });
    }
  };

  return (
    <Flex flexDir="column" mb={8}>
      <Box>
        {thumbnailCardInfoArr?.length ? (
          <StudyPagePlaceSectionFilterBar
            sortedOption={sortedOption}
            setSortedOption={setSortedOption}
            placeCnt={thumbnailCardInfoArr?.length}
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
              {thumbnailCardInfoArr?.length
                ? thumbnailCardInfoArr.slice(0, 6).map((thumbnailCardInfo, idx) => (
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
