import { AxiosError } from "axios";
import { useMutation } from "react-query";

import { requestServer } from "../../libs/methodHelpers";
import { MutationOptions } from "../../types/hooks/reactTypes";

export const useFeedMutation = (options?: MutationOptions<FormData>) =>
  useMutation<void, AxiosError, FormData>(
    (param) =>
      requestServer<FormData>({
        method: "post",
        url: "feed",
        body: param,
      }),
    options,
  );
