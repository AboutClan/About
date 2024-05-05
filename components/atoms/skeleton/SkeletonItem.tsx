import styled from "styled-components";

import Skeleton from "./Skeleton";

interface ISkeletonItem {
  w?: number;
  h?: number;
}

function SkeletonItem({ w, h }: ISkeletonItem) {
  return (
    <Layout w={w} h={h}>
      <Skeleton>temp</Skeleton>
    </Layout>
  );
}

const Layout = styled.div<{ w?: number; h?: number }>`
  width: ${(props) => props?.w}px;
`;

export default SkeletonItem;
