import axios, { AxiosError } from "axios";
import { useQuery } from "react-query";

import { USER_REQUEST } from "../../../constants/keys/queryKeys";
import { SERVER_URI } from "../../../constants/system";
import { QueryOptions } from "../../../types/hooks/reactTypes";
import { IUserRequest } from "../../../types/models/userTypes/userRequestTypes";

export const usePlazaQuery = (options?: QueryOptions<IUserRequest[]>) =>
  useQuery<IUserRequest[], AxiosError, IUserRequest[]>(
    [USER_REQUEST, "plaze"],
    async () => {
      const res = await axios.get<IUserRequest[]>(`${SERVER_URI}/plaza`);
      return res.data;
    },
    options,
  );
