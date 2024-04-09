import axios, { AxiosError } from "axios";
import { useMutation } from "react-query";
import { SERVER_URI } from "../../../constants/system";
import { MutationOptions } from "../../../types/components/modalTypes";

export const usePromotionMutation = (options?: MutationOptions<string>) =>
  useMutation<void, AxiosError, string>(async (name: string) => {
    await axios.post(`${SERVER_URI}/user/promotion`, { name });
  }, options);
