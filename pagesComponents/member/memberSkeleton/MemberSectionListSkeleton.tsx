import styled from "styled-components";
import Skeleton from "../../../components/common/Skeleton";

function MemberSectionListSkeleton() {
  return (
    <Layout>
      <Skeleton>temp</Skeleton>
    </Layout>
  );
}

const Layout = styled.div`
  height: 60px;
`;

export default MemberSectionListSkeleton;
