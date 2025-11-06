import { AxiosError } from "axios";
import { useMutation } from "react-query";

import { requestServer } from "../../../../libs/methodHelpers";
import { MutationOptions } from "../../../../types/hooks/reactTypes";
import { Alphabet } from "../../../../types/models/collections";

interface ReturnProps {
  alphabet: Alphabet;
  stamps: number;
}

export const useDailyCheckMutation = (options?: MutationOptions<void, ReturnProps>) =>
  useMutation<ReturnProps, AxiosError, void>(() => {
    return requestServer<void, ReturnProps>({
      method: "post",
      url: `dailyCheck`,
    });
  }, options);
