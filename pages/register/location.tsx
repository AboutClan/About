import { Box } from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";
import { MouseEvent, useEffect, useState } from "react";

import BottomNav from "../../components/layouts/BottomNav";
import ProgressHeader from "../../components/molecules/headers/ProgressHeader";
import SearchLocation from "../../components/organisms/SearchLocation";
import { REGISTER_INFO } from "../../constants/keys/localStorage";
import { getLocationByCoordinates } from "../../libs/study/getLocationByCoordinates";
import RegisterLayout from "../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../pageTemplates/register/RegisterOverview";
import { KakaoLocationProps } from "../../types/externals/kakaoLocationSearch";
import { DispatchType } from "../../types/hooks/reactTypes";
import { IUserRegisterFormWriting } from "../../types/models/userTypes/userInfoTypes";
import { Location } from "../../types/services/locationTypes";
import { setLocalStorageObj } from "../../utils/storageUtils";

function RegisterLocation() {
  const searchParams = useSearchParams();

  const isProfileEdit = !!searchParams.get("edit");

  const info: IUserRegisterFormWriting = JSON.parse(localStorage.getItem(REGISTER_INFO));

  const [errorMessage, setErrorMessage] = useState("");
  const [location, setLocation] = useState<Location | "기타">(info?.location);

  const [placeInfo, setPlaceInfo] = useState<KakaoLocationProps>({
    place_name: "",
    road_address_name: "",
  });

  useEffect(() => {
    if (!placeInfo?.place_name) {
      setLocation(null);
      return;
    }
    const getLocation = getLocationByCoordinates(+placeInfo.y, +placeInfo.x);
    setLocation((getLocation as Location) || "기타");
  }, [placeInfo]);

  const onClickNext = (e?: MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!placeInfo?.place_name) {
      e.preventDefault();
      setErrorMessage("정확한 장소를 입력해 주세요.");
      return;
    }
    const { place_name: placeName, y, x } = placeInfo;
    setLocalStorageObj(REGISTER_INFO, {
      ...info,
      location,
      locationDetail: {
        text: placeName,
        lat: +y,
        lon: +x,
      },
    });
  };

  return (
    <>
      <ProgressHeader title={!isProfileEdit ? "회원가입" : "프로필 수정"} value={44} />
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
}

export function RegisterLocationLayout({
  handleButton,
  url,
  placeInfo,
  setPlaceInfo,
  errorMessage,
  text,
}: RegisterLocationLayoutProps) {
  return (
    <>
      <RegisterLayout errorMessage={errorMessage}>
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
      <BottomNav onClick={handleButton} url={url} text={text} />
    </>
  );
}

export default RegisterLocation;
