import axios, { AxiosError } from "axios";
import { useQuery } from "react-query";

import { SERVER_URI } from "../../constants/system";
import { QueryOptions } from "../../types/hooks/reactTypes";
import type {
  SecretSquareCategory,
  SecretSquareCategoryWithAll,
  SecretSquareItem,
  SecretSquareType,
} from "../../types/models/square";

export type SecretSquareListResponse = {
  squareList: {
    _id: string;
    category: SecretSquareCategory;
    title: string;
    content: string;
    type: SecretSquareType;
    viewCount: number;
    thumbnail: string;
    likeCount: number;
    commentsCount: number;
    createdAt: string;
  }[];
};
export const useSecretSquareListQuery = (
  { category, cursor }: { category: SecretSquareCategoryWithAll; cursor: number },
  options?: QueryOptions<SecretSquareListResponse>,
) =>
  useQuery<SecretSquareListResponse, AxiosError, SecretSquareListResponse>(
    ["secretSquare", { category, cursor }],
    async () => {
     
      const searchParams = new URLSearchParams();
      if (category !== "전체") {
        searchParams.set("category", category);
      }
      const res = await axios.get<SecretSquareListResponse>(
        `${SERVER_URI}/square?${searchParams.toString()}`,
        {
          params: { cursor },
        },
      );
      return res.data;
    },
    options,
  );

type SecretSquareDetailResponse = { square: SecretSquareItem };

export const useGetSquareDetailQuery = (
  { squareId }: { squareId: string },
  options?: QueryOptions<SecretSquareDetailResponse["square"]>,
) =>
  useQuery(
    ["secretSquare", { squareId }],
    async () => {
      const res = await axios.get<SecretSquareDetailResponse>(`${SERVER_URI}/square/${squareId}`);
      return res.data.square;
    },
    options,
  );

type SecretSquarePollStatusResponse = {
  pollItems: string[];
};

export const useCurrentPollStatusQuery = (
  { squareId }: { squareId: string },
  options?: QueryOptions<SecretSquarePollStatusResponse>,
) =>
  useQuery<SecretSquarePollStatusResponse, AxiosError, SecretSquarePollStatusResponse>(
    ["secretSquare", "currentPollStatus", { squareId }],
    async () => {
      const res = await axios.get<SecretSquarePollStatusResponse>(
        `${SERVER_URI}/square/${squareId}/poll`,
      );
      return res.data;
    },
    options,
  );

type SecretSquareIsLikeResponse = {
  isLike: boolean;
};

export const useLikeStatus = (
  { squareId }: { squareId: string },
  options?: QueryOptions<SecretSquareIsLikeResponse>,
) => {
  return useQuery(
    ["secretSquare", "isLike", { squareId }],
    async () => {
      const res = await axios.get<SecretSquareIsLikeResponse>(
        `${SERVER_URI}/square/${squareId}/like`,
      );
      return res.data;
    },
    options,
  );
};
