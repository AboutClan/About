import { useRouter } from "next/router";
import { useState } from "react";
import styled from "styled-components";

import BottomNav from "../../../components/layouts/BottomNav";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import ProgressStatus from "../../../components/molecules/ProgressStatus";
import { GROUP_WRITING_STORE } from "../../../constants/keys/localStorage";
import { useFailToast } from "../../../hooks/custom/CustomToast";
import RegisterLayout from "../../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../../pageTemplates/register/RegisterOverview";
import { IGroupWriting } from "../../../types/models/groupTypes/group";
import { setLocalStorageObj } from "../../../utils/storageUtils";

function GroupWritingContent() {
  const router = useRouter();
  const failToast = useFailToast();

  const groupWriting: IGroupWriting = JSON.parse(localStorage.getItem(GROUP_WRITING_STORE));

  const [content, setContent] = useState(groupWriting?.content || "");
  const [rules, setRules] = useState<string[]>(
    groupWriting?.rules?.length ? groupWriting?.rules : [""],
  );

  const onClickNext = () => {
    if (!content) {
      failToast("free", "내용을 작성해 주세요!");
      return;
    }
    setLocalStorageObj(GROUP_WRITING_STORE, {
      ...groupWriting,
      rules: rules[0] === "" ? [] : rules,
      content,
    });
    router.push({ pathname: `/group/writing/period`, query: router.query });
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const value = e.target.value;
    setRules((old) => {
      const temp = [...old];
      temp[idx] = value;
      return temp;
    });
  };

  const handleAdd = () => {
    if (rules.length >= 4) {
      failToast("free", "최대 4개까지만 설정 가능합니다.");
      return;
    }
    setRules((old) => [...old, ""]);
  };

  return (
    <>
      <Slide isFixed={true}>
        <ProgressStatus value={56} />
        <Header isSlide={false} title="" />
      </Slide>

      <RegisterLayout>
        <RegisterOverview>
          <span>어떤 모임인지 작성해주세요!</span>
          <span>가입 이전에 어떤 활동과 방식의 모임인지 알 수 있어야 해요</span>
        </RegisterOverview>
        <Container>
          <Content
            placeholder="내용을 작성해주세요."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <RuleTitle>규칙이 있나요?</RuleTitle>
          <RuleContainer>
            {rules.map((item, idx) => (
              <RuleItem key={idx}>
                <input value={item} onChange={(e) => onChange(e, idx)} />
                <MinusWrapper
                  onClick={() => setRules((old) => old.filter((rule) => rule !== item))}
                >
                  <i className="fa-regular fa-minus-circle" />
                </MinusWrapper>
              </RuleItem>
            ))}

            <PlusWrapper onClick={() => handleAdd()}>
              <i className="fa-regular fa-plus-circle" />
            </PlusWrapper>
          </RuleContainer>
        </Container>
      </RegisterLayout>

      <BottomNav onClick={() => onClickNext()} />
    </>
  );
}

const RuleTitle = styled.div`
  margin-top: var(--gap-4);
  margin-bottom: Var(--gap-2);
  font-size: 15px;
  font-weight: 600;
`;

const MinusWrapper = styled.button`
  margin-left: var(--gap-2);
`;

const Container = styled.div``;

const RuleContainer = styled.ol``;

const RuleItem = styled.li`
  margin-left: var(--gap-5);
  margin-bottom: var(--gap-2);
  > input {
    width: 260px;
    margin-left: var(--gap-2);
    border: var(--border);
    border-radius: 4px;
    padding: 4px 8px;

    :focus {
      outline-color: var(--gray-800);
    }
  }
`;

const PlusWrapper = styled.button`
  margin-top: 4px;
  padding: 0 var(--gap-1);
`;

const Content = styled.textarea`
  margin-top: 40px;
  border: var(--border);
  border-radius: var(--rounded-lg);
  height: 200px;
  width: 100%;
  padding: var(--gap-3);
  font-size: 12px;
  :focus {
    outline: none;
    border: var(--border-thick);
  }
`;

export default GroupWritingContent;
