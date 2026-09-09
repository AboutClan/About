import { Box } from "@chakra-ui/react";
import { useState } from "react";

import RightDrawer from "@/components/modals/drawer/RightDrawer";
import StudyRegionPicker from "@/features/study/components/study/apply/ui/parts/StudyRegionPicker";
import { useUserInfoFieldMutation } from "@/features/user/hooks/mutations";
import { RegisterLocationLayout } from "@/pages/register/location";
import { LocationProps } from "@/types/common";
import { LocationDetailProps } from "@/types/models/userTypes/userInfoTypes";

export function PlaceDrawer({
  defaultLocation,
  setVoteLocation,
  onClose,
  handleVote,
  isLoading,
}: {
  onClose: () => void;
  defaultLocation: LocationDetailProps;
  // updater 함수가 아니라 확정된 장소만 넘긴다.
  setVoteLocation: (location: LocationProps) => void;
  handleVote?: (placeInfo: LocationProps) => void;
  isLoading?: boolean;
}) {
  const [placeInfo, setPlaceInfo] = useState<LocationProps>(defaultLocation);
  const [errorMessage, setErrorMessage] = useState("");
  const [isChangeLocation, setIsChangeLocation] = useState(false);

  const { mutate: changeLocationDetail } = useUserInfoFieldMutation("locationDetail", {
    onSuccess() {},
  });

  const confirm = (place: LocationProps) => {
    if (isChangeLocation) {
      changeLocationDetail(place);
    }

    if (handleVote) {
      handleVote(place);
      return;
    }

    setVoteLocation(place);
    onClose();
  };

  const handleButton = () => {
    if (!placeInfo) {
      setErrorMessage("정확한 장소를 입력해 주세요.");
      return;
    }

    confirm(placeInfo);
  };

  return (
    <RightDrawer title={handleVote ? "장소 변경" : "위치 설정"} px={false} onClose={onClose}>
      <RegisterLocationLayout
        handleButton={handleButton}
        placeInfo={placeInfo}
        setPlaceInfo={setPlaceInfo}
        text="변 경"
        errorMessage={errorMessage}
        isSlide={false}
        type="study"
        isLoading={isLoading}
        isChangeLocation={isChangeLocation}
        setIsChangeLocation={setIsChangeLocation}
        topSlot={
          <Box mb={5} pb={5} borderBottom="1px solid" borderColor="gray.200">
            <StudyRegionPicker
              selectedLocation={placeInfo}
              onPick={(place) => {
                // 한 번 탭으로 확정한다. 검색 입력 흐름과 같은 경로를 탄다.
                setPlaceInfo(place);
                confirm(place);
              }}
            />
          </Box>
        }
        searchSectionLabel={
          <Box mb={2}>
            <Box fontSize="14px" fontWeight={700} color="gray.800" mb={1}>
              직접 매칭 위치 입력하기
            </Box>
            <Box fontSize="12px" color="gray.500" lineHeight="17px">
              위 지역 대신 원하는 위치를 직접 검색할 수 있어요.
            </Box>
          </Box>
        }
      />
    </RightDrawer>
  );
}
