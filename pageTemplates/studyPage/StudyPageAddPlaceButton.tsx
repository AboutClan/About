import { useRouter } from "next/navigation";

import IconRowBlock from "../../components/atoms/blocks/IconRowBlock";

function StudyPageAddPlaceButton() {
  const router = useRouter();
  return (
    <IconRowBlock
      leftIcon={
        <i
          className="fa-duotone fa-magnifying-glass-plus fa-2x"
          style={{ color: "var(--color-mint)" }}
        />
      }
      func={() => router.push("/study/writing/place")}
      mainText="신규 스터디 장소 추가"
      subText="공부하기 좋은 카공 스팟을 함께 공유해요!"
    />
  );
}

export default StudyPageAddPlaceButton;
