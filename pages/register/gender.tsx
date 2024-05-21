import { useSearchParams } from "next/navigation";
import { useState } from "react";
import styled from "styled-components";

import BottomNav from "../../components/layouts/BottomNav";
import ProgressHeader from "../../components/molecules/headers/ProgressHeader";
import { REGISTER_INFO } from "../../constants/keys/localStorage";
import RegisterLayout from "../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../pageTemplates/register/RegisterOverview";
import { IUserRegisterFormWriting } from "../../types/models/userTypes/userInfoTypes";
import { setLocalStorageObj } from "../../utils/storageUtils";

function Gender() {
  const searchParams = useSearchParams();
  const info: IUserRegisterFormWriting = JSON.parse(localStorage.getItem(REGISTER_INFO));

  const isProfileEdit = !!searchParams.get("edit");

  const [errorMessage, setErrorMessage] = useState("");
  const [gender, setGender] = useState(info?.gender);

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
      <ProgressHeader value={30} title={!isProfileEdit ? "회원가입" : "프로필 수정"} />

      <RegisterLayout errorMessage={errorMessage}>
        <RegisterOverview>
          <span>성별을 입력해 주세요</span>
          <span></span>
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
  color: ${(props) => (props.$isSelected ? "var(--gray-800)" : "var(--gray-500)")};
  border-radius: var(--rounded-lg);
  flex: 0.49;
  height: 48px;
  font-size: 14px;
  font-weight: ${(props) => props.$isSelected && "600"};
  border: ${(props) => (props.$isSelected ? "var(--border-thick)" : "var(--border)")};
`;

export default Gender;
