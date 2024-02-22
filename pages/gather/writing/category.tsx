import { useRouter } from "next/router";
import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import BottomNav from "../../../components/layout/BottomNav";
import Slide from "../../../components/layout/PageSlide";

import ProgressStatus from "../../../components/templates/ProgressStatus";
import Header from "../../../components2/Header";
import {
  GatherCategoryIcons,
  GATHER_TYPES,
} from "../../../constants/contents/GatherContents";
import { useFailToast } from "../../../hooks/custom/CustomToast";
import RegisterLayout from "../../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../../pageTemplates/register/RegisterOverview";
import { prevPageUrlState } from "../../../recoil/previousAtoms";
import { sharedGatherWritingState } from "../../../recoil/sharedDataAtoms";

import { IGatherType } from "../../../types/page/gather";

function WritingGatherCategory() {
  const router = useRouter();
  const failToast = useFailToast();

  const prevPageUrl = useRecoilValue(prevPageUrlState);
  const [gatherWriting, setGatherWriting] = useRecoilState(
    sharedGatherWritingState
  );

  const [IGatherType, setIGatherType] = useState<IGatherType>(
    gatherWriting?.type
  );

  const onClickNext = () => {
    if (!IGatherType) {
      failToast("free", "주제를 선택해 주세요!", true);
      return;
    }
    setGatherWriting((old) => ({ ...old, type: IGatherType }));
    router.push(`/gather/writing/content`);
  };

  return (
    <>
      <Slide isFixed={true}>
        <ProgressStatus value={20} />
        <Header isSlide={false} title="" url={prevPageUrl || "/gather"} />
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
    props.isSelected ? "2px solid var(--color-mint)" : "var(--border)"};
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
    color: var(--gray-3);
    font-size: 12px;
  }
`;

export default WritingGatherCategory;
