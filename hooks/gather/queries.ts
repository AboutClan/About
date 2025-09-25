import axios, { AxiosError } from "axios";
import { useQuery } from "react-query";

import { GATHER_CONTENT } from "../../constants/keys/queryKeys";
import { SERVER_URI } from "../../constants/system";
import { IGatherSummary } from "../../pages/review";
import { QueryOptions } from "../../types/hooks/reactTypes";
import { FeedProps } from "../../types/models/feed";
import { GatherRequestProps, IGather } from "../../types/models/gatherTypes/gatherTypes";

export const useGatherQuery = (
  cursor?: number,
  category?: "스터디" | "취미" | null,
  sortBy?: "createdAt" | "date" | "basic",
  options?: QueryOptions<IGather[]>,
) =>
  useQuery<IGather[], AxiosError>(
    [GATHER_CONTENT, category, sortBy, cursor],
    async () => {
      const res = await axios.get<IGather[]>(`${SERVER_URI}/gather`, {
        params: { cursor, category, sortBy },
      });

      return res.data;
    },
    options,
  );

export const useGatherGroupQuery = (id: string, options?: QueryOptions<IGather[]>) =>
  useQuery<IGather[], AxiosError>(
    [GATHER_CONTENT, "group", id],
    async () => {
      const res = await axios.get<IGather[]>(`${SERVER_URI}/gather/group`, {
        params: { type: "group", groupId: id },
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
  status?: "isParticipating" | "isEnded" | "isOwner",
  options?: QueryOptions<IGather[]>,
) =>
  useQuery<IGather[], AxiosError>(
    [GATHER_CONTENT, "status", cursor, status],
    async () => {
      const res = await axios.get<IGather[]>(`${SERVER_URI}/gather/status`, {
        params: { cursor, status },
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
      return res.data;
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
export const useGatherRequestQuery = (options?: QueryOptions<GatherRequestProps[]>) =>
  useQuery<GatherRequestProps[], AxiosError, GatherRequestProps[]>(
    ["gatherRequest"],
    async () => {
      const res = await axios.get<GatherRequestProps[]>(`${SERVER_URI}/gatherRequest`);
      return res.data;
    },
    options,
  );
