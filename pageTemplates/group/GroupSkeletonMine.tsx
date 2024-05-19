import styled from "styled-components";

import Skeleton from "../../components/atoms/skeleton/Skeleton";

function GroupSkeletonMine() {
  return (
    <Layout>
      <Skeleton>
        <Wrapper>temp</Wrapper>
      </Skeleton>
    </Layout>
  );
}

const Layout = styled.div`
  height: 148px;
  border-bottom: 6px solid var(--gray-200);
`;

const Wrapper = styled.div`
  padding-bottom: var(--gap-4);
`;

export default GroupSkeletonMine;
