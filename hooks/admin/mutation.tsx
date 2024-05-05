import axios, { AxiosError } from "axios";
import { Dayjs } from "dayjs";
import { useMutation } from "react-query";

import { SERVER_URI } from "../../constants/system";
import { requestServer } from "../../libs/methodHelpers";
import { MutationOptions } from "../../types/hooks/reactTypes";
import { IPointSystem } from "../../types/services/pointSystem";
import { dayjsToStr } from "../../utils/dateTimeUtils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useUpdateProfileMutation = (options?: MutationOptions<any>) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useMutation<void, AxiosError, any>(async (profile) => {
    await axios.post(`${SERVER_URI}/admin/user`, {
      profile,
    });
  }, options);

interface IAdminPointSystemParam extends IAdminPointSystemRequest {
  uid: string;
  type: "point" | "deposit" | "score";
}

interface IAdminPointSystemRequest {
  value: number;
  message: string;
}

export const useAdminPointSystemMutation = (options?: MutationOptions<IAdminPointSystemParam>) =>
  useMutation<void, AxiosError, IAdminPointSystemParam>(
    async (param) =>
      requestServer<IAdminPointSystemRequest>({
        method: "post",
        url: `admin/user/${param.uid}/${param.type}`,
        body: { value: param.value, message: param.message },
      }),
    options,
  );

export const useAdminAboutPointMutation = (uid: string, options?: MutationOptions<IPointSystem>) =>
  useMutation<void, AxiosError, IPointSystem>(async (data) => {
    await axios.post(`${SERVER_URI}/admin/user/${uid}/point`, data);
    await axios.post(`${SERVER_URI}/admin/user/${uid}/score`, data);
  }, options);

export const useAdminPointMutation = (uid: string, options?: MutationOptions<IPointSystem>) =>
  useMutation<void, AxiosError, IPointSystem>(async (data) => {
    await axios.post(`${SERVER_URI}/admin/user/${uid}/point`, data);
  }, options);

export const useAdminScoreMutation = (uid: string, options?: MutationOptions<IPointSystem>) =>
  useMutation<void, AxiosError, IPointSystem>(async (data) => {
    await axios.post(`${SERVER_URI}/admin/user/${uid}/score`, data);
  }, options);

export const useAdminDepositMutation = (uid: string, options?: MutationOptions<IPointSystem>) =>
  useMutation<void, AxiosError, IPointSystem>(async (data) => {
    await axios.post(`${SERVER_URI}/admin/user/${uid}/deposit`, data);
  }, options);

export const useVoteStatusResetMutation = (options?: MutationOptions<Dayjs>) =>
  useMutation<void, AxiosError, Dayjs>(
    (date: Dayjs) =>
      requestServer<Dayjs>({
        method: "patch",
        url: `admin/vote/${dayjsToStr(date)}/reset`,
      }),
    options,
  );

export const useMonthCalcMutation = (options?: MutationOptions) =>
  useMutation<void, AxiosError, void>(
    () =>
      requestServer<Dayjs>({
        method: "patch",
        url: "admin/manage/monthCalc",
      }),
    options,
  );
export const useGroupBelongMatchMutation = (options?: MutationOptions) =>
  useMutation<void, AxiosError, void>(
    () =>
      requestServer({
        method: "patch",
        url: "groupStudy/belong/match",
      }),
    options,
  );
