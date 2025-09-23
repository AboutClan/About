import axios, { AxiosError } from "axios";
import { useQuery } from "react-query";

import { QueryOptions } from "../../types/hooks/reactTypes";
import { UserSimpleInfoProps } from "../../types/models/userTypes/userInfoTypes";
import { SERVER_URI } from "../system";

interface PrizeDataProps {
  category: "ranking" | "store" | "dailyAttend";
  date: string;
  description: string;
  gift: string;
  winner: UserSimpleInfoProps;
  _id: string;
}

export const usePrizeQuery = (
  cursor: number,
  category: "ranking" | "store" | null,
  options?: QueryOptions<PrizeDataProps[]>,
) =>
  useQuery<PrizeDataProps[], AxiosError, PrizeDataProps[]>(
    [cursor, category, "prize_data"],
    async () => {
      const res = await axios.get<PrizeDataProps[]>(
        `${SERVER_URI}/prize?cursor=${cursor}${category ? `&category=${category}` : ""}`,
      );

      return res.data;
    },
    options,
  );
