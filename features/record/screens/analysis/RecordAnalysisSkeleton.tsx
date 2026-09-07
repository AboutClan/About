import styled from "styled-components";

import RecordAnalysisGraphSkeleton from "@/features/record/screens/analysis/skeleton/RecordAnalysisGraphSkeleton";
import RecordAnalysisHeaderSkeleton from "@/features/record/screens/analysis/skeleton/RecordAnalysisHeaderSkeleton";
import RecordAnalysisOverviewSkeleton from "@/features/record/screens/analysis/skeleton/RecordAnalysisOverviewSkeleton";
import RecordAnalysisSummarySkeleton from "@/features/record/screens/analysis/skeleton/RecordAnalysisSummarySkeleton";

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
