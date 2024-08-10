import { useSession } from "next-auth/react";
import styled from "styled-components";

import BlurredLink from "../../../../components/molecules/BlurredLink";
import { IGroup } from "../../../../types/models/groupTypes/group";
import GroupComments from "../GroupComment";
import GroupDetailInfo from "../GroupDetail";
import GroupParticipation from "../GroupParticipation";

interface IContentInfo {
  group: IGroup;
}

function ContentInfo({ group }: IContentInfo) {
  const { data: session } = useSession();
  const hashTagText = group.hashTag;
  const hashTagArr = hashTagText?.split("#");
  console.log(13, group);
  const isMember = group?.participants?.some((who) => who?.user?.uid === session?.user.uid);

  return (
    <>
      <Layout>
        <Wrapper>
          <GroupDetailInfo group={group} />
        </Wrapper>
        <ContentWrapper>
          <span>소개</span>
          <Content>{group.content}</Content>
        </ContentWrapper>
        {!!group?.rules?.length && (
          <ContentWrapper>
            <span>규칙</span>
            <Rules>{group?.rules.map((rule, idx) => <Rule key={idx}>{rule}</Rule>)}</Rules>
          </ContentWrapper>
        )}
        {group?.link && (
          <KakaoLink>
            <BlurredLink url={group.link} isBlur={!isMember} />
          </KakaoLink>
        )}
        {group?.challenge && (
          <Challenge>
            <i
              className="fa-regular fa-bell-on"
              style={{ color: "var(--color-red)", marginRight: "2px" }}
            />
            {group?.challenge}
          </Challenge>
        )}
        <Tag>{hashTagArr?.map((tag, idx) => (tag ? <div key={idx}>#{tag}</div> : null))}</Tag>
      </Layout>
      <GroupParticipation data={group} />
      <GroupComments comments={group.comments} />
    </>
  );
}

const KakaoLink = styled.div`
  display: flex;
  flex-direction: column;
  padding: var(--gap-2) var(--gap-3);
  padding-bottom: var(--gap-1);
  background-color: var(--gray-100);

  > div {
    padding: var(--gap-1) 0;
  }
`;

const Challenge = styled.div`
  padding: var(--gap-2) var(--gap-3);
  background-color: var(--gray-100);
  > svg {
    margin-right: var(--gap-2);
  }
`;

const Rules = styled.ol``;

const Rule = styled.li`
  margin-left: var(--gap-3);
  margin-bottom: 4px;
`;

const Wrapper = styled.div`
  padding: var(--gap-4);
  background-color: var(--gray-100);
`;

const Layout = styled.div`
  flex: 1;

  display: flex;
  flex-direction: column;
`;

const ContentWrapper = styled.div`
  padding: var(--gap-4);
  flex: 1;

  display: flex;
  flex-direction: column;

  > span:first-child {
    display: inline-block;
    font-size: 16px;
    margin-bottom: var(--gap-3);
    font-weight: 700;
  }
`;

const Content = styled.pre`
  font-size: 14px;
  font-family: apple;
  white-space: pre-wrap;
  flex: 1;
`;

const Tag = styled.div`
  display: flex;
  margin-top: auto;
  padding: var(--gap-3) var(--gap-4);
  > div {
    padding: var(--gap-1) var(--gap-2);
  }
`;

export default ContentInfo;
