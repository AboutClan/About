import axios, { AxiosError } from "axios";
import { useQuery } from "react-query";

import { STORE_GIFT } from "../../../constants/keys/queryKeys";
import { SERVER_URI } from "../../../constants/system";
import { QueryOptions } from "../../../types/hooks/reactTypes";
import { IStoreQuery, StoreGiftProps } from "../../../types/models/store";
import { shuffleArray } from "../../../utils/convertUtils/convertDatas";

export const useStoreQuery = (
  status: "pending" | "end",
  cursor: number,
  options?: QueryOptions<StoreGiftProps[]>,
) =>
  useQuery<StoreGiftProps[], AxiosError, StoreGiftProps[]>(
    ["store", status, cursor],
    async () => {
      const res = await axios.get<StoreGiftProps[]>(
        `${SERVER_URI}/store?status=${status}&cursor=${cursor}`,
      );
      return [...shuffleArray(res.data.map((data) => ({ ...data, point: data.point * 0.9 })))];
    },
    options,
  );

export const useStoreGiftQuery = (giftId: string, options?: QueryOptions<StoreGiftProps>) =>
  useQuery<StoreGiftProps, AxiosError, StoreGiftProps>(
    ["store", "gift", giftId],
    async () => {
      const res = await axios.get<StoreGiftProps>(`${SERVER_URI}/store/${giftId}`);
      return res.data;
    },
    options,
  );

export const useStoreGiftEntryQuery = (options?: QueryOptions<IStoreQuery>) =>
  useQuery<IStoreQuery, AxiosError, IStoreQuery>(
    [STORE_GIFT],
    async () => {
      const res = await axios.get<IStoreQuery>(`/api/store`);
      return res.data;
    },
    options,
  );
