import { Box } from "@chakra-ui/react";
import { MouseEvent, useState } from "react";

import BottomNav from "../../components/layouts/BottomNav";
import ProgressHeader from "../../components/molecules/headers/ProgressHeader";
import SearchLocation from "../../components/organisms/SearchLocation";
import { REGISTER_INFO } from "../../constants/keys/localStorage";
import RegisterLayout from "../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../pageTemplates/register/RegisterOverview";
import { KakaoLocationProps } from "../../types/externals/kakaoLocationSearch";
import { DispatchType } from "../../types/hooks/reactTypes";
import { IUserRegisterFormWriting } from "../../types/models/userTypes/userInfoTypes";
import { getLocalStorageObj, setLocalStorageObj } from "../../utils/storageUtils";

function RegisterLocation() {
  const info: IUserRegisterFormWriting = getLocalStorageObj(REGISTER_INFO);

  const [errorMessage, setErrorMessage] = useState("");

  const [placeInfo, setPlaceInfo] = useState<KakaoLocationProps>({
    place_name: "",
    road_address_name: "",
  });

  const onClickNext = (e?: MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!placeInfo?.place_name) {
      e.preventDefault();
      setErrorMessage("정확한 장소를 입력해 주세요.");
      return;
    }
    const { place_name: placeName, y, x } = placeInfo;
    setLocalStorageObj(REGISTER_INFO, {
      ...info,
      location: "기타",
      locationDetail: {
        text: placeName,
        lat: +y,
        lon: +x,
      },
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
  placeInfo: KakaoLocationProps;
  setPlaceInfo: DispatchType<KakaoLocationProps>;
  errorMessage: string;
  text?: string;
  isSlide?: boolean;
}

export function RegisterLocationLayout({
  handleButton,
  url,
  placeInfo,
  setPlaceInfo,
  errorMessage,
  text,
  isSlide = true,
}: RegisterLocationLayoutProps) {
  return (
    <>
      <RegisterLayout errorMessage={errorMessage} isSlide={isSlide}>
        <RegisterOverview>
          <span>주 활동 장소를 입력해 주세요</span>
          <span>스터디 매칭을 위한 것으로, 대략적으로만 입력해 주세요!</span>
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
