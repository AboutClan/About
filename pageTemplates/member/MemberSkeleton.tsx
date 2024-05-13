import styled from "styled-components";

import MemberSectionTitle from "./MemberSectionTitle";
import MemberMyProfileSkeleton from "./memberSkeleton/MemberMyProfileSkeleton";
import MemberOverviewSkeleton from "./memberSkeleton/MemberOverviewSkeleton";
import MemberSectionListSkeleton from "./memberSkeleton/MemberSectionListSkeleton";

function MemberSkeleton() {
  return (
    <Layout>
      <MemberOverviewSkeleton />
      <HrDiv />
      <MemberMyProfileSkeleton />
      <HrDiv />
      <MembersContainer>
        <MemberTitle>멤버 소개</MemberTitle>
        <Section>
          <MemberSectionTitle section="member" />
          <MemberSectionListSkeleton />
        </Section>
        <Section>
          <MemberSectionTitle section="human" />
          <MemberSectionListSkeleton />
        </Section>
        <Section>
          <MemberSectionTitle section="resting" />
          <MemberSectionListSkeleton />
        </Section>
      </MembersContainer>
      <HrDiv />
    </Layout>
  );
}

const Layout = styled.div`
  margin-top: var(--gap-1);
  > div:first-child {
    margin-top: 0;
  }
`;
const MembersContainer = styled.div`
  margin: 0 var(--gap-4);
  padding-top: var(--gap-3);
  padding-bottom: var(--gap-4);
  > section {
    padding-top: var(--gap-3);
  }
`;
const Section = styled.section`
  > div:last-child {
    height: 48px;
    margin: var(--gap-3) 0;
    margin-left: -8px;
  }
`;
const MemberTitle = styled.span`
  font-weight: 600;
`;

const HrDiv = styled.div`
  margin: 0 !important;
  padding: 0 !important;
  height: 1px;
  background-color: var(--gray-400);
`;
export default MemberSkeleton;
