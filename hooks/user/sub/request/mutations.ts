import { AxiosError } from "axios";
import { useMutation } from "react-query";

import { requestServer } from "../../../../libs/methodHelpers";
import { MutationOptions } from "../../../../types/hooks/reactTypes";
import { IUserRequest } from "../../../../types/models/userTypes/userRequestTypes";

export const useUserRequestMutation = (options?: MutationOptions<IUserRequest>) =>
  useMutation<void, AxiosError, IUserRequest>(
    (param) =>
      requestServer<{ request: IUserRequest }>({
        method: "post",
        url: `request`,
        body: { request: param },
      }),
    options,
  );
