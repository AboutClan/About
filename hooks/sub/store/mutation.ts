import { AxiosError } from "axios";
import { useMutation } from "react-query";

import { requestServer } from "../../../libs/methodHelpers";
import { MutationOptions } from "../../../types/hooks/reactTypes";

export const useStoreMutation = (options?: MutationOptions<{ storeId: string; cnt: number }>) =>
  useMutation<void, AxiosError, { storeId: string; cnt: number }>(async (params) => {
    return requestServer<{ storeId: string; cnt: number }>({
      method: "post",
      url: `store/vote`,
      body: params,
    });
  }, options);

export const usePrizeMutation = (options?: MutationOptions<{ userId: string; gift: string }>) =>
  useMutation<void, AxiosError, { userId: string; gift: string }>(async (params) => {
    return requestServer<{ userId: string; gift: string }>({
      method: "post",
      url: `prize/randomRoulette`,
      body: params,
    });
  }, options);
