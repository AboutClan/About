import { useState } from "react";

import { useUserInfoFieldMutation } from "../../../../../../hooks/user/mutations";
import { RegisterLocationLayout } from "../../../../../../pages/register/location";
import { LocationProps } from "../../../../../../types/common";
import { DispatchType } from "../../../../../../types/hooks/reactTypes";
import { LocationDetailProps } from "../../../../../../types/models/userTypes/userInfoTypes";
import RightDrawer from "../../../../../organisms/drawer/RightDrawer";

export function PlaceDrawer({
  defaultLocation,
  setVoteLocation,
  onClose,
  handleVote,
  isLoading,
}: {
  onClose: () => void;
  defaultLocation: LocationDetailProps;
  setVoteLocation: DispatchType<LocationDetailProps>;
  handleVote?: (placeInfo: LocationProps) => void;
  isLoading?: boolean;
}) {
  const [placeInfo, setPlaceInfo] = useState<LocationProps>(defaultLocation);
  const [errorMessage, setErrorMessage] = useState("");
  const [isChangeLocation, setIsChangeLocation] = useState(false);

  const { mutate: changeLocationDetail } = useUserInfoFieldMutation("locationDetail", {
    onSuccess() {},
  });

  const handleButton = () => {
    if (!placeInfo) {
      setErrorMessage("정확한 장소를 입력해 주세요.");
      return;
    }

    if (isChangeLocation) {
      changeLocationDetail(placeInfo);
    }

    if (handleVote) {
      handleVote(placeInfo);
      return;
    }

    setVoteLocation(placeInfo);
    onClose();
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
      />
    </RightDrawer>
  );
}
