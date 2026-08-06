import { useEffect, useState } from "react";
import styled from "styled-components";

import BottomNav from "../../../components/layouts/BottomNav";
import ProgressHeader from "../../../components/molecules/headers/ProgressHeader";
import { REGISTER_INFO } from "../../../constants/keys/localStorage";
import { useUserKakaoInfoQuery } from "../../../hooks/user/queries";
import RegisterLayout from "../../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../../pageTemplates/register/RegisterOverview";
import { IUserRegisterFormWriting } from "../../../types/models/userTypes/userInfoTypes";
import { getLocalStorageObj, setLocalStorageObj } from "../../../utils/storageUtils";

function Gender() {
  const info: IUserRegisterFormWriting = getLocalStorageObj(REGISTER_INFO);

  const { data, type } = useUserKakaoInfoQuery();

  const [errorMessage, setErrorMessage] = useState("");
  const [gender, setGender] = useState<"남성" | "여성" | null>(info?.gender || null);

  useEffect(() => {
    if (info?.gender || !data) return;
    // 카카오든 유저 DB 문서든 gender가 "male"/"female"(영문)로 내려올 수 있어, 두 경우 모두
    // 같은 방식으로 한글 라벨에 매핑한다. type별로 분기해 매핑을 다르게 하면(카카오만 매핑),
    // 유저 문서 쪽 값이 "male"/"female" 그대로 남아 버튼의 "남성"/"여성" 문자열과 일치하지
    // 않는다 — 값 자체는 참(truthy)이라 다음 버튼은 통과되지만, 두 버튼 다 선택 표시가 안
    // 되는 것처럼 보이는 버그가 생긴다.
    const rawGender = type === "kakao" ? data.gender : (data as { gender?: string })?.gender;
    setGender(
      rawGender === "male"
        ? "남성"
        : rawGender === "female"
        ? "여성"
        : (rawGender as "남성" | "여성") || null,
    );
  }, [data, type]);

  const onClickNext = (e) => {
    if (!gender) {
      setErrorMessage("성별을 선택해 주세요.");
      e.preventDefault();
      return;
    }
    setLocalStorageObj(REGISTER_INFO, { ...info, gender });
  };

  return (
    <>
      <ProgressHeader value={67} title="회원가입" />

      <RegisterLayout errorMessage={errorMessage}>
        <RegisterOverview>
          <span>성별을 선택해 주세요</span>
        </RegisterOverview>
        <ButtonNav>
          <Button $isSelected={gender === "남성"} onClick={() => setGender("남성")}>
            남성
          </Button>
          <Button $isSelected={gender === "여성"} onClick={() => setGender("여성")}>
            여성
          </Button>
        </ButtonNav>
      </RegisterLayout>
      <BottomNav onClick={onClickNext} url="/cafe-map/register/location" />
    </>
  );
}

const ButtonNav = styled.nav`
  margin-top: 40px;
  display: flex;
  justify-content: space-between;
`;

const Button = styled.button<{ $isSelected: boolean }>`
  color: ${(props) => (props.$isSelected ? "var(--gray-800)" : "var(--gray-600)")};
  border-radius: 4px;
  flex: 0.49;
  height: 48px;
  font-size: 14px;
  font-weight: ${(props) => props.$isSelected && "600"};
  border: ${(props) => (props.$isSelected ? "var(--border-mint)" : "var(--border-main)")};
  background-color: white;
`;

export default Gender;
