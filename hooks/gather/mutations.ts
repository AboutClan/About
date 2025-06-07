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
  ? { phase: "first" | "second"; isFree?: boolean; userId?: string }
  : { userId?: string } | void;

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

export const useGatherExileMutation = (
  gatherId: number,
  options?: MutationOptions<{ userId: string }>,
) =>
  useMutation<void, AxiosError, { userId: string }>(
    (param) =>
      requestServer<{ gatherId: number; userId: string }>({
        method: "post",
        url: "gather/exile",
        body: { gatherId, ...param },
      }),
    options,
  );

export const useGatherInviteMutation = (
  gatherId: number,
  options?: MutationOptions<{ phase: "first" | "second"; userId?: string }>,
) =>
  useMutation<void, AxiosError, { phase: "first" | "second"; userId?: string }>(
    (param) =>
      requestServer<IGatherParticipationRequest>({
        method: "post",
        url: "gather/invite",
        body: { gatherId, ...param },
      }),
    options,
  );

interface IGatherWaitingRequest {
  id: number;
  phase?: "first" | "second";
  userId?: string;
}

interface IGatherWaitingParam {
  phase: "first" | "second";
}

export const useGatherWaitingMutation = (
  gatherId: number,
  options?: MutationOptions<IGatherWaitingParam>,
) =>
  useMutation<void, AxiosError, IGatherWaitingParam>(
    ({ phase }) =>
      requestServer<IGatherWaitingRequest>({
        method: "post",
        url: "gather/waiting",
        body: { id: gatherId, phase },
      }),
    options,
  );

interface IGatherWaitingStuatusParam {
  userId: string;
  status: "agree" | "refuse";
  text?: string;
}
interface IGatherWaitingStatusRequest {
  id: number;
  status: "agree" | "refuse";
  userId: string;
  text?: string;
}

export const useGatherWaitingStatusMutation = (
  gatherId: number,
  options?: MutationOptions<IGatherWaitingStuatusParam>,
) =>
  useMutation<void, AxiosError, IGatherWaitingStuatusParam>(
    ({ status, userId, text }) =>
      requestServer<IGatherWaitingStatusRequest>({
        method: "post",
        url: "gather/waiting/status",
        body: { id: gatherId, userId, status, text },
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
