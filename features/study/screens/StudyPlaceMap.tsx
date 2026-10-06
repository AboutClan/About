import { Box } from "@chakra-ui/react";
import { useState } from "react";

import PlaceInfoDrawer from "@/features/studyMap/components/PlaceInfoDrawer";
import StudyPageMap from "@/features/studyMap/components/StudyPageMap";
import { CoordinatesProps } from "@/types/common";
import { StudyPlaceProps } from "@/types/models/studyTypes/study-entity.types";

interface StudyPlaceMapProps {
  /**
   * 지도 중심. 스터디를 신청했으면 내 신청 위치(매칭에 실제로 쓰는 기준점)를 준다.
   * 없으면 지도가 현재 위치 → 회원 위치 순으로 알아서 잡는다.
   */
  centerLocation?: CoordinatesProps | null;
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
      {/* 예전에는 centerLocation을 받고도 넘기지 않아, 노원으로 신청해도 지금 있는 곳(강남 등)이 보였다. */}
      <StudyPageMap isCafeMap={false} defaultLocation={centerLocation ?? undefined} />
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
