import axios, { AxiosError } from "axios";
import { useMutation } from "react-query";

import { SERVER_URI } from "../../constants/system";
import { requestServer } from "../../libs/methodHelpers";
import { IApplyRest } from "../../modals/userRequest/RequestRestModal/RequestRestModal";
import { MutationOptions } from "../../types/hooks/reactTypes";
import {
  IAvatar,
  IUser,
  IUserRegisterFormWriting,
  LocationDeatilProps,
  UserRole,
} from "../../types/models/userTypes/userInfoTypes";
import { IPointSystem } from "../../types/services/pointSystem";

export const useUserRegisterMutation = (options?: MutationOptions<IUserRegisterFormWriting>) =>
  useMutation<void, AxiosError, IUserRegisterFormWriting>(
    (param) =>
      requestServer<IUserRegisterFormWriting>({
        method: "post",
        url: `register`,
        body: param,
      }),
    options,
  );

export const useUserRegisterControlMutation = <T extends "post" | "delete">(
  method: T,
  options?: MutationOptions<string>,
) =>
  useMutation<void, AxiosError, string>(
    (param) =>
      requestServer<{ uid: string }>({
        method,
        url: `register/approval`,
        body: { uid: param },
      }),
    options,
  );

export const useUserInfoMutation = (options?: MutationOptions<IUser>) =>
  useMutation<void, AxiosError, IUser>(
    (param) =>
      requestServer<IUser>({
        method: "post",
        url: `user/profile`,
        body: param,
      }),
    options,
  );

type UserInfoFieldParam<T> = T extends "avatar"
  ? IAvatar
  : T extends "role"
    ? { role: UserRole }
    : T extends "rest"
      ? { info: IApplyRest }
      : T extends "belong"
        ? { uid: string; belong: string }
        : T extends "isPrivate"
          ? { isPrivate: boolean }
          : T extends "instagram"
            ? { instagram: string }
            : T extends "comment"
              ? { comment: string }
              : T extends "locationDetail"
                ? LocationDeatilProps
                : null;

export const useUserInfoFieldMutation = <
  T extends
    | "avatar"
    | "comment"
    | "role"
    | "rest"
    | "belong"
    | "isPrivate"
    | "instagram"
    | "locationDetail",
>(
  field: T,
  options?: MutationOptions<UserInfoFieldParam<T>>,
) =>
  useMutation<void, AxiosError, UserInfoFieldParam<T>>(
    (param) =>
      requestServer<UserInfoFieldParam<T>>({
        method: "patch",
        url: `user/${field}`,
        body: param,
      }),
    options,
  );

export const usePointSystemMutation = (
  field: "point" | "score" | "deposit",
  options?: MutationOptions<IPointSystem>,
) =>
  useMutation<void, AxiosError, IPointSystem>((param) => {
    const body = {
      [field]: param.value,
      message: param.message,
      sub: param.sub,
    };
    return requestServer<typeof body>({
      method: "patch",
      url: `user/${field}`,
      body,
    });
  }, options);

export const useAboutPointMutation = (options?: MutationOptions<IPointSystem>) =>
  useMutation<void, AxiosError, IPointSystem>(async ({ value, message, sub }) => {
    await Promise.all([
      axios.patch(`${SERVER_URI}/user/point`, { point: value, message, sub }),
      axios.patch(`${SERVER_URI}/user/score`, { score: value, message, sub }),
    ]);
  }, options);

export const useScoreMutation = (options?: MutationOptions<IPointSystem>) =>
  useMutation<void, AxiosError, IPointSystem>(
    async ({ value, message, sub }) =>
      await axios.patch(`${SERVER_URI}/user/score`, { score: value, message, sub }),
    options,
  );

export const useUserUpdateProfileImageMutation = (options?: MutationOptions<void>) =>
  useMutation<void, AxiosError, void>(async () => {
    await axios.patch("/api/user/profile");
  }, options);

export const useUserFriendMutation = (
  method: "patch" | "delete",
  options?: MutationOptions<string>,
) =>
  useMutation<void, AxiosError, string>(
    (param) =>
      requestServer<{ toUid: string }>({
        method,
        url: `user/friend`,
        body: { toUid: param },
      }),
    options,
  );
