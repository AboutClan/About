import styled from "styled-components";

import Skeleton from "../../components/atoms/skeleton/Skeleton";

function GatherImageSliderSkeleton() {
  return (
    <Layout>
      <GatherReviewNavIcon>
        <div>
          <i className="fa-solid fa-2x fa-image" style={{ color: "var(--color-mint)" }} />
        </div>
        <span>리뷰</span>
      </GatherReviewNavIcon>
      {new Array(6).fill(0).map((_, idx) => (
        <GatherReviewNavItem key={idx}>
          <div>
            <Skeleton>temp</Skeleton>
          </div>
          <span>
            <Skeleton>temp</Skeleton>
          </span>
        </GatherReviewNavItem>
      ))}
    </Layout>
  );
}

const Layout = styled.div`
  margin: 0 var(--gap-2);
  display: flex;
  overflow: hidden;
`;
const GatherReviewNavIcon = styled.div`
  margin-right: 28px;
  display: flex;
  flex-direction: column;
  width: 68px;
  align-items: center;
  > div {
    border-radius: var(--rounded-lg);
    width: 52px;
    height: 52px;
    overflow: hidden;
    background-color: var(--gray-300);
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 8px;
  }
  > span {
    font-size: 10px;
  }
`;
const GatherReviewNavItem = styled.div`
  margin-right: 28px;
  display: flex;
  flex-direction: column;
  width: 68px;
  align-items: center;

  > div {
    border-radius: var(--rounded-lg);
    width: 52px;
    height: 52px;
    overflow: hidden;
    background-color: var(--gray-300);
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 8px;
  }
  > span {
    display: inline-block;
    width: 50px;
    font-size: 10px;
  }
`;

export default GatherImageSliderSkeleton;
