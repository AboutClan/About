import axios, { AxiosError } from "axios";
import { useMutation } from "react-query";

import { SERVER_URI } from "../../../constants/system";
import { MutationOptions } from "../../../types/hooks/reactTypes";

export const usePromotionMutation = (options?: MutationOptions<string>) =>
  useMutation<void, AxiosError, string>(async (name: string) => {
    await axios.post(`${SERVER_URI}/promotion`, { name });
  }, options);
