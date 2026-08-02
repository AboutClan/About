import { Box, Flex, Switch } from "@chakra-ui/react";
import { MouseEvent, useState } from "react";

import BottomNav from "../../components/layouts/BottomNav";
import ProgressHeader from "../../components/molecules/headers/ProgressHeader";
import SearchLocation from "../../components/organisms/SearchLocation";
import { REGISTER_INFO } from "../../constants/keys/localStorage";
import RegisterLayout from "../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../pageTemplates/register/RegisterOverview";
import { LocationProps } from "../../types/common";
import { DispatchBoolean, DispatchType } from "../../types/hooks/reactTypes";
import { IUserRegisterFormWriting } from "../../types/models/userTypes/userInfoTypes";
import { getLocalStorageObj, setLocalStorageObj } from "../../utils/storageUtils";

function RegisterLocation() {
  const info: IUserRegisterFormWriting = getLocalStorageObj(REGISTER_INFO);

  const [errorMessage, setErrorMessage] = useState("");

  const [placeInfo, setPlaceInfo] = useState<LocationProps>({
    name: "",
    address: "",
    latitude: null,
    longitude: null,
  });

  const onClickNext = (e?: MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!placeInfo?.name) {
      e.preventDefault();
      setErrorMessage("정확한 장소를 입력해 주세요.");
      return;
    }

    setLocalStorageObj(REGISTER_INFO, {
      ...info,
      locationDetail: placeInfo,
    });
  };

  return (
    <>
      <ProgressHeader title="회원가입" value={58} />
      <RegisterLocationLayout
        handleButton={onClickNext}
        url="/register/mbti"
        placeInfo={placeInfo}
        setPlaceInfo={setPlaceInfo}
        errorMessage={errorMessage}
      />
    </>
  );
}

interface RegisterLocationLayoutProps {
  handleButton: () => void;
  url?: string;
  placeInfo: LocationProps;
  setPlaceInfo: DispatchType<LocationProps>;
  errorMessage: string;
  text?: string;
  isSlide?: boolean;
  type?: "location" | "study";
  isLoading?: boolean;
  isChangeLocation?: boolean | null;
  setIsChangeLocation?: DispatchBoolean;
}

export function RegisterLocationLayout({
  handleButton,
  url,
  placeInfo,
  setPlaceInfo,
  errorMessage,
  text,
  isSlide = true,
  type = "location",
  isLoading,
  isChangeLocation = null,
  setIsChangeLocation = null,
}: RegisterLocationLayoutProps) {
  const content = (
    <RegisterLayout errorMessage={errorMessage} isSlide={isSlide}>
      <RegisterOverview>
        {type === "location" ? (
          <>
            <span>주 활동 장소를 입력해 주세요</span>
            <span>모임 추천과 매칭을 위한 것으로, 상세 지역은 공개되지 않아요!</span>
          </>
        ) : (
          <>
            <span>스터디 기준 위치 입력</span>
            <span>해당 위치를 중심으로 가까운 스터디가 자동으로 매칭됩니다.</span>
          </>
        )}
      </RegisterOverview>
      <Box>
        <SearchLocation
          placeInfo={placeInfo}
          setPlaceInfo={setPlaceInfo}
          hasDetail={false}
          placeHolder="ex) 강남역, 홍대입구역 등"
        />
      </Box>
      {isChangeLocation !== null && (
        <Flex mt={2} align="center">
          <Box ml="auto" mr={2} fontSize="10px" color="gray.500">
            고정 스터디 기본 위치도 함께 변경
          </Box>
          <Switch
            size="sm"
            mr="var(--gap-1)"
            colorScheme="mint"
            isChecked={isChangeLocation}
            onChange={() => setIsChangeLocation((old) => !old)}
            sx={{
              "& input:focus + span": {
                boxShadow: "none !important",
                outline: "none !important",
              },
            }}
          />
        </Flex>
      )}
    </RegisterLayout>
  );

  // isSlide=false 일 때는 RightDrawer 등 임베드 컨테이너 안에서 쓰이는데,
  // BottomNav(isSlide=false)는 fixed 포지션이 아니라 부모 flex 흐름에 맡겨 하단에 붙기 때문에
  // 여기서 직접 높이를 채우는 flex 컬럼으로 감싸주지 않으면 버튼이 콘텐츠 바로 아래에 끼어버린다.
  if (!isSlide) {
    return (
      <Flex direction="column" h="calc(100dvh - var(--header-h))" overflow="hidden">
        <Box flex={1} overflowY="auto">
          {content}
        </Box>
        <BottomNav isLoading={isLoading} onClick={handleButton} url={url} text={text} isSlide={false} />
      </Flex>
    );
  }

  return (
    <>
      {content}
      <BottomNav isLoading={isLoading} onClick={handleButton} url={url} text={text} isSlide />
    </>
  );
}

export default RegisterLocation;
