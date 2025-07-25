import axios, { AxiosError } from "axios";
import { KakaoProfile } from "next-auth/providers/kakao";
import { useQuery } from "react-query";

import { UID_TO_USER, USER_INFO, USER_POINT_SYSTEM } from "../../constants/keys/queryKeys";
import { SERVER_URI } from "../../constants/system";
import { QueryOptions } from "../../types/hooks/reactTypes";
import { IUser } from "../../types/models/userTypes/userInfoTypes";
import { IPointLog } from "../../types/services/pointSystem";

export const useUserKakaoInfoQuery = (): {
  data: KakaoProfile["kakao_account"] | IUser;
  type: "kakao" | "user";
} => {
  const { data: userInfo } = useUserInfoQuery();

  if (!userInfo) return { data: null, type: null };

  return {
    data: userInfo?.kakao_account ?? userInfo,
    type: userInfo?.kakao_account ? "kakao" : "user",
  };
};

export const useUserInfoQuery = (options?: QueryOptions<IUser>) =>
  useQuery<IUser, AxiosError, IUser>(
    [USER_INFO],
    async () => {
      const res = await axios.get<IUser>(`${SERVER_URI}/user/profile`);

      return res.data;
    },
    options,
  );

interface ReviewMember {
  message: string;
  createdAt: string;
}

export const useUserReviewQuery = (uid: string, options?: QueryOptions<ReviewMember[]>) =>
  useQuery<ReviewMember[], AxiosError, ReviewMember[]>(
    [USER_INFO, uid, "review"],
    async () => {
      const res = await axios.get<ReviewMember[]>(
        `${SERVER_URI}/notice/temperature/mine?uid=${uid}`,
      );
      return res.data;
    },
    options,
  );

interface PointSystemResponse {
  score?: number;
  point?: number;
  deposit?: number;
}

export const usePointSystemQuery = (
  category: "score" | "point" | "deposit",
  isUserScope: boolean = true,
  options?: QueryOptions<number>,
) =>
  useQuery<number, AxiosError, number>(
    [USER_POINT_SYSTEM, category, isUserScope],
    async () => {
      const scopeQuery = isUserScope ? "" : "all";
      const res = await axios.get<PointSystemResponse>(
        `${SERVER_URI}/user/${category}/${scopeQuery}`,
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
    { ...options, staleTime: 0, cacheTime: 0 },
  );

export const usePointSystemLogQuery = (
  category: "score" | "point" | "deposit",
  scopeQuery?: "all",
  options?: QueryOptions<IPointLog[]>,
) =>
  useQuery<IPointLog[], AxiosError, IPointLog[]>(
    [USER_POINT_SYSTEM, category, scopeQuery, "log"],
    async () => {
      const res = await axios.get<IPointLog[]>(
        `${SERVER_URI}/log/${category}${scopeQuery ? `/${scopeQuery}` : ""}`,
        {
          params: {
            scope: scopeQuery === "all" ? "month" : null,
          },
        },
      );
      return res.data;
    },
    { ...options, staleTime: 0, cacheTime: 0 },
  );

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const usePointCuoponLogQuery = (scope?: "all", options?: QueryOptions<any | any[]>) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useQuery<any | any[], AxiosError, any | any[]>(
    ["pointLog", "coupon"],
    async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await axios.get<any | any[]>(`${SERVER_URI}/log/point/coupon`, {
        params: {
          scope,
        },
      });
      return res.data;
    },
    { ...options, staleTime: 0, cacheTime: 0 },
  );

export const useTicketSystemLogQuery = (
  category: "gather" | "groupStudy",
  options?: QueryOptions<IPointLog[]>,
) =>
  useQuery<IPointLog[], AxiosError, IPointLog[]>(
    [USER_POINT_SYSTEM, category, "log"],
    async () => {
      const res = await axios.get<IPointLog[]>(`${SERVER_URI}/log/ticket/${category}`);
      return res.data;
    },
    { ...options, staleTime: 0, cacheTime: 0 },
  );

export const useUserIdToUserInfoQuery = (userId: string, options?: QueryOptions<IUser>) =>
  useQuery<IUser, AxiosError, IUser>(
    [UID_TO_USER, userId],
    async () => {
      const res = await axios.get<IUser>(`${SERVER_URI}/user/profile/${userId}`);
      return res.data;
    },
    options,
  );
export const useUidsToUsersInfoQuery = (uids: string[], options?: QueryOptions<IUser[]>) =>
  useQuery<IUser[], AxiosError, IUser[]>(
    [UID_TO_USER, uids],
    async () => {
      const queryString = uids.map((uid) => `uids=${uid}`).join("&");
      const res = await axios.get<IUser[]>(`${SERVER_URI}/user/profiles?${queryString}`);
      return res.data;
    },
    options,
  );
