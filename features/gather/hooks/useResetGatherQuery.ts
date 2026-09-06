import { useCallback } from "react";
import { useQueryClient } from "react-query";
import { useSetRecoilState } from "recoil";

import { GATHER_CONTENT } from "@/constants/keys/queryKeys";
import { transferGatherDataState } from "@/features/gather/state";

export const useResetGatherQuery = () => {
  const queryClient = useQueryClient();
  const setTransferGatherData = useSetRecoilState(transferGatherDataState);

  const refetchWithDelay = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    () => {
      queryClient.resetQueries({ queryKey: [GATHER_CONTENT], exact: false });
      setTransferGatherData(null);
    },
    [queryClient],
  );

  return refetchWithDelay;
};
