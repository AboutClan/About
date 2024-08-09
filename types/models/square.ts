import { ITimeStamps } from "../utils/timeAndDate";

export type SecretSquareCategory = "일상" | "고민" | "정보" | "같이해요";
export type SecretSquareCategoryWithAll = "전체" | SecretSquareCategory;

interface Comment extends ITimeStamps {
  _id: string;
  comment: string;
}

interface BaseSecretSquareItem extends ITimeStamps {
  _id: string;
  category: SecretSquareCategory;
  title: string;
  content: string;
  viewCount: number;
  likeCount: number;
  images: string[];
  comments: Comment[];
}

interface GeneralSecretSquareItem extends BaseSecretSquareItem {
  type: "general";
}

interface PollItem {
  _id: string;
  name: string;
  count: number;
}

interface PollSecretSquareItem extends BaseSecretSquareItem {
  type: "poll";
  poll: {
    pollItems: PollItem[];
    canMultiple: boolean;
  };
}

export type SecretSquareType = "general" | "poll";

export type SecretSquareItem = GeneralSecretSquareItem | PollSecretSquareItem;

export type SecretSquareFormData = {
  category: SecretSquareCategory;
  title: string;
  content: string;
  pollItems: { name: string }[];
  canMultiple: boolean;
};
