import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import BottomNav from "../../../../components/layout/BottomNav";
import Header from "../../../../components/layout/Header";
import Slide from "../../../../components/layout/Slide";

import ProgressStatus from "../../../../components/templates/ProgressStatus";
import {
  GROUP_STUDY_CATEGORY_ARR_ICONS,
  GROUP_STUDY_SUB_CATEGORY,
} from "../../../../constants/contents/GroupContents";

import { useFailToast } from "../../../../hooks/custom/CustomToast";
import RegisterLayout from "../../../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../../../pageTemplates/register/RegisterOverview";
import { prevPageUrlState } from "../../../../recoil/previousAtoms";
import { sharedGroupWritingState } from "../../../../recoil/sharedDataAtoms";
function WritingStudyCategorySub() {
  const router = useRouter();
  const failToast = useFailToast();

  const prevPageUrl = useRecoilValue(prevPageUrlState);
  const [GroupWriting, setGroupWriting] = useRecoilState(
    sharedGroupWritingState
  );

  const mainCategory = GroupWriting?.category?.main;

  const [category, setCategory] = useState<string>(GroupWriting?.category?.sub);

  const onClickNext = () => {
    if (!category) {
      failToast("free", "주제를 선택해 주세요!", true);
      return;
    }
    setGroupWriting((old) => ({
      ...old,
      category: { ...old.category, sub: category },
    }));
    router.push(`/group/writing/guide`);
  };

  useEffect(() => {
    if (!mainCategory) router.push("/group/writing/category/main");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mainCategory]);

  return (
    <Slide>
      <ProgressStatus value={28} />
      <Header title="" url={"/group/writing/category/main"} />
      <RegisterLayout>
        <RegisterOverview>
          <span>주제를 선택해 주세요.</span>
        </RegisterOverview>
        <ItemContainer>
          {GROUP_STUDY_SUB_CATEGORY[mainCategory].map((type, idx) => (
            <Item
              key={idx}
              isSelected={type === category}
              onClick={() => setCategory(type)}
            >
              <IconWrapper>
                {GROUP_STUDY_CATEGORY_ARR_ICONS[mainCategory]}
              </IconWrapper>
              <Info>{type}</Info>
            </Item>
          ))}
        </ItemContainer>
      </RegisterLayout>
      <BottomNav onClick={onClickNext} />
    </Slide>
  );
}

const ItemContainer = styled.div`
  margin-top: var(--gap-5);
  display: flex;
  flex-direction: column;
`;

const Item = styled.div<{ isSelected: boolean }>`
  display: flex;
  background-color: white;
  align-items: center;
  margin-bottom: var(--gap-2);
  height: 60px;
  border-radius: var(--rounded-lg);
  border: ${(props) =>
    props.isSelected ? "2px solid var(--color-mint)" : "var(--border)"};
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

export default WritingStudyCategorySub;
