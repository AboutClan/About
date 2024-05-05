import styled from "styled-components";

import RecordAnalysisGraphSkeleton from "./skeleton/RecordAnalysisGraphSkeleton";
import RecordAnalysisHeaderSkeleton from "./skeleton/RecordAnalysisHeaderSkeleton";
import RecordAnalysisOverviewSkeleton from "./skeleton/RecordAnalysisOverviewSkeleton";
import RecordAnalysisSummarySkeleton from "./skeleton/RecordAnalysisSummarySkeleton";

function RecordAnalysisSkeleton() {
  return (
    <Layout>
      <RecordAnalysisHeaderSkeleton />
      <RecordAnalysisOverviewSkeleton />
      <RecordAnalysisSummarySkeleton />
      <RecordAnalysisGraphSkeleton />
    </Layout>
  );
}

const Layout = styled.div``;

export default RecordAnalysisSkeleton;
