import axios, { AxiosError } from "axios";
import { useQuery } from "react-query";

import { GATHER_CONTENT } from "@/constants/keys/queryKeys";
import { SERVER_URI } from "@/constants/system";
import { IGatherSummary } from "@/pages/review";
import { QueryOptions } from "@/types/hooks/reactTypes";
import { FeedProps } from "@/types/models/feed";
import { GatherRequestProps, IGather } from "@/types/models/gatherTypes/gatherTypes";

export type GatherFilterType = "모집중" | "마감 임박" | "인기 모임" | null;

export const useGatherQuery = (
  cursor?: number,
  category?: GatherFilterType,
  sortBy?: "createdAt" | "date" | "basic",
  mode?: "future" | "past",
  options?: QueryOptions<IGather[]>,
) =>
  useQuery<IGather[], AxiosError>(
    [GATHER_CONTENT, category, sortBy, cursor, mode],
    async () => {
      const res = await axios.get<IGather[]>(`${SERVER_URI}/gather`, {
        params: { cursor, category, sortBy, mode },
      });

      return res.data;
    },
    options,
  );

export type HomeGatherSectionKey = "regular" | "upcoming" | "past" | "partner";

/** 홈 번개 섹션별 모임(각 최대 3개) */
export const useHomeGatherSectionsQuery = (
  options?: QueryOptions<Record<HomeGatherSectionKey, IGather[]>>,
) =>
  useQuery<Record<HomeGatherSectionKey, IGather[]>, AxiosError>(
    [GATHER_CONTENT, "homeSections"],
    async () => {
      const res = await axios.get<Record<HomeGatherSectionKey, IGather[]>>(`${SERVER_URI}/gather`, {
        params: { cursor: -2 },
      });
      return res.data;
    },
    options,
  );

/** 상시 행사에서 확정돼 따로 만든 모임 목록 (최신순) */
export const useGatherChildrenQuery = (parentGatherId: number, options?: QueryOptions<IGather[]>) =>
  useQuery<IGather[], AxiosError>(
    [GATHER_CONTENT, "children", parentGatherId],
    async () => {
      const res = await axios.get<IGather[]>(`${SERVER_URI}/gather/children`, {
        params: { parentGatherId },
      });
      return res.data;
    },
    options,
  );

export const useGatherCountQuery = (userId: string, options?: QueryOptions<number>) =>
  useQuery<number, AxiosError>(
    [GATHER_CONTENT, "groupCount", userId],
    async () => {
      const res = await axios.get<number>(`${SERVER_URI}/gather/count`, {
        params: { userId },
      });
      if (userId === "62a44519f4a6968c58fedb88") return res.data - 600;
      return res.data;
    },
    options,
  );
export const useGatherGroupQuery = (id: string, options?: QueryOptions<IGather[]>) =>
  useQuery<IGather[], AxiosError>(
    [GATHER_CONTENT, "group", id],
    async () => {
      const res = await axios.get<IGather[]>(`${SERVER_URI}/gather/group`, {
        params: { groupId: id },
      });
      return res.data;
    },
    options,
  );
export const useGroupFeedsQuery = (id: string, options?: QueryOptions<FeedProps[]>) =>
  useQuery<FeedProps[], AxiosError>(
    [GATHER_CONTENT, "group", "feed", id],
    async () => {
      const res = await axios.get<FeedProps[]>(`${SERVER_URI}/feed/groupStudy`, {
        params: { groupId: id },
      });
      return res.data;
    },
    options,
  );

export const useGatherMyStatusQuery = (
  cursor?: number,
  userId?: string,
  options?: QueryOptions<IGather[]>,
) =>
  useQuery<IGather[], AxiosError>(
    [GATHER_CONTENT, "status", cursor, userId],
    async () => {
      const res = await axios.get<IGather[]>(`${SERVER_URI}/gather/status`, {
        params: { cursor, userId },
      });
      return res.data;
    },
    options,
  );

export const useGatherIDQuery = (gatherId: number, options?: QueryOptions<IGather>) =>
  useQuery<IGather, AxiosError, IGather>(
    [GATHER_CONTENT, gatherId + ""],
    async () => {
      const res = await axios.get<IGather>(`${SERVER_URI}/gather`, {
        params: { gatherId },
      });

      const data = res.data;
      return data;
    },
    options,
  );

export const useGatherAllSummaryQuery = (options?: QueryOptions<IGatherSummary[]>) =>
  useQuery<IGatherSummary[], AxiosError, IGatherSummary[]>(
    [GATHER_CONTENT, "summary"],
    async () => {
      const res = await axios.get<IGather[]>(`${SERVER_URI}/gather`);
      const data = res.data.map((item) => ({
        title: item.title,
        type: item.type,
        location: item.location,
        date: item.date,
        id: item.id,
        place: item.place,
      }));
      return data;
    },
    options,
  );

export const useGatherReviewOneQuery = (options?: QueryOptions<IGather>) =>
  useQuery<IGather, AxiosError, IGather>(
    [GATHER_CONTENT, "review"],
    async () => {
      const res = await axios.get<IGather>(`${SERVER_URI}/gather/review`);
      return res.data;
    },
    options,
  );
export interface ReviewableGatherProps {
  id: number;
  title: string;
  date: string;
}

export const useGatherReviewListQuery = (options?: QueryOptions<ReviewableGatherProps[]>) =>
  useQuery<ReviewableGatherProps[], AxiosError, ReviewableGatherProps[]>(
    [GATHER_CONTENT, "review", "list"],
    async () => {
      const res = await axios.get<ReviewableGatherProps[]>(`${SERVER_URI}/gather/review/list`);
      return res.data;
    },
    options,
  );
export const useGatherRequestQuery =(options?: QueryOptions<GatherRequestProps[]>) =>
  useQuery<GatherRequestProps[], AxiosError, GatherRequestProps[]>(
    ["gatherRequest"],
    async () => {
      const res = await axios.get<GatherRequestProps[]>(`${SERVER_URI}/gatherRequest`);
      return res.data;
    },
    options,
  );
