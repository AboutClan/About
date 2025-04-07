import { Box } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import VoteMap from "../../components/organisms/VoteMap";
import { getMarkersOptions } from "../../libs/study/setStudyMapOptions";
import { CoordinatesProps } from "../../types/common";
import { IMapOptions, IMarkerOptions } from "../../types/externals/naverMapTypes";
import { DispatchType } from "../../types/hooks/reactTypes";
import { StudyVoteDataProps } from "../../types/models/studyTypes/studyDetails";
import StudyMapTopNav from "./StudyMapTopNav";

interface StudyPageMapProps {
  studyVoteData: StudyVoteDataProps;
  coordinates: CoordinatesProps;
  setCenterLocation: DispatchType<CoordinatesProps>;
}

function StudyPageMap({ studyVoteData, coordinates, setCenterLocation }: StudyPageMapProps) {
  const router = useRouter();

  /* 네이버 지도와 마커 옵션 */
  const [mapOptions, setMapOptions] = useState<IMapOptions>(null);
  const [markersOptions, setMarkersOptions] = useState<IMarkerOptions[]>(null);

  useEffect(() => {
    if (!studyVoteData) return;
    setMarkersOptions(
      getMarkersOptions(studyVoteData.results, studyVoteData?.realTime, coordinates),
    );
  }, [studyVoteData, coordinates]);

  return (
    <Box
      position="relative"
      height={180}
      borderRadius="16px"
      overflow="hidden"
      border="1px solid black"
      borderColor="gray.200"
      bg="gray.100"
      onClick={() => router.push("/studyPageMap")}
    >
      <StudyMapTopNav
        handleLocationRefetch={() => (coordinates ? setCenterLocation(coordinates) : null)}
        isSmall
      />
      <VoteMap mapOptions={mapOptions} markersOptions={markersOptions} />
      {/* {!studyVoteData?.results && <MainLoadingAbsolute />} */}
    </Box>
  );
}

export default StudyPageMap;
