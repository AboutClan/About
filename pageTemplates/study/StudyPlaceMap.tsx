import { Box } from "@chakra-ui/react";
import { useState } from "react";

import SectionHeader from "../../components/atoms/SectionHeader";
import StudyPageMap from "../../pageTemplates/studyPage/studyPageMap/StudyPageMap";
import { CoordinatesProps } from "../../types/common";
import { StudyPlaceProps } from "../../types/models/studyTypes/study-entity.types";
import PlaceInfoDrawer from "../studyPage/PlaceInfoDrawer";

interface StudyPlaceMapProps {
  centerLocation: CoordinatesProps;
}

function StudyPlaceMap({ centerLocation }: StudyPlaceMapProps) {
  const [placeInfo, setPlaceInfo] = useState<StudyPlaceProps>();
  console.log(centerLocation);
  return (
    <>
      <Box px={5} mt={10} mb={2}>
        <Box fontSize="18px" mb={4} fontWeight="bold"></Box>
        <SectionHeader
          title="ABOUT 카공 스터디 장소"
          subTitle="아래 등록된 장소 중 가까운 곳으로 스터디가 매칭돼요!"
        ></SectionHeader>
      </Box>
      <StudyPageMap type="mainPlace" isCafeMap={false} />
      {placeInfo && (
        <PlaceInfoDrawer
          handleVotePick={null}
          placeInfo={placeInfo}
          onClose={() => setPlaceInfo(null)}
        />
      )}
    </>
  );
}

export default StudyPlaceMap;
