import axios, { AxiosError } from "axios";
import { useQuery } from "react-query";

import {
  UID_TO_USER,
  USER_INFO,
  USER_POINT_SYSTEM,
} from "../../constants/keys/queryKeys";
import { SERVER_URI } from "../../constants/system";
import { QueryOptions } from "../../types/reactTypes";
import { IPointLog } from "../../types/user/pointSystem";
import { IUser } from "../../types/user/user";

export const useUserInfoQuery = (options?: QueryOptions<IUser>) =>
  useQuery<IUser, AxiosError, IUser>(
    [USER_INFO],
    async () => {
      const res = await axios.get<IUser>(`${SERVER_URI}/user/profile`);
      return res.data;
    },
    options
  );

interface PointSystemResponse {
  score?: number;
  point?: number;
  deposit?: number;
}

export const usePointSystemQuery = (
  category: "score" | "point" | "deposit",
  isUserScope: boolean = true,
  options?: QueryOptions<number>
) =>
  useQuery<number, AxiosError, number>(
    [USER_POINT_SYSTEM, category, isUserScope],
    async () => {
      const scopeQuery = isUserScope ? "" : "all";
      const res = await axios.get<PointSystemResponse>(
        `${SERVER_URI}/user/${category}/${scopeQuery}`
      );
      switch (category) {
        case "score":
          return res.data?.score;
        case "point":
          return res.data?.point;
        case "deposit":
          return res.data?.deposit;
      }
    },
    { ...options, staleTime: 0, cacheTime: 0 }
  );

export const usePointSystemLogQuery = (
  category: "score" | "point" | "deposit",
  isUserScope: boolean = true,
  options?: QueryOptions<IPointLog[]>
) =>
  useQuery<IPointLog[], AxiosError, IPointLog[]>(
    [USER_POINT_SYSTEM, category, isUserScope],
    async () => {
      const scopeQuery = isUserScope ? "" : "all";
      const res = await axios.get<IPointLog[]>(
        `${SERVER_URI}/log/${category}/${scopeQuery}`
      );
      return res.data;
    },
    { ...options, staleTime: 0, cacheTime: 0 }
  );

export const useUidToUserInfoQuery = (
  uid: string,
  options?: QueryOptions<IUser>
) =>
  useQuery<IUser, AxiosError, IUser>(
    [UID_TO_USER],
    async () => {
      const res = await axios.get<IUser>(`${SERVER_URI}/user/profile/${uid}`);
      return res.data;
    },
    options
  );
export const useUidsToUsersInfoQuery = (
  uids: string[],
  options?: QueryOptions<IUser[]>
) =>
  useQuery<IUser[], AxiosError, IUser[]>(
    [UID_TO_USER, uids],
    async () => {
      const queryString = uids.map((uid) => `uids=${uid}`).join("&");
      const res = await axios.get<IUser[]>(
        `${SERVER_URI}/user/profiles?${queryString}`
      );
      return res.data;
    },
    options
  );
