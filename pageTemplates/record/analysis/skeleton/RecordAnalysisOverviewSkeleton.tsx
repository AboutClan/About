import styled from "styled-components";

function RecordAnalysisOverviewSkeleton() {
  return (
    <Layout>
      <Title></Title>
      <Value></Value>
      <ChangeBtn>
        <span>전환</span>
        <i className="fa-solid fa-right-left fa-xs"  />
      </ChangeBtn>
    </Layout>
  );
}

const Layout = styled.div`
  padding: 0 var(--gap-4);
  height: 140px;
  background-color: var(--color-mint);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  line-height: 1.8;
`;

const Title = styled.div`
  height: 25px;
  width: 60px;
  margin-bottom: var(--gap-1);
`;

const Value = styled.div`
  width: 80px;
  height: 32px;
  font-size: 20px;
  font-weight: 600;
`;

const ChangeBtn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: var(--gap-2);
  background-color: #08ad9f;
  width: 58px;
  height: 28px;
  font-size: 13px;
  border-radius: var(--rounded-lg);
  > span:first-child {
    margin-right: var(--gap-2);
  }
`;

export default RecordAnalysisOverviewSkeleton;
