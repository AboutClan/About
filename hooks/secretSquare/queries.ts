import axios, { AxiosError } from "axios";
import { useQuery } from "react-query";

import { SERVER_URI } from "../../constants/system";
import { QueryOptions } from "../../types/hooks/reactTypes";
import type {
  SecretSquareCategory,
  SecretSquareCategoryWithAll,
  SecretSquareType,
} from "../../types/models/square";

type SecretSquareListResponse = {
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
  { category }: { category: SecretSquareCategoryWithAll },
  options?: QueryOptions<SecretSquareListResponse>,
) =>
  useQuery<SecretSquareListResponse, AxiosError, SecretSquareListResponse>(
    ["secretSquare", { category }],
    async () => {
      const searchParams = new URLSearchParams();
      if (category !== "전체") {
        searchParams.set("category", category);
      }
      const res = await axios.get<SecretSquareListResponse>(`${SERVER_URI}/square`);
      return res.data;
    },
    options,
  );
