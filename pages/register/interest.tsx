import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import BottomNav from "../../components/layout/BottomNav";
import Header from "../../components/layout/Header";
import ProgressStatus from "../../components/templates/ProgressStatus";
import RegisterLayout from "../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../pageTemplates/register/RegisterOverview";

import PageSlide from "../../components/layout/PageSlide";
import { INTEREST_DATA } from "../../constants/contents/ProfileData";
import { REGISTER_INFO } from "../../constants/keys/localStorage";
import {
  getLocalStorageObj,
  setLocalStorageObj,
} from "../../helpers/storageHelpers";
import { isProfileEditState } from "../../recoil/previousAtoms";

function Interest() {
  const router = useRouter();

  const info = getLocalStorageObj(REGISTER_INFO);

  const [errorMessage, setErrorMessage] = useState("");

  const [firstValue, setFirstValue] = useState(info?.interests?.first || "");
  const [secondValue, setSecondValue] = useState(info?.interests?.second || "");

  const isProfileEdit = useRecoilValue(isProfileEditState);

  const onChange = (event: ChangeEvent<HTMLInputElement>, isFirst) => {
    const value = event?.target.value;
    if (isFirst) setFirstValue(value);
    else setSecondValue(value);
  };
  const onClickNext = () => {
    if (firstValue === "") {
      setErrorMessage("관심사를 작성해 주세요.");
      return;
    }

    setLocalStorageObj(REGISTER_INFO, {
      ...info,
      interests: { first: firstValue, second: secondValue },
    });
    router.push(`/register/comment`);
  };

  return (
    <PageSlide>
      <ProgressStatus value={70} />
      <Header
        title={!isProfileEdit ? "회원가입" : "프로필 수정"}
        url="/register/major"
      />
      <RegisterLayout errorMessage={errorMessage}>
        <RegisterOverview>
          <span>관심 분야를 선택해 주세요</span>
          <span>스터디에서 하고자 하는 관심 분야를 작성해 주세요.</span>
        </RegisterOverview>
        <Container>
          <Example>
            <span>예시</span>
            <div>
              {INTEREST_DATA?.map((item, idx) => (
                <span key={idx}>{item}</span>
              ))}
            </div>
          </Example>
          <Item>
            <span>첫번째 관심사</span>
            <Input
              placeholder="1번 입력"
              value={firstValue}
              onChange={(e) => onChange(e, true)}
            />
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
      <BottomNav onClick={onClickNext} />
    </PageSlide>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  > div {
    margin-bottom: var(--gap-5);
    > span {
      display: inline-block;
      color: var(--gray-1);
      font-weight: 600;
      font-size: 12px;
      margin-bottom: var(--gap-2);
    }
  }
`;

const Example = styled.div`
  margin-top: var(--gap-4);

  > div {
    color: var(--gray-3);
    padding: var(--gap-1);
    background-color: var(--gray-7);
    border: 1px solid var(--gray-6);
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

const Input = styled.input`
  padding: var(--gap-3) var(--gap-2);
  border: 1px solid var(--gray-6);
  background-color: var(--gray-7);
  border-radius: var(--rounded-lg);
  ::placeholder {
    color: var(--gray-4);
  }
  :focus {
    outline-color: var(--gray-1);
  }
`;

export default Interest;
