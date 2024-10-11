import { Flex } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import CurrentLocationBtn from "../../components/atoms/CurrentLocationBtn";
import ButtonGroups, { ButtonOptionsProps } from "../../components/molecules/groups/ButtonGroups";
import { myRealStudyInfoState, myStudyInfoState } from "../../recoils/studyRecoils";

type LocationFilterType = "현재 위치" | "주 활동 장소" | "내 투표 장소";

const FILTER_TYPE_ARR = ["현재 위치", "주 활동 장소", "내 투표 장소"] as LocationFilterType[];

const FILTER_TO_PARAM: Record<LocationFilterType, string> = {
  "현재 위치": "currentPlace",
  "주 활동 장소": "mainPlace",
  "내 투표 장소": "votePlace",
};

interface StudyMapTopNavProps {}

function StudyMapTopNav({}: StudyMapTopNavProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);

  const [locationFilterType, setLocationFilterType] = useState<LocationFilterType>("현재 위치");
  const myStudy = useRecoilValue(myStudyInfoState);
  const myRealStudy = useRecoilValue(myRealStudyInfoState);

  const handleNavButton = (type: LocationFilterType) => {
    //  if (type==="주 활동 장소"&& !mainLocation) {
    //    toast("warning", "등록된 활동 장소가 없습니다.");
    //    return;
    //       }
    //       if (type === "내 투표 장소" &&) {
    //             if (!myStudy && !myRealStudy) {
    //           toast("warning", "참여중인 장소가 없습니다.");
    //           return;
    //         }
    //       }
    //     setLocationFilterType(type);
    //     newSearchParams.set("category", FILTER_TO_PARAM[type]);
    //     router.replace(`/vote?${newSearchParams.toString()}`);
    //     };
  };
  const realButtonOptionsArr: ButtonOptionsProps[] = FILTER_TYPE_ARR.map((type) => ({
    text: type,
    func: () => handleNavButton(type),
  }));

  return (
    <Flex
      w="100%"
      justify="space-between"
      py={3}
      px={5}
      position="absolute"
      top="0"
      left="0"
      zIndex={10}
    >
      <CurrentLocationBtn onClick={() => setLocationFilterType("현재 위치")} />
      <ButtonGroups
        buttonOptionsArr={realButtonOptionsArr}
        size="sm"
        isEllipse
        currentValue={locationFilterType}
      />
    </Flex>
  );
}

export default StudyMapTopNav;
