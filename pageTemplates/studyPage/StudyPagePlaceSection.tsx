import { Box, Button, Flex } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import Select from "../../components/atoms/Select";
import {
  StudyThumbnailCard,
  StudyThumbnailCardProps,
} from "../../components/molecules/cards/StudyThumbnailCard";
import { StudyThumbnailCardSkeleton } from "../../components/skeleton/StudyThumbnailCardSkeleton";
import { useLastStudySetQuery } from "../../hooks/study/queries";
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

export type FilterType = "예정 스터디" | "지난 스터디";
export type StudySortedOption = "날짜순" | "인원순" | "거리순";

function StudyPagePlaceSection({ studySet, date, setDate }: StudyPagePlaceSectionProps) {
  const { data: session } = useSession();
  console.log(setDate);

  const [lastIdx, setLastIdx] = useState(0);

  const { data: passedStudyData } = useLastStudySetQuery(lastIdx, {
    enabled: lastIdx !== 0,
  });

  const [thumbnailCardInfoArr, setThumbnailCardinfoArr] = useState<StudyThumbnailCardProps[]>();
  const [sortedOption, setSortedOption] = useState<StudySortedOption>("날짜순");
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState<FilterType>("예정 스터디");

  useEffect(() => {
    if (sortBy === "예정 스터디") {
      setLastIdx(0);
    } else {
      setLastIdx(1);
    }
  }, [sortBy]);

  useEffect(() => {
    if (sortBy === "지난 스터디") return;
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
  }, [studySet, sortedOption, session, date, sortBy]);

  useEffect(() => {
    if (!passedStudyData || (sortBy === "예정 스터디" && lastIdx === 0)) return;

    const getThumbnailCardInfoArr = setStudyThumbnailCard(
      date,
      passedStudyData,
      session?.user.id,
      null,
      null,
      true,
    );

    setThumbnailCardinfoArr((old) => [
      ...(sortBy === "예정 스터디" && old ? old : []),
      ...getThumbnailCardInfoArr,
    ]);
  }, [passedStudyData, sortBy, lastIdx]);

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
              text="예정 스터디"
              isChecked={sortBy === "예정 스터디"}
              onChange={(check: boolean) => {
                if (check) {
                  setLastIdx(0);
                  setSortBy("예정 스터디");
                } else setSortBy("지난 스터디");
              }}
            />
          </Box>
          <Box mr={4}>
            <CheckBox
              text="지난 스터디"
              isChecked={sortBy === "지난 스터디"}
              onChange={(check: boolean) => {
                if (check) {
                  setSortBy("지난 스터디");
                } else setSortBy("예정 스터디");
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

      <Flex flexDir="column" mb={20}>
        <Box>
          <Box>
            {thumbnailCardInfoArr?.length && !isLoading
              ? thumbnailCardInfoArr.map((thumbnailCardInfo, idx) => (
                  <Box key={idx} mb={3}>
                    <StudyThumbnailCard {...thumbnailCardInfo} />
                  </Box>
                ))
              : [1, 2, 3, 4, 5, 6, 7].map((idx) => <StudyThumbnailCardSkeleton key={idx} />)}

            {thumbnailCardInfoArr?.length && (
              <Button
                w="100%"
                h="40px"
                bgColor="white"
                border="0.5px solid #E8E8E8"
                onClick={() => setLastIdx((old) => old + 1)}
              >
                지난 스터디 더 보기
              </Button>
            )}
          </Box>
        </Box>
      </Flex>
    </>
  );
}

export default StudyPagePlaceSection;
