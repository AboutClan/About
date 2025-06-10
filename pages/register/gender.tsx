import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import styled from "styled-components";

import BottomNav from "../../components/layouts/BottomNav";
import ProgressHeader from "../../components/molecules/headers/ProgressHeader";
import { REGISTER_INFO } from "../../constants/keys/localStorage";
import { useUserKakaoInfoQuery } from "../../hooks/user/queries";
import RegisterLayout from "../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../pageTemplates/register/RegisterOverview";
import { IUserRegisterFormWriting } from "../../types/models/userTypes/userInfoTypes";
import { getLocalStorageObj, setLocalStorageObj } from "../../utils/storageUtils";

function Gender() {
  const searchParams = useSearchParams();
  const isProfileEdit = !!searchParams.get("edit");

  const info: IUserRegisterFormWriting = getLocalStorageObj(REGISTER_INFO);

  const { data, type } = useUserKakaoInfoQuery();

  const [errorMessage, setErrorMessage] = useState("");
  const [gender, setGender] = useState<"남성" | "여성" | null>(info?.gender || null);

  useEffect(() => {
    if (info?.gender || !data) return;
    setGender(
      type === "kakao"
        ? data.gender === "male"
          ? "남성"
          : data.gender === "female"
          ? "여성"
          : null
        : (data?.gender as "남성" | "여성") || null,
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
      <ProgressHeader value={22} title={!isProfileEdit ? "회원가입" : "프로필 수정"} />

      <RegisterLayout errorMessage={errorMessage}>
        <RegisterOverview>
          <span>성별을 선택해 주세요</span>
          <span>오프라인 활동에서는 성비도 고려하고 있습니다!</span>
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
      <BottomNav onClick={onClickNext} url="/register/birthday" />
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
