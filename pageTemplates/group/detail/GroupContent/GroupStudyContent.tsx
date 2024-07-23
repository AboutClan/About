import styled from "styled-components";

import TabNav, { ITabNavOptions } from "../../../../components/molecules/navs/TabNav";
import { GroupSectionCategory } from "../../../../pages/group/[id]";
import { DispatchType } from "../../../../types/hooks/reactTypes";
import { IGroup } from "../../../../types/models/groupTypes/group";
import ContentAttend from "./ContentAttendance";
import ContentChat from "./ContentChat";
import ContentGather from "./ContentFeed";
import ContentInfo from "./ContentInfo";

interface IGroupContent {
  group: IGroup;
  category: GroupSectionCategory;
  setCategory: DispatchType<GroupSectionCategory>;
}

function GroupContent({ group, category, setCategory }: IGroupContent) {
  const categoryArr: GroupSectionCategory[] = ["정보", "출석부", "피드", "채팅"];

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
        ) : category === "피드" ? (
          <ContentGather group={group} />
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
