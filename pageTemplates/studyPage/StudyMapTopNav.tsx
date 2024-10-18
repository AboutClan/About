import { Box, Flex } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import CurrentLocationBtn from "../../components/atoms/CurrentLocationBtn";
import Select from "../../components/atoms/Select";
import ButtonGroups, { ButtonOptionsProps } from "../../components/molecules/groups/ButtonGroups";
import { LOCATION_OPEN } from "../../constants/location";
import { useToast } from "../../hooks/custom/CustomToast";
import { DispatchBoolean, DispatchType } from "../../types/hooks/reactTypes";
import { ActiveLocation } from "../../types/services/locationTypes";

type LocationFilterType = "현재 위치" | "활동 장소" | "스터디 장소";

const FILTER_TYPE_ARR = ["활동 장소"] as LocationFilterType[];

const FILTER_TO_PARAM: Record<LocationFilterType, string> = {
  "현재 위치": "currentPlace",
  "활동 장소": "mainPlace",
  "스터디 장소": "votePlace",
};

interface StudyMapTopNavProps {
  hasMainLocation: boolean;
  location: ActiveLocation;
  setLocation: DispatchType<ActiveLocation>;
  setIsLocationFetch: DispatchBoolean;
}

function StudyMapTopNav({
  setIsLocationFetch,
  location,
  setLocation,
  hasMainLocation,
}: StudyMapTopNavProps) {
  const toast = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);

  const [locationFilterType, setLocationFilterType] = useState<LocationFilterType>("현재 위치");
  // const myStudy = useRecoilValue(myStudyInfoState);
  // const myRealStudy = useRecoilValue(myRealStudyInfoState);

  const handleNavButton = (type: LocationFilterType) => {
    if (type === "활동 장소" && !hasMainLocation) {
      toast("warning", "등록된 활동 장소가 없습니다.");
      return;
    }
    if (type === "현재 위치") {
      setIsLocationFetch(true);
    }
    if (locationFilterType === type) {
    
      setLocationFilterType("현재 위치");
      newSearchParams.set("category", "currentPlace");
    } else {
      setLocationFilterType(type);
      newSearchParams.set("category", FILTER_TO_PARAM[type]);
    }
    router.replace(`/studyPage?${newSearchParams.toString()}`);
  };

  const realButtonOptionsArr: ButtonOptionsProps[] = FILTER_TYPE_ARR.map((type) => ({
    text: type,
    func: () => handleNavButton(type),
  }));

  return (
    <Flex w="100%" justify="space-between" p={5} position="absolute" top="0" left="0" zIndex={10}>
      <CurrentLocationBtn onClick={() => handleNavButton("현재 위치")} />
      <Flex>
        <ButtonGroups
          buttonOptionsArr={realButtonOptionsArr}
          size="sm"
          isEllipse
          currentValue={locationFilterType}
        />
        <Box ml={2}>
          <Select
            options={LOCATION_OPEN}
            defaultValue={location}
            setValue={setLocation}
            type="location"
            size="md"
            isThick
          />
        </Box>
      </Flex>
    </Flex>
  );
}

export default StudyMapTopNav;
