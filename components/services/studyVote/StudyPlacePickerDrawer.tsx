import { Box, Flex } from "@chakra-ui/react";
import { useState } from "react";

import {
  setStudyThumbnailCard,
  sortThumbnailCardInfoArr,
} from "../../../libs/study/thumbnailCardLibs";
import { CoordinatesProps } from "../../../types/common";
import { IModal } from "../../../types/components/modalTypes";
import { StudyMergeResultProps } from "../../../types/models/studyTypes/study-set.types";
import PickerRowButton from "../../molecules/PickerRowButton";
import BottomFlexDrawer, { BottomFlexDrawerOptions } from "../../organisms/drawer/BottomFlexDrawer";

interface StudyPlacePickerDrawerProps extends IModal {
  studyResults: StudyMergeResultProps[];
  handlePickPlace: (placeId: string) => void;
  currentLocation: CoordinatesProps;
  date: string;
}

function StudyPlacePickerDrawer({
  studyResults,
  setIsModal,
  handlePickPlace,
  currentLocation,
  date,
}: StudyPlacePickerDrawerProps) {
  const [selectedPlaceId, setSelectedPlaceId] = useState<string>();

  const drawerOptions2: BottomFlexDrawerOptions = {
    header: {
      title: "스터디 장소 투표",
      subTitle: "참여 가능한 스터디 장소를 모두 선택해 주세요¡",
    },
    footer: {
      text: "시간 선택",
      func: () => handlePickPlace(selectedPlaceId),
      // loading: isLoading1 || isLoading2,
    },
  };

  const thumbnailArr = setStudyThumbnailCard(
    date,
    null,
    studyResults,
    null,
    currentLocation,
    null,
    null,
  );

  const sortedThumbnailArr = sortThumbnailCardInfoArr("인원순", thumbnailArr, null);

  return (
    <>
      <BottomFlexDrawer
        isOverlay
        isHideBottom
        isDrawerUp
        zIndex={5000}
        height={410}
        setIsModal={setIsModal}
        drawerOptions={drawerOptions2}
      >
        <Flex w="full" direction="column" overflowY="scroll">
          {sortedThumbnailArr?.map((studyResult, idx) => {
            const id = studyResult.place._id;
            return (
              <Box key={idx} mb={2} w="full">
                <PickerRowButton
                  {...studyResult}
                  participantCnt={studyResult.participants.length}
                  onClick={() => setSelectedPlaceId((old) => (old === id ? null : id))}
                  isNoSelect={selectedPlaceId !== id}
                />
              </Box>
            );
          })}
        </Flex>
      </BottomFlexDrawer>
    </>
  );
}

export default StudyPlacePickerDrawer;
