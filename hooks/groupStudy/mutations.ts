import { AxiosError } from "axios";
import { useMutation } from "react-query";
import { requestServer } from "../../helpers/methodHelpers";
import { IGroupStudy, IGroupStudyWriting } from "../../types/page/groupStudy";

import { MutationOptions } from "../../types/reactTypes";

type GroupStudyWritingParam<T> = T extends "post"
  ? { groupStudy: IGroupStudyWriting }
  : T extends "patch"
  ? { groupStudy: IGroupStudy }
  : { groupStudyId: number };

/** groupstudy info */
export const useGroupStudyWritingMutation = <
  T extends "post" | "patch" | "delete"
>(
  method: T,
  options?: MutationOptions<GroupStudyWritingParam<T>>
) =>
  useMutation<void, AxiosError, GroupStudyWritingParam<T>>(
    (param) =>
      requestServer<GroupStudyWritingParam<T>>({
        method,
        url: "groupStudy",
        body: param,
      }),
    options
  );

type GroupStudyParticipationParam<T> = T extends "post"
  ? "first" | "second"
  : void;

interface IGroupStudyParticipationRequest<T> {
  groupStudyId: number;
  phase?: GroupStudyParticipationParam<T>;
}

export const useGroupStudyParticipationMutation = <T extends "post" | "delete">(
  method: T,
  groupStudyId: number,
  options?: MutationOptions<GroupStudyParticipationParam<T>>
) =>
  useMutation<void, AxiosError, GroupStudyParticipationParam<T>>(
    (param) =>
      requestServer<IGroupStudyParticipationRequest<T>>({
        method,
        url: "groupStudy/participate",
        body: { groupStudyId, phase: param },
      }),
    options
  );

type GroupStudyCommentParam<T> = T extends "post"
  ? {
      comment: string;
      commentId?: string;
    }
  : T extends "patch"
  ? {
      comment: string;
      commentId: string;
    }
  : {
      comment?: never;
      commentId: string;
    };
interface IGroupStudyCommentRequest<T> {
  groupstudyId: number;
  comment?: string;
  commentId?: string;
}
export const useGroupStudyCommentMutation = <
  T extends "post" | "patch" | "delete"
>(
  method: T,
  groupstudyId: number,
  options?: MutationOptions<GroupStudyCommentParam<T>>
) =>
  useMutation<void, AxiosError, GroupStudyCommentParam<T>>(
    (param) =>
      requestServer<IGroupStudyCommentRequest<T>>({
        method,
        url: "groupstudy/comment",
        body: {
          groupstudyId,
          comment: param?.comment,
          commentId: param?.commentId,
        },
      }),
    options
  );

type Status = "pending" | "open" | "close" | "end";

interface IGroupStudyStatusRequest {
  groupstudyId: number;
  status: Status;
}

export const useGroupStudyStatusMutation = (
  groupstudyId: number,
  options?: MutationOptions<Status>
) =>
  useMutation<void, AxiosError, Status>(
    (status) =>
      requestServer<IGroupStudyStatusRequest>({
        method: "patch",
        url: "groupstudy/status",
        body: {
          groupstudyId,
          status,
        },
      }),
    options
  );