import axios, { AxiosResponse } from "axios";

import { SERVER_URI } from "../constants/system";

interface IRequestParams<T, M> {
  method: "post" | "patch" | "delete" | "put";
  url: string;
  body?: T;
  return?: M;
}

export const requestServer = async <T, M = void>({
  method,
  url,
  body,
}: IRequestParams<T, M>): Promise<M> => {
  console.log(method, url, body);
  switch (method) {
    case "post": {
      const res = await axios.post<M>(`${SERVER_URI}/${url}`, body);
      return res.data;
    }
    case "patch": {
      const res = await axios.patch<M, AxiosResponse<M>, T>(`${SERVER_URI}/${url}`, body);
      return res.data;
    }
    case "delete":
      return axios.delete(`${SERVER_URI}/${url}`, { data: body });
    case "put":
      return axios.put(`${SERVER_URI}/${url}`, { data: body });

    default:
      throw new Error("Invalid HTTP method");
  }
};
