import { useRouter } from "next/router";
import { useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";

import BottomNav from "../../../components/layouts/BottomNav";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import ProgressStatus from "../../../components/molecules/ProgressStatus";
import {
  GROUP_STUDY_CATEGORY_ARR,
  GROUP_STUDY_CATEGORY_ARR_ICONS,
} from "../../../constants/contentsText/GroupStudyContents";
import { useFailToast } from "../../../hooks/custom/CustomToast";
import RegisterLayout from "../../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../../pageTemplates/register/RegisterOverview";
import { sharedGroupWritingState } from "../../../recoils/sharedDataAtoms";
function WritingStudyCategoryMain() {
  const router = useRouter();
  const failToast = useFailToast();

  const [groupWriting, setgroupWriting] = useRecoilState(sharedGroupWritingState);

  const [category, setCategory] = useState<string>(groupWriting?.category?.main);

  const onClickNext = () => {
    if (!category) {
      failToast("free", "주제를 선택해 주세요!", true);
      return;
    }
    setgroupWriting((old) => ({
      ...old,
      category: { ...old?.category, main: category },
    }));
    router.push(`/group/writing/sub`);
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

      <BottomNav onClick={onClickNext} />
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
  box-shadow: var(--shadow);
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
    color: var(--gray-3);
    font-size: 12px;
  }
`;

export default WritingStudyCategoryMain;
