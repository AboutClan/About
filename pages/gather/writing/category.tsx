import { useRouter } from "next/router";
import { useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";

import BottomNav from "../../../components/layouts/BottomNav";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import ProgressStatus from "../../../components/molecules/ProgressStatus";
import { GATHER_TYPES,GatherCategoryIcons } from "../../../constants/contentsText/GatherContents";
import { useFailToast } from "../../../hooks/custom/CustomToast";
import RegisterLayout from "../../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../../pageTemplates/register/RegisterOverview";
import { sharedGatherWritingState } from "../../../recoils/sharedDataAtoms";
import { IGatherType } from "../../../types/models/gatherTypes/gatherTypes";

function WritingGatherCategory() {
  const router = useRouter();
  const failToast = useFailToast();

  const [gatherWriting, setGatherWriting] = useRecoilState(sharedGatherWritingState);

  const [IGatherType, setIGatherType] = useState<IGatherType>(gatherWriting?.type);

  const onClickNext = () => {
    if (!IGatherType) {
      failToast("free", "주제를 선택해 주세요!");
      return;
    }
    setGatherWriting((old) => ({ ...old, type: IGatherType }));
    router.push(`/gather/writing/content`);
  };

  return (
    <>
      <Slide isFixed={true}>
        <ProgressStatus value={20} />
        <Header isSlide={false} title="" url="/gather" />
      </Slide>
      <RegisterLayout>
        <RegisterOverview>
          <span>주제를 선택해 주세요.</span>
        </RegisterOverview>
        <ItemContainer>
          {GATHER_TYPES.map((type, idx) => (
            <Item
              key={idx}
              isSelected={type.title === IGatherType?.title}
              onClick={() => setIGatherType(type)}
            >
              <IconWrapper>{GatherCategoryIcons[idx]}</IconWrapper>
              <Info>
                <span>{type.title}</span>
                <span>{type.subtitle}</span>
              </Info>
            </Item>
          ))}
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
  background-color: white;
  margin-bottom: var(--gap-2);
  height: 60px;
  border-radius: var(--rounded-lg);
  border: ${(props) =>
    props.isSelected ? "2px solid var(--color-mint)" : "1px solid var(--gray-200)"};
`;

const IconWrapper = styled.div`
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

export default WritingGatherCategory;
