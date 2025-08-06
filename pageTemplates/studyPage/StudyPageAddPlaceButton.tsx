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
        leftIcon={<MapIcon />}
        func={() => setIsPlaceMap(true)}
        mainText="About 카공 지도"
        subText="공부하기 좋은 카공 스팟을 지도에서 한 눈에!"
      />
      <Box h={5} />
      <IconRowBlock
        leftIcon={<AddLocationIcon />}
        func={() => router.push("/study/writing/place")}
        mainText="신규 스터디 장소 추가"
        subText="공부하기 좋은 카공 스팟을 함께 공유해요!"
      />
    </>
  );
}

function MapIcon() {
  return <svg
    xmlns="http://www.w3.org/2000/svg"
    height="20px"
    viewBox="0 -960 960 960"
    width="20px"
    fill="var(--gray-800)"
  >
    <path d="M640-240q34 0 56.5-20t23.5-60q1-34-22.5-57T640-400q-34 0-57 23t-23 57q0 34 23 57t57 23Zm0 80q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 23-5.5 43.5T778-238l74 74q11 11 11 28t-11 28q-11 11-28 11t-28-11l-74-74q-18 11-38.5 16.5T640-160Zm-466 28q-20 8-37-4.5T120-170v-560q0-13 7.5-23t20.5-15l186-63q13-5 26-5t26 5l214 75 186-72q20-8 37 4.5t17 33.5v270q0 17-16 23t-29-6q-33-28-72.5-42.5T640-560h-17q-9 0-17 2-18 2-32-8.5T560-594v-92l-160-56v481q0 19-10.5 34T362-205l-188 73Z" />
  </svg>
}

function AddLocationIcon() {
  return <svg
    xmlns="http://www.w3.org/2000/svg"
    height="20px"
    viewBox="0 -960 960 960"
    width="20px"
    fill="var(--gray-800)"
  >
    <path d="M440-520v80q0 17 11.5 28.5T480-400q17 0 28.5-11.5T520-440v-80h80q17 0 28.5-11.5T640-560q0-17-11.5-28.5T600-600h-80v-80q0-17-11.5-28.5T480-720q-17 0-28.5 11.5T440-680v80h-80q-17 0-28.5 11.5T320-560q0 17 11.5 28.5T360-520h80Zm40 413q-14 0-28-5t-25-15q-65-60-115-117t-83.5-110.5q-33.5-53.5-51-103T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 45-17.5 94.5t-51 103Q698-301 648-244T533-127q-11 10-25 15t-28 5Z" />
  </svg>
}

export default StudyPageAddPlaceButton;
