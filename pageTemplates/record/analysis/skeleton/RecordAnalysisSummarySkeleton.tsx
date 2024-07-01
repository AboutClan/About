import styled from "styled-components";

import Skeleton from "../../../../components/atoms/skeleton/Skeleton";

function RecordAnalysisSummarySkeleton() {
  return (
    <Layout>
      <Title>요약</Title>
      <Summary>
        {[1, 2, 3, 4, 5].map((item, idx) => (
          <SummaryItem key={idx}>
            <WeekText>
              <Skeleton>temp</Skeleton>
            </WeekText>
            <WeekAttend>
              <Skeleton>temp</Skeleton>
            </WeekAttend>
          </SummaryItem>
        ))}
      </Summary>
    </Layout>
  );
}

const Layout = styled.div`
  margin: 0 var(--gap-4);
  padding: var(--gap-4) 0;
`;

const Title = styled.span`
  font-size: 15px;
  font-weight: 600;
`;

const Summary = styled.div`
  margin-top: var(--gap-3);
`;

const SummaryItem = styled.div`
  height: 37px;
  display: flex;
  justify-content: space-between;
  padding: var(--gap-2) var(--gap-1);
`;

const WeekText = styled.div`
  height: 20px;
  width: 140px;
  > span:last-child {
    margin-left: var(--gap-1);
    color: var(--gray-500);
  }
`;

const WeekAttend = styled.span`
  font-weight: 600;
  width: 28px;
`;

export default RecordAnalysisSummarySkeleton;
