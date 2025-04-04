import { Box, Button, Flex } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";

import CurrentLocationBtn from "../../components/atoms/CurrentLocationBtn";
import Select from "../../components/atoms/Select";
import { LOCATION_ALL } from "../../constants/location";
import { useToast } from "../../hooks/custom/CustomToast";
import { useUserInfoQuery } from "../../hooks/user/queries";
import { getLocationByCoordinates } from "../../libs/study/getLocationByCoordinates";
import { myStudyParticipationState } from "../../recoils/studyRecoils";
import { CoordinateProps } from "../../types/common";
import { DispatchBoolean, DispatchType } from "../../types/hooks/reactTypes";
import { ActiveLocation, Location } from "../../types/services/locationTypes";

interface StudyMapTopNavProps {
  setIsLocationFetch: DispatchBoolean;
  setCenterLocation: DispatchType<CoordinateProps>;
  isSmall: boolean;
}

function StudyMapTopNav({
  setIsLocationFetch,

  setCenterLocation,
  isSmall,
}: StudyMapTopNavProps) {
  const toast = useToast();
  const { data: userInfo } = useUserInfoQuery();
  const userPlace = userInfo?.locationDetail;

  const myStudyParticipation = useRecoilValue(myStudyParticipationState);
  const { latitude, longitude } = myStudyParticipation?.place || {};

  const handleNavButton = () => {
    if (!myStudyParticipation && !userPlace) {
      toast("warning", "등록된 주소지가 없습니다.");
      return;
    }
    const { lat, lon }: CoordinateProps = {
      lat: myStudyParticipation ? latitude : userPlace?.lat,
      lon: myStudyParticipation ? longitude : userPlace?.lon,
    };
    const changeLocation = getLocationByCoordinates(lat, lon) as ActiveLocation | null;
    if (changeLocation) {

      setCenterLocation({ lat, lon });
    }
  };

  return (
    <Flex w="100%" justify="space-between" p={4} position="absolute" top="0" left="0" zIndex={10}>
      <CurrentLocationBtn onClick={() => setIsLocationFetch(true)} />

      {!isSmall && (
        <Flex>
          <Button
            borderRadius="20px"
            size="md"
            fontSize="11px"
            fontWeight="semibold"
            h="32px"
            bg="white"
            border="var(--border)"
            borderColor="gray.200"
            onClick={handleNavButton}
          >
            {myStudyParticipation ? "스터디 장소" : "주 활동 장소"}
          </Button>
    
        </Flex>
      )}
    </Flex>
  );
}

export default StudyMapTopNav;
