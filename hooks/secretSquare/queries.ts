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

// TODO change localhost to SERVER_URI

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
      const res = await axios.get<SecretSquareListResponse>(
        `http://localhost:3001/square?${searchParams.toString()}`,
      );
      // const res = await axios.get<SecretSquareListResponse>(`${SERVER_URI}/square`);
      return res.data;
    },
    options,
  );

type SecretSquareDetailResponse = { square: SecretSquareItem & { isMySquare: boolean } };

export const useGetSquareDetailQuery = (
  { squareId }: { squareId: string },
  options?: QueryOptions<SecretSquareDetailResponse["square"]>,
) =>
  useQuery(
    ["secretSquare", { squareId }],
    async () => {
      const res = await axios.get<SecretSquareDetailResponse>(
        `http://localhost:3001/square/${squareId}`,
      );
      // const res = await axios.get<SecretSquareDetailResponse>(`${SERVER_URI}/square/${squareId}`);
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
        `http://localhost:3001/square/${squareId}/poll`,
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
        `http://localhost:3001/square/${squareId}/like`,
      );
      return res.data;
    },
    options,
  );
};

// TODO remove mock data
const squareList: SecretSquareListResponse["squareList"] = [
  {
    _id: "66a89681d03a0dcf5b8cb216",
    category: "일상",
    title: "test title",
    content: "테스트 본문입니다. 테스트 본문입니다. 테스트 본문입니다. ",
    type: "poll",
    viewCount: 13,
    createdAt: "2024-07-30T07:30:09.027Z",
    thumbnail:
      "https://images.unsplash.com/photo-1591154669695-5f2a8d20c089?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    likeCount: 0,
    commentsCount: 3,
  },
  {
    _id: "66a89cfab648df8f5472d84d",
    category: "일상",
    title: "test title",
    content: "테스트 본문입니다. 테스트 본문입니다. 테스트 본문입니다. ",
    type: "poll",
    viewCount: 0,
    createdAt: "2024-07-30T07:57:46.764Z",
    thumbnail: "",
    likeCount: 0,
    commentsCount: 0,
  },
  {
    _id: "66a8b9bc6240f90fe315da0d",
    category: "일상",
    title: "tt",
    content: "테스트 본문입니다. 테스트 본문입니다. 테스트 본문입니다.",
    type: "poll",
    viewCount: 0,
    createdAt: "2024-07-30T10:00:28.037Z",
    thumbnail: "",
    likeCount: 0,
    commentsCount: 0,
  },
  {
    _id: "66a8f07df28eefb5818cd49f",
    category: "고민",
    title: "ttt",
    content: "테스트 본문입니다. 테스트 본문입니다. 테스트 본문입니다.",
    type: "poll",
    viewCount: 1,
    createdAt: "2024-07-30T13:54:05.194Z",
    thumbnail: "",
    likeCount: 0,
    commentsCount: 0,
  },
];

const detail: SecretSquareItem = {
  _id: "66a89681d03a0dcf5b8cb216",
  category: "일상",
  title: "test title",
  content: "테스트 본문입니다. 테스트 본문입니다. 테스트 본문입니다. ",
  type: "poll",
  poll: {
    canMultiple: true,
    pollItems: [
      {
        _id: "66a89681d03a0dcf5b8cb217",
        name: "test1",
        count: 1,
      },
      {
        _id: "66a89681d03a0dcf5b8cb218",
        name: "test2",
        count: 1,
      },
      {
        _id: "66a89681d03a0dcf5b8cb219",
        name: "test3",
        count: 0,
      },
    ],
  },
  images: [
    "https://images.unsplash.com/photo-1591154669695-5f2a8d20c089?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1591154669695-5f2a8d20c089?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1591154669695-5f2a8d20c089?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ],
  viewCount: 13,
  createdAt: "2024-07-30T07:30:09.027Z",
  updatedAt: "2024-07-30T23:45:57.650Z",
  likeCount: 0,
  comments: [
    {
      _id: "66a89c87774db8d2e59f7e5e",
      comment: "댓글 예시입니다.",
      createdAt: "2024-07-30T07:55:51.848Z",
      updatedAt: "2024-07-30T07:55:51.848Z",
    },
    {
      _id: "66a89c8d774db8d2e59f7e63",
      comment: "댓글 예시입니다.1",
      createdAt: "2024-07-30T07:55:57.663Z",
      updatedAt: "2024-07-30T07:55:57.663Z",
    },
    {
      _id: "66a8ae32e86eb8c7b4afd3a2",
      comment: "1",
      createdAt: "2024-07-30T09:11:14.100Z",
      updatedAt: "2024-07-30T09:11:14.100Z",
    },
  ],
};
