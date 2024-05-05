import { AxiosError } from "axios";
import { useMutation } from "react-query";

import { requestServer } from "../../../libs/methodHelpers";
import { MutationOptions } from "../../../types/hooks/reactTypes";
import { ICounter } from "../../../types/models/admin";
import { Location } from "../../../types/services/locationTypes";

export const useCounterMutation = (
  key: "enthusiasticMember",
  location: Location,
  options?: MutationOptions<void>,
) =>
  useMutation<void, AxiosError, void>(
    () =>
      requestServer<ICounter>({
        method: "post",
        url: `admin/counter`,
        body: { key, location },
      }),
    options,
  );
