import { useState } from "react";
import styled from "styled-components";

import BottomNav from "../../components/layouts/BottomNav";
import ProgressHeader from "../../components/molecules/headers/ProgressHeader";
import { MBTI } from "../../constants/contentsText/ProfileData";
import { REGISTER_INFO } from "../../constants/keys/localStorage";
import RegisterLayout from "../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../pageTemplates/register/RegisterOverview";
import { DispatchString } from "../../types/hooks/reactTypes";
import { IUserRegisterFormWriting } from "../../types/models/userTypes/userInfoTypes";
import { getLocalStorageObj, setLocalStorageObj } from "../../utils/storageUtils";

function Mbti() {
  const info: IUserRegisterFormWriting = getLocalStorageObj(REGISTER_INFO);

  const [errorMessage, setErrorMessage] = useState("");

  const [mbti, setMbti] = useState(info?.mbti);

  const onClickNext = (e) => {
    if (!mbti) {
      e.preventDefault();
      setErrorMessage("항목을 선택해 주세요.");
      return;
    }
    setLocalStorageObj(REGISTER_INFO, { ...info, mbti });
  };

  return (
    <>
      <ProgressHeader title="회원가입 " value={50} />
      <MBTILayout mbti={mbti} setMbti={setMbti} errorMessage={errorMessage} />

      <BottomNav onClick={onClickNext} url="/register/major" />
    </>
  );
}

export function MBTILayout({
  mbti,
  setMbti,
  errorMessage,
}: {
  mbti: string;
  setMbti: DispatchString;
  errorMessage: string;
}) {
  return (
    <RegisterLayout errorMessage={errorMessage}>
      <RegisterOverview>
        <span>MBTI를 선택해 주세요</span>
        <span>필수사항은 아니지만, 오프라인 활동에 도움이 돼요!</span>
      </RegisterOverview>
      <ButtonNav>
        {MBTI?.map((item, idx) => (
          <Button key={idx} $isSelected={mbti === item} onClick={() => setMbti(item)}>
            {item}
          </Button>
        ))}
      </ButtonNav>
    </RegisterLayout>
  );
}

const ButtonNav = styled.nav`
  margin-top: 40px;
  margin-bottom: var(--gap-2);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--gap-2);
`;

const Button = styled.button<{ $isSelected: boolean }>`
  color: ${(props) => (props.$isSelected ? "var(--gray-800)" : "var(--gray-500)")};
  border-radius: 4px;
  flex: 0.49;
  height: 48px;
  font-size: 14px;
  font-weight: ${(props) => props.$isSelected && "600"};
  border: ${(props) => (props.$isSelected ? "var(--border-mint)" : "var(--border-main)")};
  background-color: white;
`;

export default Mbti;
