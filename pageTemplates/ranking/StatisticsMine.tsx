import { Box } from "@chakra-ui/react";
import { useState } from "react";

import RecordAnalysisGraph from "../record/analysis/RecordAnalysisGraph";
import RecordAnalysisSummary from "../record/analysis/RecordAnalysisSummary";

export default function StatisticsMine() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Box position="relative" flex={1}>
      <Box display={isLoading ? "none" : "block"}>
        <RecordAnalysisSummary setIsLoading={setIsLoading} />
        <RecordAnalysisGraph />
      </Box>
    </Box>
  );
}
