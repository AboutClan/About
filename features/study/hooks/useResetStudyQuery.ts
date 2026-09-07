import { useCallback } from "react";
import { useQueryClient } from "react-query";

import { STUDY_VOTE } from "@/constants/keys/queryKeys";

export const useResetStudyQuery = () => {
  const queryClient = useQueryClient();

  const refetchWithDelay = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    () => {
      queryClient.invalidateQueries({ queryKey: [STUDY_VOTE], exact: false });
    },
    [queryClient],
  );

  return refetchWithDelay;
};
