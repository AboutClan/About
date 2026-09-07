import { Box } from "@chakra-ui/react";
import { useState } from "react";

import { MainLoadingAbsolute } from "@/components/atoms/loaders/MainLoading";
import RecordAnalysisGraph from "@/features/record/screens/analysis/RecordAnalysisGraph";
import RecordAnalysisSummary from "@/features/record/screens/analysis/RecordAnalysisSummary";

export default function StatisticsMine() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Box position="relative" flex={1} minH="390px">
      <Box display={isLoading ? "none" : "block"}>
        <RecordAnalysisSummary setIsLoading={setIsLoading} />
        <RecordAnalysisGraph />
      </Box>
      {isLoading && <MainLoadingAbsolute />}
    </Box>
  );
}
