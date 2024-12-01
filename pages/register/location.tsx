import { Box } from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import BottomNav from "../../components/layouts/BottomNav";
import ProgressHeader from "../../components/molecules/headers/ProgressHeader";
import SearchLocation from "../../components/organisms/SearchLocation";
import { REGISTER_INFO } from "../../constants/keys/localStorage";
import { LOCATION_TO_FULLNAME } from "../../constants/location";
import { getLocationByCoordinates } from "../../libs/study/getLocationByCoordinates";
import RegisterLayout from "../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../pageTemplates/register/RegisterOverview";
import { KakaoLocationProps } from "../../types/externals/kakaoLocationSearch";
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

  const onClickNext = (e) => {
    if (location === null) {
      e.preventDefault();
      setErrorMessage("지역을 선택해 주세요.");
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
      <RegisterLayout errorMessage={errorMessage}>
        <RegisterOverview>
          <span>주 활동 지역을 입력해 주세요</span>
          {!isProfileEdit ? (
            <span>
              활동 지역 결정을 위한 것으로 대략적으로 입력해 주세요. 이후에도 언제든 변경이
              가능합니다!
            </span>
          ) : (
            <span>활동 지역 변경은 운영진을 통해서만 가능합니다.</span>
          )}
        </RegisterOverview>
        <Box>
          <SearchLocation
            placeInfo={placeInfo}
            setPlaceInfo={setPlaceInfo}
            hasDetail={false}
            placeHolder="ex) 당산역, 용산구, 사당동 등"
          />
          {location && (
            <Box ml="auto" w="max-content" mt={4} fontSize="12px" color="gray.600">
              <b>{LOCATION_TO_FULLNAME[location] || "기타"}</b> 지역으로 분류됩니다.
            </Box>
          )}
        </Box>
      </RegisterLayout>
      <BottomNav onClick={onClickNext} url="/register/mbti" />
    </>
  );
}

export default RegisterLocation;
