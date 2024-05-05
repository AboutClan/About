import styled from "styled-components";

import Skeleton from "../../../components/atoms/skeleton/Skeleton";

function PointPointSkeleton() {
  return (
    <Layout>
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
      <Slider>
        <div>
          <Skeleton>temp</Skeleton>
        </div>
        <div>
          <Skeleton>temp</Skeleton>
        </div>
        <div>
          <Skeleton>temp</Skeleton>
        </div>
        <div>
          <Skeleton>temp</Skeleton>
        </div>
      </Slider>
    </Layout>
  );
}

const Layout = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  padding: 14px;
  border-radius: var(--rounded-lg);
  background-color: white;
  box-shadow: var(--shadow);
  height: 218px;
`;
const ScoreNav = styled.div`
  height: 21px;
  display: flex;
  justify-content: space-between;
  margin: 12px 0;
  > div:first-child {
    width: 87px;
  }
  > div:last-child {
    width: 50px;
  }
`;

const Slider = styled.div`
  display: flex;
  margin-top: 8px;
  overflow: hidden;

  > div {
    flex-shrink: 0;
    width: 80px !important;
    height: 80px;
    border-radius: var(--rounded-lg);
    margin-right: 21px;
  }
`;

export default PointPointSkeleton;
