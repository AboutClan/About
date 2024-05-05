import axios, { AxiosError } from "axios";
import { useQuery, UseQueryOptions } from "react-query";

import { SERVER_URI } from "../../../constants/system";
import { Location } from "../../../types/services/locationTypes";

export const useCounterQuery = (
  key: "enthusiasticMember",
  location: Location,
  options?: Omit<UseQueryOptions<number, AxiosError, number>, "queryKey" | "queryFn">,
) =>
  useQuery<number, AxiosError, number>(
    ["counter", key, location],
    async () => {
      const res = await axios.get<number>(`${SERVER_URI}/admin/counter`, {
        params: { key, location },
      });
      return res.data;
    },
    options,
  );
