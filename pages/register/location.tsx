import { Box } from "@chakra-ui/react";
import { MouseEvent, useState } from "react";

import BottomNav from "../../components/layouts/BottomNav";
import ProgressHeader from "../../components/molecules/headers/ProgressHeader";
import SearchLocation from "../../components/organisms/SearchLocation";
import { REGISTER_INFO } from "../../constants/keys/localStorage";
import RegisterLayout from "../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../pageTemplates/register/RegisterOverview";
import { LocationProps } from "../../types/common";
import { DispatchType } from "../../types/hooks/reactTypes";
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
      <ProgressHeader title="회원가입" value={40} />
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
}: RegisterLocationLayoutProps) {
  return (
    <>
      <RegisterLayout errorMessage={errorMessage} isSlide={isSlide}>
        <RegisterOverview>
          {type === "location" ? (
            <>
              <span>주 활동 장소를 입력해 주세요</span>
              <span>모임 추천과 매칭을 위한 것으로, 상세 지역은 공개되지 않아요!</span>
            </>
          ) : (
            <>
              <span>스터디 기준 위치를 입력해 주세요</span>
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
      </RegisterLayout>
      <BottomNav onClick={handleButton} url={url} text={text} isSlide={isSlide} />
    </>
  );
}

export default RegisterLocation;
