import { useState } from "react";

import Textarea from "../../components/atoms/Textarea";
import BottomNav from "../../components/layouts/BottomNav";
import RightDrawer from "../../components/organisms/drawer/RightDrawer";
import SearchLocation from "../../components/organisms/SearchLocation";
import { useToast } from "../../hooks/custom/CustomToast";
import { useStudyAdditionMutation } from "../../hooks/study/mutations";
import { LocationProps } from "../../types/common";
import RegisterOverview from "../register/RegisterOverview";

interface LocationAddDrawerProps {
  onClose: () => void;
}

export function LocationAddDrawer({ onClose }: LocationAddDrawerProps) {
  const toast = useToast();

  const [isFirstPage, setIsFirstPage] = useState(true);

  const [placeInfo, setPlaceInfo] = useState<LocationProps>({
    name: "",
    address: "",
    latitude: null,
    longitude: null,
  });
  const [content, setContent] = useState("");

  const { mutate, isLoading } = useStudyAdditionMutation({
    onSuccess() {
      toast("success", "요청이 완료되었어요! 운영진의 검토 후 등록됩니다.");
      onClose();
    },
  });

  const onClickNext = () => {
    if ([placeInfo?.name, placeInfo?.address].some((field) => !field)) {
      toast("warning", "장소를 입력해주세요.");
      return;
    }
    if (isFirstPage) {
      setIsFirstPage(false);
    } else {
      const { latitude, longitude, address, name } = placeInfo;
      mutate({
        location: { name, latitude, longitude, address },
        status: "inactive",
      });
    }
  };

  const handleBack = () => {
    if (isFirstPage) onClose();
    else setIsFirstPage(true);
  };

  return (
    <RightDrawer title="장소 추가" onClose={handleBack}>
      <RegisterOverview>
        {isFirstPage ? (
          <>
            <span>추가하고 싶은 장소를 입력해주세요</span>
            <span>입력하신 장소는 관리자의 검토 후 바로 추가됩니다.</span>
          </>
        ) : (
          <>
            <span>장소에 대한 코멘트를 적어주세요</span>
            <span>추천 이유나 카페에 대한 설명을 남겨주시면 좋아요!</span>
          </>
        )}
      </RegisterOverview>
      {isFirstPage ? (
        <SearchLocation
          placeHolder="ex) 사당역 투썸플레이스"
          placeInfo={placeInfo}
          setPlaceInfo={setPlaceInfo}
        />
      ) : (
        <Textarea
          placeholder="ex) 의자가 편하고 자리마다 콘센트가 있어요! 인기가 많아 주말에는 자리가 없을 수도 있습니다."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          minHeight={200}
        />
      )}
      <BottomNav
        onClick={() => onClickNext()}
        text={isFirstPage ? "다 음" : "완 료"}
        isLoading={isLoading}
        isSlide={false}
      />
    </RightDrawer>
  );
}
