import { useState } from "react";
import styled from "styled-components";
import { IGroupStudy } from "../../../../types/page/groupStudy";
import ContentGallery from "./ContentGallery";
import ContentGather from "./ContentGather";
import ContentInfo from "./ContentInfo";

interface IGroupStudyContent {
  groupStudy: IGroupStudy;
}

type Category = "정보" | "모임" | "앨범";

function GroupStudyContent({ groupStudy }: IGroupStudyContent) {
  const [category, setCategory] = useState<Category>("정보");

  const categoryArr: Category[] = ["정보", "모임", "앨범"];

  return (
    <Layout>
      <ContentNav>
        {categoryArr.map((item) => (
          <ContentBtn
            onClick={() => setCategory(item)}
            isSelected={item === category}
            key={item}
          >
            {item}
          </ContentBtn>
        ))}
      </ContentNav>
      <ContentContainer>
        {category === "정보" ? (
          <ContentInfo groupStudy={groupStudy} />
        ) : category === "모임" ? (
          <ContentGather />
        ) : (
          <ContentGallery />
        )}
      </ContentContainer>
    </Layout>
  );
}

const ContentNav = styled.nav`
  display: flex;
  background-color: white;
`;

const ContentBtn = styled.button<{ isSelected: boolean }>`
  flex: 1;
  padding: var(--padding-md) 0;
  border-bottom: ${(props) => props.isSelected && "2px solid var(--font-h1)"};
`;

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 140px;
  border-bottom: 6px solid var(--font-h56);
`;

const ContentContainer = styled.div`
  background-color: white;
  min-height: 240px;
`;

export default GroupStudyContent;