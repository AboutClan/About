import { Box, Button } from "@chakra-ui/react";
import { useState } from "react";

import { Input } from "../../components/atoms/Input";
import RightDrawer from "../../components/organisms/drawer/RightDrawer";
import SearchLocation from "../../components/organisms/SearchLocation";
import { useToast } from "../../hooks/custom/CustomToast";
import { useStudyAdditionMutation } from "../../hooks/study/mutations";
import { LocationProps } from "../../types/common";
import { StudyPlaceProps } from "../../types/models/studyTypes/study-entity.types";
import { getSafeAreaBottom } from "../../utils/validationUtils";
import RegisterOverview from "../register/RegisterOverview";

interface LocationAddDrawerProps {
  placeArr?: StudyPlaceProps[];
  onClose: () => void;
}

export function LocationAddDrawer({ onClose, placeArr }: LocationAddDrawerProps) {
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
      toast("success", "요청 완료! 운영진 검토 후 등록됩니다.");
      onClose();
    },
  });

  const onClickNext = () => {
    if ([placeInfo?.name, placeInfo?.address].some((field) => !field)) {
      toast("warning", "장소를 입력해주세요.");
      return;
    }
    if (isFirstPage) {
      {
        if (placeArr.some((p) => p.location.name === placeInfo.name)) {
          toast("info", "이미 등록된 장소입니다.");
          return;
        }
      }
      setIsFirstPage(false);
    } else {
      if (content.length < 1 || content.length > 5) {
        toast("info", "글자 수를 확인해 주세요!");
        return;
      }
      const { latitude, longitude, address, name } = placeInfo;
      mutate({
        location: { name, latitude, longitude, address },
        status: "inactive",
        name: content,
      });
    }
  };

  const handleBack = () => {
    if (isFirstPage) onClose();
    else setIsFirstPage(true);
  };

  return (
    <RightDrawer title="장소 추가" onClose={handleBack} px={false}>
      <Box
        display="flex"
        flexDir="column"
        height="calc(100dvh - var(--header-h))"
        overflow="hidden"
      >
        <Box flex={1} px={5} pb={1} overflowY="auto">
          <RegisterOverview>
            {isFirstPage ? (
              <>
                <span>추가하고 싶은 장소를 입력해주세요</span>
                <span>입력하신 장소는 관리자의 검토 후 바로 추가됩니다.</span>
              </>
            ) : (
              <>
                <span>등록할 닉네임을 입력해 주세요</span>
                <span>작성한 닉네임은 카페 소개 상단에 배지로 표시돼요.</span>
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
            <Input
              placeholder="다섯 글자 이내로 입력해 주세요."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          )}
        </Box>
        <Box px={5} pt={3} pb={getSafeAreaBottom(8)}>
          <Button
            w="full"
            size="lg"
            borderRadius="12px"
            backgroundColor="var(--color-mint)"
            color="white"
            fontSize="14px"
            isLoading={isLoading}
            fontWeight={700}
            onClick={() => onClickNext()}
            _focus={{ backgroundColor: "var(--color-mint)", color: "white" }}
          >
            {isFirstPage ? "다 음" : "완 료"}
          </Button>
        </Box>
      </Box>
    </RightDrawer>
  );
}
