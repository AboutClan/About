import axios, { AxiosError } from "axios";
import { useQuery, UseQueryOptions } from "react-query";

import { NOTICE_ACTIVE_LOG, NOTICE_HEART_LOG } from "../../../../constants/keys/queryKeys";
import { SERVER_URI } from "../../../../constants/system";
import { INoticeActiveLog } from "../../../../types/globals/interaction";
import { QueryOptions } from "../../../../types/hooks/reactTypes";

export const useNoticeActiveLogQuery = (
  type?: "like" | "friend" | "alphabet",
  isRecent?: boolean,
  options?: QueryOptions<INoticeActiveLog[]>,
) =>
  useQuery<INoticeActiveLog[], AxiosError, INoticeActiveLog[]>(
    [NOTICE_ACTIVE_LOG, type, isRecent],
    async () => {
      console.log(25, isRecent);
      const res = await axios.get<INoticeActiveLog[]>(`${SERVER_URI}/notice`, {
        params: { isRecent },
      });
      if (type) return res.data.filter((item) => item.type === type);
      return res.data;
    },
    options,
  );

export const useInteractionLikeQuery = (
  options?: Omit<
    UseQueryOptions<INoticeActiveLog[], AxiosError, INoticeActiveLog[]>,
    "queryKey" | "queryFn"
  >,
) =>
  useQuery<INoticeActiveLog[], AxiosError, INoticeActiveLog[]>(
    [NOTICE_HEART_LOG],
    async () => {
      const res = await axios.get<INoticeActiveLog[]>(`${SERVER_URI}/notice/like`);
      return res.data;
    },
    options,
  );
export const useLikeAllQuery = (
  options?: Omit<
    UseQueryOptions<INoticeActiveLog[], AxiosError, INoticeActiveLog[]>,
    "queryKey" | "queryFn"
  >,
) =>
  useQuery<INoticeActiveLog[], AxiosError, INoticeActiveLog[]>(
    "likeAll",
    async () => {
      const res = await axios.get<INoticeActiveLog[]>(`${SERVER_URI}/notice/like/all`);
      return res.data;
    },
    options,
  );
