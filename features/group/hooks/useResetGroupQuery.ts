import { useCallback } from "react";
import { useQueryClient } from "react-query";

import { GROUP_STUDY } from "@/constants/keys/queryKeys";

export const useResetGroupQuery = () => {
  const queryClient = useQueryClient();

  const refetchWithDelay = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    () => {
      queryClient.invalidateQueries({ queryKey: [GROUP_STUDY], exact: false });
    },
    [queryClient],
  );

  return refetchWithDelay;
};
