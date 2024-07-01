import { useSearchParams } from "next/navigation";
import { ChangeEvent, useState } from "react";
import styled from "styled-components";

import { Input } from "../../components/atoms/Input";
import BottomNav from "../../components/layouts/BottomNav";
import ProgressHeader from "../../components/molecules/headers/ProgressHeader";
import { INTEREST_DATA } from "../../constants/contentsText/ProfileData";
import { REGISTER_INFO } from "../../constants/keys/localStorage";
import RegisterLayout from "../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../pageTemplates/register/RegisterOverview";
import { getLocalStorageObj, setLocalStorageObj } from "../../utils/storageUtils";

function Interest() {
  const searchParams = useSearchParams();
  const info = getLocalStorageObj(REGISTER_INFO);

  const [errorMessage, setErrorMessage] = useState("");

  const [firstValue, setFirstValue] = useState(info?.interests?.first || "");
  const [secondValue, setSecondValue] = useState(info?.interests?.second || "");

  const isProfileEdit = !!searchParams.get("edit");

  const onChange = (event: ChangeEvent<HTMLInputElement>, isFirst) => {
    const value = event?.target.value;
    if (isFirst) setFirstValue(value);
    else setSecondValue(value);
  };
  const onClickNext = (e) => {
    if (firstValue === "") {
      e.preventDefault();
      setErrorMessage("관심사를 작성해 주세요.");
      return;
    }

    setLocalStorageObj(REGISTER_INFO, {
      ...info,
      interests: { first: firstValue, second: secondValue },
    });
  };

  return (
    <>
      <ProgressHeader value={70} title={!isProfileEdit ? "회원가입" : "프로필 수정"} />

      <RegisterLayout errorMessage={errorMessage}>
        <RegisterOverview>
          <span>관심 분야를 선택해 주세요</span>
          <span>스터디에서 하고자 하는 관심 분야를 작성해 주세요.</span>
        </RegisterOverview>
        <Container>
          <Example>
            <span>예시</span>
            <div>{INTEREST_DATA?.map((item, idx) => <span key={idx}>{item}</span>)}</div>
          </Example>
          <Item>
            <span>첫번째 관심사</span>
            <Input placeholder="1번 입력" value={firstValue} onChange={(e) => onChange(e, true)} />
          </Item>
          <Item>
            <span>두번째 관심사 (선택)</span>
            <Input
              placeholder="2번 입력"
              value={secondValue}
              onChange={(e) => onChange(e, false)}
            />
          </Item>
        </Container>
      </RegisterLayout>
      <BottomNav onClick={onClickNext} url="/register/comment" />
    </>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  > div {
    margin-bottom: var(--gap-5);
    > span {
      display: inline-block;
      color: var(--gray-800);

      font-size: 14px;
      margin-bottom: var(--gap-2);
    }
  }
`;

const Example = styled.div`
  margin-top: var(--gap-4);

  > div {
    color: var(--gray-600);
    padding: 4px 8px;
    background-color: var(--gray-100);
    border: var(--border-main);
    border-radius: var(--rounded-lg);
    display: flex;
    flex-wrap: wrap;

    > span {
      font-size: 12px;
      margin-right: 6px;
    }
  }
`;

const Item = styled.div`
  display: flex;
  flex-direction: column;
`;

// const Input = styled.input`
//   padding: var(--gap-3) var(--gap-2);
//   border: 1px solid var(--gray-300);
//   background-color: var(--gray-200);
//   border-radius: var(--rounded-lg);
//   ::placeholder {
//     color: var(--gray-500);
//   }
//   :focus {
//     outline-color: var(--gray-800);
//   }
// `;

export default Interest;
