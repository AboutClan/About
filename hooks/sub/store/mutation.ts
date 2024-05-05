import axios, { AxiosError } from "axios";
import { useMutation } from "react-query";

import { MutationOptions } from "../../../types/hooks/reactTypes";
import { IStoreApplicant } from "../../../types/models/store";

export const useStoreMutation = (options?: MutationOptions<IStoreApplicant>) =>
  useMutation<void, AxiosError, IStoreApplicant>(async (applyInfo) => {
    await axios.post("/api/store", applyInfo);
  }, options);
