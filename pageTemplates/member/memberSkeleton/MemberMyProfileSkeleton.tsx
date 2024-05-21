import styled from "styled-components";

import Skeleton from "../../../components/atoms/skeleton/Skeleton";

function MemberMyProfileSkeleton() {
  return (
    <Layout>
      <Title>내 프로필 카드</Title>
      <Wrapper>
        <Profile>
          <ProfileIcon>
            <Skeleton>temp</Skeleton>
          </ProfileIcon>
          <Name>
            <Skeleton>temp</Skeleton>
          </Name>
        </Profile>
        <Info>
          <div>
            <span>나이</span>
            <span>
              <Skeleton>temp</Skeleton>
            </span>
          </div>
          <div>
            <span>배지</span>
            <Badge>
              <Skeleton>temp</Skeleton>
            </Badge>
          </div>
          <div>
            <span>구성</span>
            <span>
              <Skeleton>temp</Skeleton>
            </span>
          </div>
          <div>
            <span>전공</span>
            <span>
              <Skeleton>temp</Skeleton>
            </span>
          </div>
          <div>
            <span>MBTI</span>
            <span>
              <Skeleton>temp</Skeleton>
            </span>
          </div>
          <div>
            <span>관심</span>
            <span>
              <Skeleton>temp</Skeleton>
            </span>
          </div>
        </Info>
      </Wrapper>
    </Layout>
  );
}

const Layout = styled.div`
  padding: var(--gap-3) 0;
  margin: 0 var(--gap-4);
  min-height: 167px;
`;
const Title = styled.span`
  font-weight: 600;
  margin-bottom: var(--gap-3);
`;
const Wrapper = styled.div`
  border-radius: var(--rounded-lg);
  border: var(--border-mint);
  padding: var(--gap-2) var(--gap-4);
  padding-right: 0;
  display: flex;
  align-items: center;
  height: 110px;
  margin-top: var(--gap-3);
  font-size: 12px;
`;

const Badge = styled.span``;

const ProfileIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
`;

const Profile = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;

const Name = styled.span`
  display: inline-block;
  font-weight: 600;
`;

const Info = styled.div`
  flex: 1;
  height: 100%;
  padding: var(--gap-1) 0;
  font-size: 12px;
  color: var(--gray-200);
  margin-left: var(--gap-4);
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  > div {
    display: flex;
    align-items: center;
    > span:first-child {
      display: inline-block;
      width: 36px;
      font-weight: 600;
    }
    > span:last-child {
      display: inline-block;
      width: 44px;
    }
  }
`;

export default MemberMyProfileSkeleton;
