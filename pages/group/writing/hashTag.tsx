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

function GroupWritingHashTag() {
  const failToast = useFailToast();

  const groupWriting: IGroupWriting = JSON.parse(localStorage.getItem(GROUP_WRITING_STORE));

  const [text, setText] = useState(groupWriting?.hashTag || "");

  const onClickNext = () => {
    if (!text) {
      failToast("free", "내용을 작성해 주세요!");
      return;
    }
    setLocalStorageObj(GROUP_WRITING_STORE, {
      ...groupWriting,
      hashTag: text,
    });
  };

  return (
    <>
      <Slide isFixed={true}>
        <ProgressStatus value={86} />
        <Header isSlide={false} title="" url="/group/writing/period" />
      </Slide>

      <RegisterLayout>
        <RegisterOverview>
          <span>모임을 소개할 수 있는 해쉬태그를 달아봐요!</span>
          <span>#을 포함해서 작성해주세요!</span>
        </RegisterOverview>
        <Container>
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="ex) #코딩 #블로그"
          />
        </Container>
      </RegisterLayout>

      <BottomNav onClick={() => onClickNext()} url="/group/writing/condition" />
    </>
  );
}

const Container = styled.div``;

const Input = styled.input`
  margin-top: var(--gap-4);
  padding: var(--gap-2);
  width: 100%;
  border: var(--border);
  border-radius: var(--rounded);
  :focus {
    outline-color: var(--gray-800);
  }
`;

export default GroupWritingHashTag;
