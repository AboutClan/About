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

function GroupWritingGuide() {
  const failToast = useFailToast();

  const groupWriting: IGroupWriting = JSON.parse(localStorage.getItem(GROUP_WRITING_STORE));

  const [title, setTitle] = useState(groupWriting?.title || "");
  const [guide, setGuide] = useState(groupWriting?.guide || "");

  const onClickNext = () => {
    if (!title || !guide) {
      failToast("free", "내용을 작성해 주세요!", true);
      return;
    }
    setLocalStorageObj(GROUP_WRITING_STORE, {
      ...groupWriting,
      title,
      guide,
    });
  };

  return (
    <>
      <Slide isFixed={true}>
        <ProgressStatus value={42} />
        <Header isSlide={false} title="" url="/group/writing/sub" />
      </Slide>

      <RegisterLayout>
        <RegisterOverview>
          <span>짧은 소개글을 작성해주세요! (내용, 진행 방식)</span>
          <span>스터디 소개에 가장 먼저 노출됩니다.</span>
        </RegisterOverview>
        <Container>
          <TitleInput placeholder="제목" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Guide
            placeholder="간단하게 작성해주세요."
            value={guide}
            onChange={(e) => setGuide(e.target.value)}
          />
        </Container>
      </RegisterLayout>

      <BottomNav onClick={() => onClickNext()} url="/group/writing/content" />
    </>
  );
}

const Container = styled.div``;

const TitleInput = styled.input`
  margin-top: var(--gap-5);
  padding-left: var(--gap-1);
  border-bottom: var(--border-thick);
  width: 100%;
  height: 40px;
  background-color: inherit;
  outline: none;
  font-size: 15px;
  font-weight: 600;
  ::placeholder {
    color: var(--gray-500);
  }
`;

const Guide = styled.textarea`
  margin-top: 40px;
  border: var(--border);
  border-radius: var(--rounded-lg);
  height: 120px;
  width: 100%;
  padding: var(--gap-3);
  font-size: 12px;
  :focus {
    outline: none;
    border: var(--border-thick);
  }
`;

export default GroupWritingGuide;
