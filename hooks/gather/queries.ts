import axios, { AxiosError } from "axios";
import { useQuery } from "react-query";
import { GATHER_CONTENT } from "../../constants/keys/queryKeys";
import { SERVER_URI } from "../../constants/system";
import { IGatherSummary } from "../../pages/review";

import { QueryOptions } from "../../types/reactTypes";
import { IGather } from "../../types2/gatherTypes/gatherTypes";

export const useGatherQuery = (options?: QueryOptions<IGather[]>) =>
  useQuery<IGather[], AxiosError, IGather[]>(
    [GATHER_CONTENT],
    async () => {
      const res = await axios.get<IGather[]>(`${SERVER_URI}/gather`);
      return res.data;
    },
    options
  );
export const useGatherAllSummaryQuery = (
  options?: QueryOptions<IGatherSummary[]>
) =>
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
    options
  );
