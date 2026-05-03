import { Box, Flex } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import SectionFooterButton from "../../components/atoms/SectionFooterButton";
import Select from "../../components/atoms/Select";
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
import { CheckBox } from "../gather/GatherMain";

interface StudyPagePlaceSectionProps {
  studySet: StudySetProps;
  date: string;
  setDate: DispatchString;
}

export type StudySortedOption = "날짜순" | "인원순" | "거리순";

function StudyPagePlaceSection({ studySet, date, setDate }: StudyPagePlaceSectionProps) {
  const { data: session } = useSession();
  console.log(setDate);

  const [thumbnailCardInfoArr, setThumbnailCardinfoArr] = useState<StudyThumbnailCardProps[]>();
  const [sortedOption, setSortedOption] = useState<StudySortedOption>("날짜순");
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState<SortedType>("기본순");

  const [checkType, setCheckType] = useState<StudySortedOption>(null);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    if (!studySet) {
      setThumbnailCardinfoArr(null);
      return;
    }
    const getThumbnailCardInfoArr = setStudyThumbnailCard(date, studySet, session?.user.id);
    setThumbnailCardinfoArr(
      sortThumbnailCardInfoArr(sortedOption, getThumbnailCardInfoArr, session?.user.id),
    );
    return () => clearTimeout(timer);
  }, [studySet, sortedOption, session, date]);

  // const onDragEnd = (panInfo: PanInfo) => {
  //   const newDate = getNewDateBySwipe(panInfo, date as string);
  //   if (newDate !== date) {
  //     setDate(newDate);
  //   }
  // };

  return (
    <>
      <Flex mt={3} py={1} mb={4} justify="space-between" align="center">
        <Flex>
          <Box mr={4}>
            <CheckBox
              text="모집중만 보기"
              isChecked={checkType === "모집중"}
              onChange={(check: boolean) => {
                if (check) {
                  setCheckType("모집중");
                } else setCheckType(null);
              }}
            />
          </Box>
          <Box mr={4}>
            <CheckBox
              text="마감 임박"
              isChecked={checkType === "마감 임박"}
              onChange={(check: boolean) => {
                if (check) {
                  setCheckType("마감 임박");
                } else setCheckType(null);
              }}
            />
          </Box>
        </Flex>

        <Select
          options={["날짜순", "인원순", "거리순"]}
          defaultValue={sortedOption}
          size="xs"
          setValue={setSortedOption}
          isBorder={false}
        />
      </Flex>

      <Flex flexDir="column" mb={8}>
        <Box>
          <Box>
            {thumbnailCardInfoArr?.length && !isLoading
              ? thumbnailCardInfoArr.slice(0, 6).map((thumbnailCardInfo, idx) => (
                  <Box key={idx} mb={3}>
                    <StudyThumbnailCard {...thumbnailCardInfo} />
                  </Box>
                ))
              : [1, 2, 3].map((idx) => <StudyThumbnailCardSkeleton key={idx} />)}

            {thumbnailCardInfoArr?.length && (
              <SectionFooterButton url={`/studyList?date=${date}`} key="sectionFooter" />
            )}
          </Box>
        </Box>
      </Flex>
    </>
  );
}

export default StudyPagePlaceSection;
