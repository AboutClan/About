import { Box, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import ColorLabelRow from "../../components/molecules/rows/ColorLabelRow";
import VoteMap from "../../components/organisms/VoteMap";
import { getPlaceBasicIcon } from "../../libs/study/getStudyVoteIcon";
import { getMapOptions } from "../../libs/study/setStudyMapOptions";
import { LocationProps } from "../../types/common";
import { IMapOptions, IMarkerOptions } from "../../types/externals/naverMapTypes";

interface StudyExpectedMapProps {
  centerLocation: LocationProps;
  rangeNum: number;
}

function StudyExpectedMap({ centerLocation, rangeNum }: StudyExpectedMapProps) {
  const [mapOptions, setMapOptions] = useState<IMapOptions>();
  const [markerOptions, setMarkerOptions] = useState<IMarkerOptions[]>();
  const [zoomNumber, setZoomNumber] = useState<number>(12);

  useEffect(() => {
    setMapOptions(
      getMapOptions({ lat: centerLocation.latitude, lon: centerLocation.longitude }, 12),
    );
  }, [centerLocation]);

  useEffect(() => {
    setMarkerOptions([
      {
        position: new naver.maps.LatLng(centerLocation.latitude, centerLocation.longitude),
        icon: {
          content: getPlaceBasicIcon("mint", centerLocation?.name, true),
          size: new naver.maps.Size(72, 60),
          anchor: new naver.maps.Point(36, 48),
        },
      },
    ]);
  }, [zoomNumber, centerLocation]);
  return (
    <>
      <Box mt={5} mb={10}>
        <Box mt={3} mb={3}>
          <Box
            aspectRatio={1 / 1}
            position="relative"
            w="full"
            zIndex={0}
            borderRadius="12px"
            overflow="hidden"
          >
            <VoteMap
              mapOptions={mapOptions}
              markersOptions={markerOptions}
              zoomChange={(zoom: number) => setZoomNumber(zoom)}
              circleCenter={[
                {
                  lat: centerLocation.latitude,
                  lon: centerLocation.longitude,
                  size: rangeNum === 1 ? "sm" : rangeNum === 2 ? "md" : "lg",
                },
              ]}
            />
          </Box>
        </Box>{" "}
        <Flex justify="end">
          <ColorLabelRow
            props={[
              { color: "blue", text: "예상 매칭 범위" },
              { color: "mint", text: "최대 매칭 범위" },
            ]}
          />
        </Flex>
      </Box>
    </>
  );
}

export default StudyExpectedMap;
