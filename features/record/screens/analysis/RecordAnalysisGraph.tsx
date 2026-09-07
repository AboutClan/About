import styled from "styled-components";

import Chart from "@/features/record/components/Chart";

function RecordAnalysisGraph() {
  return (
    <Layout>
      <Chart type="study" />
    </Layout>
  );
}

const Layout = styled.div`
  margin: 0 var(--gap-2);
`;

export default RecordAnalysisGraph;
