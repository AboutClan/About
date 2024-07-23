import axios, { AxiosError } from "axios";
import { useQuery } from "react-query";

import { SERVER_URI } from "../../constants/apiConstants";
import { Feed } from "../../constants/keys/queryKeys";
import { QueryOptions } from "../../types/hooks/reactTypes";
import { FeedProps } from "../../types/models/feed";

export const useFeedQuery = (cursor?: number, options?: QueryOptions<FeedProps[]>) =>
  useQuery<FeedProps[], AxiosError>(
    [Feed, cursor],
    async () => {
      const res = await axios.get<FeedProps[]>(`${SERVER_URI}/feed`, {
        params: { cursor },
      });
      return res.data;
    },
    options,
  );
