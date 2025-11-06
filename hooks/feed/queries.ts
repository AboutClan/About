import axios, { AxiosError } from "axios";
import { useQuery } from "react-query";

import { Feed } from "../../constants/keys/queryKeys";
import { SERVER_URI } from "../../constants/system";
import { QueryOptions } from "../../types/hooks/reactTypes";
import { FeedProps, FeedType } from "../../types/models/feed";

export const useFeedQuery = (id: string, options?: QueryOptions<FeedProps>) =>
  useQuery<FeedProps, AxiosError>(
    [Feed, id],
    async () => {
      const res = await axios.get<FeedProps>(`${SERVER_URI}/feed`, {
        params: { id },
      });
      return res.data;
    },
    options,
  );

export const useFeedTypeQuery = (
  selfType: "mine" | "receive",
 
  options?: QueryOptions<FeedProps[]>,
) =>
  useQuery<FeedProps[], AxiosError>(
    [Feed, selfType],
    async () => {
      const res = await axios.get<FeedProps[]>(`${SERVER_URI}/feed/${selfType}`);
      return res.data;
    },
    options,
  );
export const useFeedCntQuery = (
  options?: QueryOptions<{ writtenReviewCnt: number; reviewReceived:number }>,
) =>
  useQuery<{ writtenReviewCnt: number; reviewReceived:number }, AxiosError>(
    [Feed, "cnt"],
    async () => {
      const res = await axios.get<{ writtenReviewCnt: number; reviewReceived:number }>(
        `${SERVER_URI}/feed/written`,
      );
      return res.data;
    },
    options,
  );

export const useFeedsQuery = (
  type?: FeedType,
  typeId?: number,
  cursor?: number,
  isRecent?: boolean,
  options?: QueryOptions<FeedProps[] | FeedProps>,
) =>
  useQuery<FeedProps[] | FeedProps, AxiosError>(
    [Feed + "s", type, typeId, cursor, isRecent],
    async () => {
      const res = await axios.get<FeedProps[] | FeedProps>(`${SERVER_URI}/feed`, {
        params: { type, typeId, cursor, isRecent: isRecent === undefined ? true : isRecent },
      });
      return res.data;
    },
    options,
  );
