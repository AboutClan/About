import { AxiosError } from "axios";
import { useMutation } from "react-query";

import { requestServer } from "../../libs/methodHelpers";
import { MutationOptions } from "../../types/hooks/reactTypes";
import { SendChatProps } from "../../types/models/chat";

export const useChatMutation = (toUid: string, options?: MutationOptions<{ message: string }>) =>
  useMutation<void, AxiosError, { message: string }>(
    ({ message }) =>
      requestServer<SendChatProps>({
        method: "post",
        url: "chat",
        body: { toUid, message },
      }),
    options,
  );
