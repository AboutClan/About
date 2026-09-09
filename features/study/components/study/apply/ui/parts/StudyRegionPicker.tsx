import { Box, Grid } from "@chakra-ui/react";
import { useMemo } from "react";

import {
  STUDY_CREW_REGION,
  STUDY_CREW_REGION_LOCATION_MAPPING,
} from "@/constants/service/study/place";
import { LocationProps } from "@/types/common";

interface StudyRegionPickerProps {
  onPick: (location: LocationProps) => void;
  selectedLocation?: LocationProps;
}

/**
 * 지역을 고르면 그 지역의 기본 스터디 장소가 기준 위치가 된다.
 * 스터디 크루 딥링크에서 쓰는 지역별 대표 장소와 같은 데이터다.
 */
function StudyRegionPicker({ onPick, selectedLocation }: StudyRegionPickerProps) {
  const regions = useMemo(
    () => [...STUDY_CREW_REGION].sort((a, b) => a.localeCompare(b, "ko")),
    [],
  );

  return (
    <Box>
      <Box fontSize="14px" fontWeight={700} color="gray.800" mb={1}>
        지역별 스터디 기본 장소 기준으로 선택
      </Box>
      <Box fontSize="12px" color="gray.500" mb={3} lineHeight="17px">
        선택한 지역의 기본 스터디 장소가 기준 위치로 설정돼요.
      </Box>

      <Grid templateColumns="repeat(2, 1fr)" gap={2}>
        {regions.map((region) => {
          const location = STUDY_CREW_REGION_LOCATION_MAPPING[region];
          const isSelected =
            !!selectedLocation &&
            selectedLocation.latitude === location.latitude &&
            selectedLocation.longitude === location.longitude;

          // 주소의 두 번째 토큰(구/시). 지역명과 같으면 굳이 두 번 보여주지 않는다.
          const addressArr = location.address?.split(" ");
          const districtName = addressArr?.[1] || addressArr?.[0];
          const subLabel = districtName && districtName !== region ? districtName : null;

          return (
            <Box
              key={region}
              as="button"
              type="button"
              py={3}
              px={3}
              borderRadius="10px"
              border="1px solid"
              borderColor={isSelected ? "mint" : "gray.300"}
              bg={isSelected ? "mint.50" : "white"}
              color={isSelected ? "mint" : "gray.700"}
              textAlign="center"
              onClick={() => onPick(location)}
            >
              <Box fontSize="13px" fontWeight={600} lineHeight="18px">
                {region}
              </Box>
              {subLabel && (
                <Box
                  fontSize="11px"
                  fontWeight={500}
                  lineHeight="15px"
                  color={isSelected ? "mint" : "gray.500"}
                >
                  {subLabel}
                </Box>
              )}
            </Box>
          );
        })}
      </Grid>
    </Box>
  );
}

export default StudyRegionPicker;
