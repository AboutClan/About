import { Box, Flex } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";

import ColorLabelRow from "@/components/molecules/rows/ColorLabelRow";
import VoteMap from "@/components/organisms/VoteMap";
import { getPlaceBasicIcon } from "@/features/study/lib/getStudyVoteIcon";
import { getMapOptions } from "@/features/study/lib/setStudyMapOptions";
import { LocationProps } from "@/types/common";
import { IMapOptions, IMarkerOptions } from "@/types/externals/naverMapTypes";

interface StudyExpectedMapProps {
  centerLocations: LocationProps[];
  rangeNum: number;
}

// VoteMap이 그리는 바깥(mint) 원의 반경. circleCenter size sm/md/lg = 2/3/4km의 1.5배다.
const OUTER_RADIUS_KM: Record<number, number> = { 1: 3, 2: 4.5, 3: 6 };

const KM_PER_LAT_DEGREE = 111;

// fitBounds에 넘길 경계를 이 비율만큼 부풀려 여백을 만든다.
const BOUNDS_PADDING_RATIO = 1.25;

// 기준점이 멀리 떨어지면 기본 minZoom(10)으로는 둘 다 담기지 않는다.
// 이 지도는 범위를 보여주는 용도라 더 축소할 수 있게 열어 준다.
const EXPECTED_MAP_MIN_ZOOM = 7;

function StudyExpectedMap({ centerLocations, rangeNum }: StudyExpectedMapProps) {
  const [mapOptions, setMapOptions] = useState<IMapOptions>();
  const [markerOptions, setMarkerOptions] = useState<IMarkerOptions[]>();
  const [zoomNumber, setZoomNumber] = useState<number>(12);

  const center = useMemo(() => {
    if (!centerLocations.length) return null;
    const lat = centerLocations.reduce((sum, l) => sum + l.latitude, 0) / centerLocations.length;
    const lon = centerLocations.reduce((sum, l) => sum + l.longitude, 0) / centerLocations.length;
    return { lat, lon };
  }, [centerLocations]);

  // 점이 아니라 원 전체가 보여야 하므로 각 원의 경계 상자 꼭짓점을 넘긴다.
  // rangeNum이 바뀌면 반경이 바뀌므로 줌도 따라온다.
  const fitBounds = useMemo(() => {
    // 원이 화면 가장자리에 딱 붙지 않도록 여유를 준다. 모바일 폭에서 특히 필요하다.
    const radiusKm = (OUTER_RADIUS_KM[rangeNum] ?? OUTER_RADIUS_KM[2]) * BOUNDS_PADDING_RATIO;

    return centerLocations.flatMap((l) => {
      const dLat = radiusKm / KM_PER_LAT_DEGREE;
      const dLon = radiusKm / (KM_PER_LAT_DEGREE * Math.cos((l.latitude * Math.PI) / 180));
      return [
        { lat: l.latitude - dLat, lon: l.longitude - dLon },
        { lat: l.latitude + dLat, lon: l.longitude + dLon },
      ];
    });
  }, [centerLocations, rangeNum]);

  const circleCenter = useMemo(
    () =>
      centerLocations.map((l) => ({
        lat: l.latitude,
        lon: l.longitude,
        size: (rangeNum === 1 ? "sm" : rangeNum === 2 ? "md" : "lg") as "sm" | "md" | "lg",
      })),
    [centerLocations, rangeNum],
  );

  useEffect(() => {
    if (!center) return;
    // 초기 렌더용 중심/줌. 실제 줌은 fitBounds가 잡는다.
    setMapOptions({ ...getMapOptions(center, 12), minZoom: EXPECTED_MAP_MIN_ZOOM });
  }, [center]);

  useEffect(() => {
    if (typeof naver === "undefined") return;

    setMarkerOptions(
      centerLocations.map((l) => ({
        position: new naver.maps.LatLng(l.latitude, l.longitude),
        icon: {
          content: getPlaceBasicIcon("orange", null),
          size: new naver.maps.Size(120, 60),
          anchor: new naver.maps.Point(60, 60),
        },
      })),
    );
  }, [zoomNumber, centerLocations]);

  if (!center) return null;

  return (
    <>
      <Box mt={5} mb={10}>
        <Box mt={3} mb={2}>
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
              circleCenter={circleCenter}
              fitBounds={fitBounds}
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
