import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import styled from "styled-components";

import BottomNav from "../../components/layouts/BottomNav";
import ProgressHeader from "../../components/molecules/headers/ProgressHeader";
import { REGISTER_INFO } from "../../constants/keys/localStorage";
import { LOCATION_ALL, LOCATION_NOT_OPEN, LOCATION_RECRUITING } from "../../constants/location";
import { useUserInfoQuery } from "../../hooks/user/queries";
import LocationBlockProfileEdit from "../../pageTemplates/register/location/LocationBlockProfileEdit";
import LocationMember from "../../pageTemplates/register/location/LocationMember";
import LocationTitle from "../../pageTemplates/register/location/LocationTitle";
import RegisterLayout from "../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../pageTemplates/register/RegisterOverview";
import { IUserRegisterFormWriting } from "../../types/models/userTypes/userInfoTypes";
import { Location } from "../../types/services/locationTypes";
import { setLocalStorageObj } from "../../utils/storageUtils";

function RegisterLocation() {
  const searchParams = useSearchParams();

  const isProfileEdit = !!searchParams.get("edit");

  const info: IUserRegisterFormWriting = JSON.parse(localStorage.getItem(REGISTER_INFO));

  const [errorMessage, setErrorMessage] = useState("");
  const [location, setLocation] = useState<Location>(info?.location);

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
      <ProgressHeader title={!isProfileEdit ? "회원가입" : "프로필 수정"} value={10} />

      <RegisterLayout errorMessage={errorMessage}>
        <RegisterOverview>
          <span>지역을 선택해 주세요</span>
          {!isProfileEdit ? (
            <span>오픈 또는 예약중인 지역만 선택할 수 있습니다.</span>
          ) : (
            <span>활동 지역 변경은 운영진을 통해서만 가능합니다.</span>
          )}
        </RegisterOverview>
        <ButtonNav>
          {LOCATION_ALL?.map((place, idx) => (
            <Button
              $picked={(location === place).toString()}
              onClick={() => setLocation(place)}
              key={place}
              disabled={isProfileEdit || LOCATION_NOT_OPEN.includes(place)}
            >
              {!isProfileEdit ? (
                <>
                  <LocationTitle location={place} />
                  {!LOCATION_NOT_OPEN.includes(place) && <LocationMember location={place} />}
                  {LOCATION_RECRUITING.includes(place) &&
                    (idx === LOCATION_ALL.length - 1 || idx === LOCATION_ALL.length - 2) && (
                      <Message>예약 인원 40명이 되면 열려요!</Message>
                    )}
                </>
              ) : (
                <LocationBlockProfileEdit location={place} />
              )}
            </Button>
          ))}
        </ButtonNav>
      </RegisterLayout>
      <BottomNav onClick={onClickNext} url="/register/name" />
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
  justify-content: space-between;
  align-items: center;
  position: relative;
  height: 68px;
  border-radius: var(--rounded-lg);
  border: ${(props) => (props.$picked === "true" ? "var(--border-thick)" : "var(--border)")};
`;

const Message = styled.div`
  position: absolute;
  width: 100%;
  bottom: -20px;
  font-size: 10px;
  left: 50%;
  color: var(--gray-700);
  transform: translate(-50%, 0);
`;

export default RegisterLocation;
