import styled from "styled-components";

import Skeleton from "../../../components/atoms/skeleton/Skeleton";

function StudyOverviewSkeleton() {
  return (
    <Layout>
      <div>
        <Skeleton>temp</Skeleton>
      </div>
      <SpaceDetail>
        <Location>
          위치:
          <div>
            <Skeleton>temp</Skeleton>
          </div>
        </Location>
        <Time>
          시간:
          <div>
            <Skeleton>temp</Skeleton>
          </div>
        </Time>
      </SpaceDetail>
    </Layout>
  );
}

const Layout = styled.div`
  margin: 0 var(--gap-4);
  margin-top: 36px;
  padding-bottom: var(--gap-4);
  > div:first-child {
    display: inline-block;
    font-weight: 600;
    font-size: 18px;
    height: 25px;
  }
`;

const SpaceDetail = styled.div`
  color: var(--gray-2);
  font-size: 12px;
  font-weight: 600;
  margin-top: var(--gap-3);
  display: flex;
  flex-direction: column;
  > span {
    > span {
      margin-left: var(--gap-1);
    }
  }
`;
const Location = styled.span`
  display: flex;

  > div:first-child {
    width: 240px;
    color: var(--gray-1);
    margin-left: var(--gap-1);
  }
`;
const Time = styled.span`
  display: flex;
  > div {
    margin-left: var(--gap-1);
    width: 80px;
  }
`;

export default StudyOverviewSkeleton;
