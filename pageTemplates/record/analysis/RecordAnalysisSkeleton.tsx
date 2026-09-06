import styled from "styled-components";

import RecordAnalysisGraphSkeleton from "@/pageTemplates/record/analysis/skeleton/RecordAnalysisGraphSkeleton";
import RecordAnalysisHeaderSkeleton from "@/pageTemplates/record/analysis/skeleton/RecordAnalysisHeaderSkeleton";
import RecordAnalysisOverviewSkeleton from "@/pageTemplates/record/analysis/skeleton/RecordAnalysisOverviewSkeleton";
import RecordAnalysisSummarySkeleton from "@/pageTemplates/record/analysis/skeleton/RecordAnalysisSummarySkeleton";

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
