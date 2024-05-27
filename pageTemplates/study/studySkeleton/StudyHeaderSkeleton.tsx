import styled from "styled-components";

import Skeleton from "../../../components/atoms/skeleton/Skeleton";

function StudyHeaderSkeleton() {
  return (
    <Layout>
      <div>
        <i className="fa-solid fa-chevron-left" />
        <Title>
          <Skeleton>temp</Skeleton>
        </Title>
      </div>
      <div>{location && <i className="fa-solid fa-arrow-up-from-bracket fa-lg"  />}</div>
    </Layout>
  );
}

const Layout = styled.div`
  height: var(--header-height);
  padding: 0 var(--gap-4);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: var(--gap-5);
  > div:first-child {
    display: flex;
    align-items: center;
  }
`;
const Title = styled.div`
  font-size: 17px;
  font-weight: 600;
  margin-left: var(--gap-4);
  width: 100px;
`;

export default StudyHeaderSkeleton;
