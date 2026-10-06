import { Box } from "@chakra-ui/react";
import { useState } from "react";

import PlaceInfoDrawer from "@/features/studyMap/components/PlaceInfoDrawer";
import StudyPageMap from "@/features/studyMap/components/StudyPageMap";
import { CoordinatesProps } from "@/types/common";
import { StudyPlaceProps } from "@/types/models/studyTypes/study-entity.types";

interface StudyPlaceMapProps {
  centerLocation: CoordinatesProps;
}

function StudyPlaceMap({ centerLocation }: StudyPlaceMapProps) {
  const [placeInfo, setPlaceInfo] = useState<StudyPlaceProps>();
  return (
    <>
      {/* 제목 → 설명 순서. 공용 SectionHeader는 설명을 제목 위에 그려서 직접 쓴다. */}
      <Box px={5} mt={5} mb={3}>
        <Box fontSize="18px" fontWeight="bold" lineHeight="26px" color="gray.800">
          카공 스터디 장소
        </Box>
        <Box mt={1} fontSize="13px" lineHeight="20px" color="gray.500">
          아래 등록된 장소 중 가까운 곳으로 스터디가 매칭돼요.
        </Box>
      </Box>
      <StudyPageMap isCafeMap={false} />
      {placeInfo && (
        <PlaceInfoDrawer
          handleVotePick={null}
          placeInfo={placeInfo}
          onClose={() => setPlaceInfo(null)}
          pickReviewPlace={() => {}}
        />
      )}
    </>
  );
}

export default StudyPlaceMap;
