import { Box } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

import IconRowBlock from "../../components/atoms/blocks/IconRowBlock";
import { DispatchBoolean } from "../../types/hooks/reactTypes";

interface StudyPageAddPlaceButtonProps {
  setIsPlaceMap: DispatchBoolean;
}

function StudyPageAddPlaceButton({ setIsPlaceMap }: StudyPageAddPlaceButtonProps) {
  const router = useRouter();
  return (
    <>
      <IconRowBlock
        leftIcon={
          <i
            className="fa-solid fa-map-location-dot fa-xl"
            style={{ color: "var(--color-mint)" }}
          ></i>
        }
        func={() => setIsPlaceMap(true)}
        mainText="About 카공 지도"
        subText="공부하기 좋은 카공 스팟을 지도에서 한 눈에!"
      />
      <Box h={5} />
      <IconRowBlock
        leftIcon={
          <i
            className="fa-solid fa-magnifying-glass-plus fa-xl"
            style={{ color: "var(--color-mint)" }}
          />
        }
        func={() => router.push("/study/writing/place")}
        mainText="신규 스터디 장소 추가"
        subText="공부하기 좋은 카공 스팟을 함께 공유해요!"
      />
    </>
  );
}

export default StudyPageAddPlaceButton;
