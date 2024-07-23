import axios, { AxiosError } from "axios";
import { useQuery } from "react-query";

import { SERVER_URI } from "../../constants/apiConstants";
import { Feed } from "../../constants/keys/queryKeys";
import { QueryOptions } from "../../types/hooks/reactTypes";
import { FeedProps } from "../../types/models/feed";

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
export const useFeedsQuery = (cursor?: number, options?: QueryOptions<FeedProps[]>) =>
  useQuery<FeedProps[], AxiosError>(
    [Feed + "s", cursor],
    async () => {
      const res = await axios.get<FeedProps[]>(`${SERVER_URI}/feed`);
      return res.data;
    },
    options,
  );
