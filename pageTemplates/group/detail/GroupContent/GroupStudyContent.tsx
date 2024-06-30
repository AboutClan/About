import { useState } from "react";
import styled from "styled-components";

import TabNav, { ITabNavOptions } from "../../../../components/molecules/navs/TabNav";
import { IGroup } from "../../../../types/models/groupTypes/group";
import ContentAttend from "./ContentAttendance";
import ContentChat from "./ContentChat";
import ContentGather from "./ContentGather";
import ContentInfo from "./ContentInfo";

interface IGroupContent {
  group: IGroup;
}

type Category = "정보" | "모임" | "출석부" | "채팅";

function GroupContent({ group }: IGroupContent) {
  const [category, setCategory] = useState<Category>("정보");

  const categoryArr: Category[] = ["정보", "출석부", "모임", "채팅"];

  const tabArr: ITabNavOptions[] = categoryArr.map((category) => ({
    text: category,
    func: () => setCategory(category),
    flex: 1,
  }));



  return (
    <Layout>
      <TabNav tabOptionsArr={tabArr} selected={category} />
 
      <ContentContainer>
        {category === "정보" ? (
          <ContentInfo group={group} />
        ) : category === "모임" ? (
          <ContentGather />
        ) : category === "출석부" ? (
          <ContentAttend group={group} />
        ) : (
          <ContentChat />
        )}
      </ContentContainer>
    </Layout>
  );
}

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 140px;
  border-bottom: 6px solid var(--gray-200);
`;

const ContentContainer = styled.div`
  background-color: white;
  display: flex;
  flex-direction: column;

  min-height: 440px;
`;

export default GroupContent;
