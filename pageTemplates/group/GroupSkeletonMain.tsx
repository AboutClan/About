import styled from "styled-components";

import Skeleton from "../../components/atoms/skeleton/Skeleton";

function GroupSkeletonMain() {
  const temp = [1, 2, 3, 4, 5];
  return (
    <Layout>
      {temp.map((item) => (
        <ItemBlock key={item} />
      ))}
    </Layout>
  );
}

function ItemBlock() {
  return (
    <ItemBlockLayout>
      <Header>
        <div>
          <Skeleton>temp</Skeleton>
        </div>
        <Badge>
          <Skeleton>temp</Skeleton>
        </Badge>
      </Header>
      <Title>
        <Skeleton>temp</Skeleton>
      </Title>
      <Info>
        {[1, 2, 3, 4].map((item) => (
          <InfoItem key={item}>
            <Skeleton>temp</Skeleton>
          </InfoItem>
        ))}
      </Info>
      <Content>
        <Skeleton>temp</Skeleton>
      </Content>
    </ItemBlockLayout>
  );
}

const Layout = styled.div`
  margin: var(--gap-4);
`;

const Badge = styled.div`
  width: 39px;
`;

const ItemBlockLayout = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: var(--rounded);
  box-shadow: var(--shadow);
  padding: var(--gap-3);
  margin-bottom: var(--gap-4);
  box-shadow: var(--shadow);
`;

const Header = styled.header`
  width: 100%;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-mint);
  margin-bottom: var(--gap-1);
  > div:first-child {
    display: flex;
    align-items: center;
    width: 44px;
  }
`;
const Title = styled.div`
  width: 150px;
  font-weight: 600;
  font-size: 16px;
`;
const Info = styled.div`
  width: 100%;

  padding: var(--gap-2) 0;
  display: grid;
  grid-template-columns: 1.1fr 1.1fr 1.4fr;
  gap: var(--gap-1);
  border-bottom: var(--border);
`;

const InfoItem = styled.div`
  text-align: start;
  font-size: 13px;
  height: 20px;
  width: 90px;
  > span:first-child {
    display: inline-block;
    margin-right: var(--gap-2);
    font-weight: 600;
    color: var(--gray-3);
  }
  > span:last-child {
    color: var(--gray-3);
  }
`;

const Content = styled.pre`
  height: 36px;
  text-align: start;
  font-size: 12px;
  color: var(--gray-2);
  margin-top: var(--gap-3);
  white-space: pre-wrap;
  /* display: -webkit-box;
  -webkit-line-clamp: 7;
  -webkit-box-orient: vertical;
  overflow: hidden; */
`;

export default GroupSkeletonMain;
