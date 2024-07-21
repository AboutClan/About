import { AxiosError } from "axios";
import { useMutation } from "react-query";

import { requestServer } from "../../libs/methodHelpers";
import { MutationOptions } from "../../types/hooks/reactTypes";
import { IGather, IGatherWriting } from "../../types/models/gatherTypes/gatherTypes";

type GatherWritingParam<T> = T extends "post"
  ? { gather: IGatherWriting }
  : T extends "patch"
    ? { gather: IGather }
    : { gatherId: number };

/** gather info */
export const useGatherWritingMutation = <T extends "post" | "patch" | "delete">(
  method: T,
  options?: MutationOptions<GatherWritingParam<T>>,
) =>
  useMutation<void, AxiosError, GatherWritingParam<T>>(
    (param) =>
      requestServer<GatherWritingParam<T>>({
        method,
        url: "gather",
        body: param,
      }),
    options,
  );

type GatherParticipationParam<T> = T extends "post"
  ? { phase: "first" | "second"; userId?: string }
  : void;

interface IGatherParticipationRequest {
  gatherId: number;
  phase?: "first" | "second";
  userId?: string;
}

export const useGatherParticipationMutation = <T extends "post" | "delete">(
  method: T,
  gatherId: number,
  options?: MutationOptions<GatherParticipationParam<T>>,
) =>
  useMutation<void, AxiosError, GatherParticipationParam<T>>(
    (param) =>
      requestServer<IGatherParticipationRequest>({
        method,
        url: "gather/participate",
        body: { gatherId, ...param },
      }),
    options,
  );

type Status = "pending" | "open" | "close" | "end";

interface IGatherStatusRequest {
  gatherId: number;
  status: Status;
}

export const useGatherStatusMutation = (gatherId: number, options?: MutationOptions<Status>) =>
  useMutation<void, AxiosError, Status>(
    (status) =>
      requestServer<IGatherStatusRequest>({
        method: "patch",
        url: "gather/status",
        body: {
          gatherId,
          status,
        },
      }),
    options,
  );
