import { useState } from "react";
import styled from "styled-components";

import BottomNav from "../../../components/layouts/BottomNav";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import ButtonCheckNav from "../../../components/molecules/ButtonCheckNav";
import ProgressStatus from "../../../components/molecules/ProgressStatus";
import { GROUP_WRITING_STORE } from "../../../constants/keys/localStorage";
import RegisterLayout from "../../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../../pageTemplates/register/RegisterOverview";
import { IGroupWriting } from "../../../types/models/groupTypes/group";
import { setLocalStorageObj } from "../../../utils/storageUtils";
function GroupWritingContent() {
  const groupWriting: IGroupWriting = JSON.parse(localStorage.getItem(GROUP_WRITING_STORE));

  const [period, setPeriod] = useState(groupWriting?.period || "주 1회");

  const onClickNext = () => {
    setLocalStorageObj(GROUP_WRITING_STORE, {
      ...groupWriting,
      period,
    });
  };

  const periodArr = [
    "매일",
    "주 1회",
    "주 2회",
    "주 3회",
    "주 4회",
    "주 5회",
    "월 1회",
    "월 2회",
    "월 3회",
    "월 4회",
    "자율",
  ];

  return (
    <>
      <Slide isFixed={true}>
        <ProgressStatus value={72} />
        <Header isSlide={false} title="" url="/group/writing/content" />
      </Slide>
      <RegisterLayout>
        <RegisterOverview>
          <span>진행 주기를 체크해주세요!</span>
          <span>나중에 변경할 수 있습니다.</span>
        </RegisterOverview>
        <Container>
          <ButtonCheckNav
            buttonList={periodArr}
            setSelectedButton={setPeriod}
            selectedButton={period}
            isWrap={true}
          />
        </Container>
      </RegisterLayout>
      <BottomNav onClick={() => onClickNext()} url="/group/writing/hashTag" />
    </>
  );
}

const Container = styled.div`
  margin-top: var(--gap-4);
`;

export default GroupWritingContent;
