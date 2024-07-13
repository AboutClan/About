import axios, { AxiosError } from "axios";
import { useQuery } from "react-query";

import { GATHER_CONTENT } from "../../constants/keys/queryKeys";
import { SERVER_URI } from "../../constants/system";
import { IGatherSummary } from "../../pages/review";
import { QueryOptions } from "../../types/hooks/reactTypes";
import { IGather } from "../../types/models/gatherTypes/gatherTypes";

type GatherResponse<T> = T extends number ? IGather : IGather[];

export const useGatherQuery = <T extends number | undefined>(
  gatherId?: T,
  cursor?: number,
  options?: QueryOptions<GatherResponse<T>>,
) =>
  useQuery<GatherResponse<T>, AxiosError>(
    [GATHER_CONTENT, gatherId, cursor],
    async () => {
      const res = await axios.get<GatherResponse<T>>(`${SERVER_URI}/gather`, {
        params: { gatherId, cursor },
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
