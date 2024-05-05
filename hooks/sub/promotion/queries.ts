import axios, { AxiosError } from "axios";
import { useQuery, UseQueryOptions } from "react-query";

import { SERVER_URI } from "../../../constants/system";
import { IPromotionApply } from "../../../types/models/promotion";

export const usePromotionQuery = (
  options?: Omit<
    UseQueryOptions<IPromotionApply[], AxiosError, IPromotionApply[]>,
    "queryKey" | "queryFn"
  >,
) =>
  useQuery<IPromotionApply[], AxiosError, IPromotionApply[]>(
    "promotion",
    async () => {
      const res = await axios.get<IPromotionApply[]>(`${SERVER_URI}/user/promotion`);
      return res.data;
    },
    options,
  );
