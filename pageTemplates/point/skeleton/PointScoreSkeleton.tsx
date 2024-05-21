import styled from "styled-components";

import Skeleton from "../../../components/atoms/skeleton/Skeleton";

function PointScoreSkeleton() {
  return (
    <Layout>
      <Badge>
        <Skeleton>temp</Skeleton>
      </Badge>
      <ScoreBar>
        <Skeleton>temp</Skeleton>
      </ScoreBar>
      <ScoreNav>
        <div>
          <Skeleton>temp</Skeleton>
        </div>
        <div>
          <Skeleton>temp</Skeleton>
        </div>
      </ScoreNav>
      <ScoreNav>
        <div>
          <Skeleton>temp</Skeleton>
        </div>
        <div>
          <Skeleton>temp</Skeleton>
        </div>
      </ScoreNav>
    </Layout>
  );
}

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  padding: 14px;
  border-radius: var(--rounded-lg);
  background-color: white;

  height: 166.5px;
`;

const Badge = styled.div`
  height: 21px;
  width: 126px;
  margin-bottom: 12px;
`;

const ScoreBar = styled.div`
  margin-bottom: 12px;
  height: 4px;
`;
const ScoreNav = styled.div`
  height: 21px;
  display: flex;
  justify-content: space-between;
  margin: 12px 0;
  > div:first-child {
    width: 73px;
  }
  > div:last-child {
    width: 50px;
  }
`;

export default PointScoreSkeleton;
