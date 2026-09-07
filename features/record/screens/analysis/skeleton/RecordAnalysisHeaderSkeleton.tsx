import styled from "styled-components";

function RecordAnalysisHeaderSkeleton() {
  return (
    <Layout>
      <i className="fa-solid fa-chevron-left fa-lg"  />
      <Title>내 스터디 분석</Title>
    </Layout>
  );
}

const Layout = styled.div`
  height: 46px;
  padding: 0 var(--gap-4);
  display: flex;
  align-items: center;
  color: white;
  background-color: var(--color-mint);
`;
const Title = styled.span`
  font-size: 17px;
  font-weight: 600;
  margin-left: var(--gap-4);
`;

export default RecordAnalysisHeaderSkeleton;
