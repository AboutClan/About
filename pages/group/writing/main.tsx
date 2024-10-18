import { useState } from "react";
import styled from "styled-components";

import BottomNav from "../../../components/layouts/BottomNav";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import ProgressStatus from "../../../components/molecules/ProgressStatus";
import {
  GROUP_STUDY_CATEGORY_ARR,
  GROUP_STUDY_CATEGORY_ARR_ICONS,
} from "../../../constants/contentsText/GroupStudyContents";
import { GROUP_WRITING_STORE } from "../../../constants/keys/localStorage";
import { useFailToast } from "../../../hooks/custom/CustomToast";
import RegisterLayout from "../../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../../pageTemplates/register/RegisterOverview";
import { IGroupWriting } from "../../../types/models/groupTypes/group";
import { setLocalStorageObj } from "../../../utils/storageUtils";
function WritingStudyCategoryMain() {
  const failToast = useFailToast();

  const groupWriting: IGroupWriting = JSON.parse(localStorage.getItem(GROUP_WRITING_STORE));

  const [category, setCategory] = useState<string>(groupWriting?.category?.main);

  const onClickNext = () => {
    if (!category) {
      failToast("free", "주제를 선택해 주세요!");
      return;
    }
    setLocalStorageObj(GROUP_WRITING_STORE, {
      ...groupWriting,
      category: { ...groupWriting?.category, main: category },
    });
  };

  return (
    <>
      <Slide isFixed={true}>
        <ProgressStatus value={14} />
        <Header isSlide={false} title="" url="/group" />
      </Slide>

      <RegisterLayout>
        <RegisterOverview>
          <span>주제를 선택해 주세요.</span>
        </RegisterOverview>
        <ItemContainer>
          {GROUP_STUDY_CATEGORY_ARR.map((type, idx) =>
            type !== "전체" ? (
              <Item key={idx} isSelected={type === category} onClick={() => setCategory(type)}>
                <IconWrapper>{GROUP_STUDY_CATEGORY_ARR_ICONS[type]}</IconWrapper>
                <Info>{type}</Info>
              </Item>
            ) : null,
          )}
        </ItemContainer>
      </RegisterLayout>

      <BottomNav onClick={onClickNext} url="/group/writing/sub" />
    </>
  );
}

const ItemContainer = styled.div`
  margin-top: var(--gap-5);
  display: flex;
  flex-direction: column;
`;

const Item = styled.div<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  margin-bottom: var(--gap-2);
  height: 60px;
  background-color: white;
  border-radius: var(--rounded-lg);

  border: ${(props) => (props.isSelected ? "2px solid var(--color-mint)" : "var(--border)")};
`;

const IconWrapper = styled.div`
  font-size: 18px;
  width: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  > span:first-child {
    font-weight: 600;
  }
  > span:last-child {
    color: var(--gray-600);
    font-size: 12px;
  }
`;

export default WritingStudyCategoryMain;
