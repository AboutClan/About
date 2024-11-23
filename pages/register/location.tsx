import { Box } from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import styled from "styled-components";

import BottomNav from "../../components/layouts/BottomNav";
import ProgressHeader from "../../components/molecules/headers/ProgressHeader";
import SearchLocation from "../../components/organisms/SearchLocation";
import { REGISTER_INFO } from "../../constants/keys/localStorage";
import { useUserInfoQuery } from "../../hooks/user/queries";
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
  const [location, setLocation] = useState<Location>(info?.location);

  const [placeInfo, setPlaceInfo] = useState<KakaoLocationProps>({
    place_name: "",
    road_address_name: "",
  });

  //회원 정보 수정일 경우
  const { data: userInfo } = useUserInfoQuery({
    enabled: isProfileEdit,
    onError(err) {
      console.error(err);
    },
  });

  useEffect(() => {
    if (userInfo) {
      const { location, name, mbti, birth, gender, interests, majors, comment, telephone } =
        userInfo;
      setLocalStorageObj(REGISTER_INFO, {
        location,
        name,
        mbti,
        birth,
        gender,
        interests,
        majors,
        comment,
        telephone,
      });

      setLocation(userInfo.location);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isProfileEdit, userInfo]);

  const onClickNext = (e) => {
    if (location === null) {
      e.preventDefault();
      setErrorMessage("지역을 선택해 주세요.");
      return;
    }

    setLocalStorageObj(REGISTER_INFO, { ...info, location });
  };

  return (
    <>
      <ProgressHeader title={!isProfileEdit ? "회원가입" : "프로필 수정"} value={44} />
      <RegisterLayout errorMessage={errorMessage}>
        <RegisterOverview>
          <span>주 활동 지역을 입력해 주세요</span>
          {!isProfileEdit ? (
            <span>활동 지역 결정을 위한 것으로 대략적으로 입력해 주세요!</span>
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
              <b>{location}</b> 지역으로 분류됩니다.
            </Box>
          )}
        </Box>
      </RegisterLayout>
      <BottomNav onClick={onClickNext} url="/register/mbti" />
    </>
  );
}

const ButtonNav = styled.nav`
  margin-top: var(--gap-5);
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--gap-3);
`;

const Button = styled.button<{ $picked: string }>`
  padding: var(--gap-2) var(--gap-3);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 72px;
  position: relative;
  border-radius: var(--rounded);
  border: ${(props) => (props.$picked === "true" ? "var(--border-mint)" : "var(--border-main)")};
  background-color: white;
`;

const Message = styled.div`
  position: absolute;
  width: 100%;
  bottom: -20px;
  font-size: 10px;
  left: 50%;

  transform: translate(-50%, 0);
`;

export default RegisterLocation;
