import axios, { AxiosError } from "axios";
import { useQuery } from "react-query";

import { SERVER_URI } from "../../constants/apiConstants";
import { Feed } from "../../constants/keys/queryKeys";
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

export const useFeedsQuery = (
  type?: FeedType,
  typeId?: number,
  cursor?: number,
  isRecent?: boolean,
  options?: QueryOptions<FeedProps[]>,
) =>
  useQuery<FeedProps[], AxiosError>(
    [Feed + "s", type, typeId, cursor, isRecent],
    async () => {
      const res = await axios.get<FeedProps[]>(`${SERVER_URI}/feed`, {
        params: { type, typeId, cursor, isRecent: isRecent === undefined ? true : isRecent },
      });
      return res.data;
    },
    options,
  );
