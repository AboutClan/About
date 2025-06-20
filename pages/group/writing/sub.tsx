import { useRouter } from "next/router";
import { useEffect, useState } from "react";
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
function WritingStudyCategorySub() {
  const router = useRouter();
  const failToast = useFailToast();

  const groupWriting: IGroupWriting = JSON.parse(localStorage.getItem(GROUP_WRITING_STORE));

  const mainCategory = groupWriting?.category?.main;

  const [category, setCategory] = useState<string>(groupWriting?.category?.sub);
  console.log(setCategory);
  const onClickNext = () => {
    if (!category) {
      failToast("free", "주제를 선택해 주세요!");
      return;
    }
    setLocalStorageObj(GROUP_WRITING_STORE, {
      ...groupWriting,
      category: { ...groupWriting?.category, sub: category },
    });
    router.push({ pathname: `/group/writing/guide`, query: router.query });
  };

  useEffect(() => {
    if (!mainCategory) router.push({ pathname: `/group/writing/main`, query: router.query });
  }, [mainCategory]);

  return (
    <>
      <Slide isFixed={true}>
        <ProgressStatus value={28} />
        <Header isSlide={false} title="" />
      </Slide>
      <RegisterLayout>
        <RegisterOverview>
          <span>주제를 선택해 주세요.</span>
        </RegisterOverview>
        <ItemContainer>
          {/* {GROUP_STUDY_SUB_CATEGORY?.[mainCategory]?.map((type, idx) => (
            <Item key={idx} isSelected={type === category} onClick={() => setCategory(type)}>
              <IconWrapper>{GROUP_STUDY_CATEGORY_ARR_ICONS[mainCategory]}</IconWrapper>
              <Info>{type}</Info>
            </Item>
          ))} */}
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

// const Item = styled.div<{ isSelected: boolean }>`
//   display: flex;
//   background-color: white;
//   align-items: center;
//   margin-bottom: var(--gap-2);
//   height: 60px;
//   border-radius: var(--rounded-lg);
//   border: ${(props) => (props.isSelected ? "2px solid var(--color-mint)" : "var(--border)")};
// `;

// const IconWrapper = styled.div`
//   font-size: 18px;
//   width: 60px;
//   display: flex;
//   justify-content: center;
//   align-items: center;
// `;

// const Info = styled.div`
//   display: flex;
//   flex-direction: column;
//   > span:first-child {
//     font-weight: 600;
//   }
//   > span:last-child {
//     color: var(--gray-600);
//     font-size: 12px;
//   }
// `;

export default WritingStudyCategorySub;
