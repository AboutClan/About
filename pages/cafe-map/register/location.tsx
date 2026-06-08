import { Box, Flex, Switch } from "@chakra-ui/react";
import { MouseEvent, useState } from "react";

import BottomNav from "../../../components/layouts/BottomNav";
import ProgressHeader from "../../../components/molecules/headers/ProgressHeader";
import SearchLocation from "../../../components/organisms/SearchLocation";
import { REGISTER_INFO } from "../../../constants/keys/localStorage";
import RegisterLayout from "../../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../../pageTemplates/register/RegisterOverview";
import { LocationProps } from "../../../types/common";
import { DispatchBoolean, DispatchType } from "../../../types/hooks/reactTypes";
import { IUserRegisterFormWriting } from "../../../types/models/userTypes/userInfoTypes";
import { getLocalStorageObj, setLocalStorageObj } from "../../../utils/storageUtils";

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
      <ProgressHeader title="회원가입" value={75} />
      <RegisterLocationLayout
        handleButton={onClickNext}
        url="/cafe-map/register/comment"
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
  return (
    <>
      <RegisterLayout errorMessage={errorMessage} isSlide={isSlide}>
        <RegisterOverview>
          <>
            <span>주 활동 장소를 입력해 주세요</span>
            <span>카공 장소 추천을 위한 것으로, 상세 지역은 공개되지 않아요!</span>
          </>
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
      <BottomNav
        isLoading={isLoading}
        onClick={handleButton}
        url={url}
        text={text}
        isSlide={isSlide}
      />
    </>
  );
}

export default RegisterLocation;
