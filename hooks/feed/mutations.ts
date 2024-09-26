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

export const useFeedLikeMutation = (options?: MutationOptions<string>) =>
  useMutation<void, AxiosError, string>(
    (id) =>
      requestServer<{ id: string }>({
        method: "post",
        url: "feed/like",
        body: { id },
      }),
    options,
  );
