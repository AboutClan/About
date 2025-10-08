import { AxiosError } from "axios";
import { useMutation } from "react-query";

import { requestServer } from "../../libs/methodHelpers";
import { MutationOptions } from "../../types/hooks/reactTypes";
import { GroupMemberRole, IGroup, IGroupWriting } from "../../types/models/groupTypes/group";

type GroupWritingParam<T> = T extends "post"
  ? { groupStudy: IGroupWriting }
  : T extends "patch"
  ? { groupStudy: IGroup }
  : { id: string };

/** group info */
export const useGroupWritingMutation = <T extends "post" | "patch" | "delete">(
  method: T,
  options?: MutationOptions<GroupWritingParam<T>>,
) =>
  useMutation<void, AxiosError, GroupWritingParam<T>>(
    (param) =>
      requestServer<GroupWritingParam<T>>({
        method,
        url: "groupStudy",
        body: param,
      }),
    options,
  );

interface IGroupParticipationRequest {
  id: number;
}

export const useGroupParticipationMutation = <T extends "post" | "delete">(
  method: T,
  id: number,
  options?: MutationOptions<void>,
) =>
  useMutation<void, AxiosError, void>(
    () =>
      requestServer<IGroupParticipationRequest>({
        method,
        url: "groupStudy/participate",
        body: { id },
      }),
    options,
  );

interface IExileUserParam extends ParamProps {
  id: number;
}
interface ParamProps {
  toUid: string;
  randomId?: number;
}

export const useGroupExileUserMutation = (id: number, options?: MutationOptions<ParamProps>) =>
  useMutation<void, AxiosError, ParamProps>(
    ({ toUid, randomId }) =>
      requestServer<IExileUserParam>({
        method: "delete",
        url: "groupStudy/participate/exile",
        body: { id, toUid, randomId },
      }),
    options,
  );
export const useGroupAttendUserMutation = (
  groupId: string,
  options?: MutationOptions<{ userId: string }>,
) =>
  useMutation<void, AxiosError, { userId: string }>(
    ({ userId }) =>
      requestServer<{ groupId: string; userId: string }>({
        method: "post",
        url: "groupStudy/weekAttend",
        body: { groupId, userId },
      }),
    options,
  );

// interface IGroupStatusRequest {
//   groupId: number;
//   status: Status;
// }

// export const useGroupStatusMutation = (GroupId: number, options?: MutationOptions<Status>) =>
//   useMutation<void, AxiosError, Status>(
//     (status) =>
//       requestServer<IGroupStatusRequest>({
//         method: "patch",
//         url: "groupStudy/status",
//         body: {
//           GroupId,
//           status,
//         },
//       }),
//     options,
//   );

interface IGroupMemberRoleRequest {
  groupId: number;
  userId: string;
  role: GroupMemberRole;
}

export const useGroupMemberRoleMutation = (
  groupId: number,
  options?: MutationOptions<{ userId: string; role: GroupMemberRole }>,
) =>
  useMutation<void, AxiosError, { userId: string; role: GroupMemberRole }>(
    (params) =>
      requestServer<IGroupMemberRoleRequest>({
        method: "patch",
        url: "groupStudy/role",
        body: {
          groupId,
          ...params,
        },
      }),
    options,
  );

interface IGroupWaitingParam {
  answer: string[];
  pointType: "point" | "deposit";
}

export const useGroupWaitingMutation = (
  id: number,
  options?: MutationOptions<IGroupWaitingParam>,
) =>
  useMutation<void, AxiosError, IGroupWaitingParam>(
    ({ answer, pointType }) =>
      requestServer<{
        id: number;
        answer: string[];
        pointType: "point" | "deposit";
      }>({
        method: "post",
        url: "groupStudy/waiting",
        body: {
          id,
          answer,
          pointType,
        },
      }),
    options,
  );

interface IWaitingStatusParam {
  status: "agree" | "refuse";
  userId: string;
}

interface IWaitingStatusRequest extends IWaitingStatusParam {
  id: number;
}

export const useGroupWaitingStatusMutation = (
  id: number,
  options?: MutationOptions<IWaitingStatusParam>,
) =>
  useMutation<void, AxiosError, IWaitingStatusParam>(
    ({ status, userId }) =>
      requestServer<IWaitingStatusRequest>({
        method: "post",
        url: "groupStudy/waiting/status",
        body: {
          id,
          status,
          userId,
        },
      }),
    options,
  );
export const useGroupInviteMutation = (
  id: string,
  options?: MutationOptions<IWaitingStatusParam>,
) =>
  useMutation<void, AxiosError, IWaitingStatusParam>(
    ({ userId }) =>
      requestServer<{ id: string; userId: string }>({
        method: "post",
        url: "groupStudy/invite",
        body: {
          id,
          userId,
        },
      }),
    options,
  );

export const useGroupDepositMutation = (
  id: string,
  options?: MutationOptions<{ deposit: number }>,
) =>
  useMutation<void, AxiosError, { deposit: number }>(
    ({ deposit }) =>
      requestServer<{ id: string; deposit: number }>({
        method: "post",
        url: "groupStudy/deposit",
        body: {
          id,
          deposit,
        },
      }),
    options,
  );

export const useGroupMonthAttendMutation = (
  groupId: string,
  options?: MutationOptions<{ userId: string }>,
) =>
  useMutation<void, AxiosError, { userId: string }>(
    ({ userId }) =>
      requestServer<{ groupId: string; userId: string; last: boolean }>({
        method: "post",
        url: "groupStudy/monthAttend",
        body: {
          groupId,
          userId,
          last: false,
        },
      }),
    options,
  );

export const useGroupAttendancePatchMutation = (id: number, options?: MutationOptions<void>) =>
  useMutation<void, AxiosError, void>(
    () =>
      requestServer<{ id: number }>({
        method: "patch",
        url: "groupStudy/attendance/confirm",
        body: {
          id,
        },
      }),
    options,
  );
