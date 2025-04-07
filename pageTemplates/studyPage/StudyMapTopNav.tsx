import { Button, Flex } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";

import CurrentLocationBtn from "../../components/atoms/CurrentLocationBtn";
import { useToast } from "../../hooks/custom/CustomToast";
import { useUserInfoQuery } from "../../hooks/user/queries";
import { getLocationByCoordinates } from "../../libs/study/getLocationByCoordinates";
import { myStudyParticipationState } from "../../recoils/studyRecoils";
import { CoordinatesProps } from "../../types/common";
import { ActiveLocation } from "../../types/services/locationTypes";

interface StudyMapTopNavProps {
  handleLocationRefetch: () => void;
  isSmall: boolean;
}

function StudyMapTopNav({ handleLocationRefetch, isSmall }: StudyMapTopNavProps) {
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
    const { lat, lon }: CoordinatesProps = {
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
      <CurrentLocationBtn onClick={handleLocationRefetch} />

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
