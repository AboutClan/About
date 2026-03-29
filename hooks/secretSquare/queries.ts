import axios, { AxiosError } from "axios";
import { useQuery } from "react-query";

import { SERVER_URI } from "../../constants/system";
import { CommunityCategory } from "../../pages/community";
import { QueryOptions } from "../../types/hooks/reactTypes";
import type { SecretSquareItem } from "../../types/models/square";
import { AvatarProps, UserSimpleInfoProps } from "../../types/models/userTypes/userInfoTypes";

export type SecretSquareListResponse = {
  squareList: {
    _id: string;
    category: CommunityCategory;
    title: string;
    content: string;
    viewers: string[];
    thumbnail: string;
    like: string[];
    commentsCount: number;
    createdAt: string;
    author: string | UserSimpleInfoProps;
    viewCount?: number;
    avatar: AvatarProps;
    type: "general" | "blindnes";
    poll: {
      canMultiple: boolean;
      pollItems: {
        name: string;
        users: string[];
        _id: string;
      }[];
    };
  }[];
};
export const useSecretSquareListQuery = (
  {
    category,
    cursor,
  }: {
    category: CommunityCategory;
    cursor: number;
  },
  options?: QueryOptions<SecretSquareListResponse>,
) =>
  useQuery<SecretSquareListResponse, AxiosError, SecretSquareListResponse>(
    ["secretSquare", { category, cursor }],
    async () => {
      // const searchParams = new URLSearchParams();
      // if (category !== "전체") {
      //   searchParams.set("category", category);
      // }
      const res = await axios.get<SecretSquareListResponse>(`${SERVER_URI}/square`, {
        params: { category, cursor },
      });

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
