import styled from "styled-components";

import Skeleton from "../../../../components/atoms/skeleton/Skeleton";

function RecordAnalysisGraphSkeleton() {
  return (
    <Layout>
      <Title>내 스터디 참여</Title>
      <Graph>
        <Skeleton>temp</Skeleton>
      </Graph>
    </Layout>
  );
}

const Layout = styled.div`
  margin: 0 var(--gap-4);
`;

const Title = styled.span`
  font-weight: 600;
`;

const Graph = styled.div`
  margin-top: var(--gap-4);
  height: 200px;
`;

export default RecordAnalysisGraphSkeleton;
