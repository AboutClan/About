import { UserCommentProps } from "../components/propTypes";
import { TimeStampProps } from "../utils/timeAndDate";

export type SecretSquareCategory = "일상" | "정보" | "질문" | "같이해요";
export type SecretSquareCategoryWithAll = "전체" | SecretSquareCategory;

interface BaseSecretSquareItem extends TimeStampProps {
  _id: string;
  category: SecretSquareCategory;
  title: string;
  content: string;
  viewers: string[];
  like: string[];
  images: string[];
  author: string;
  comments: UserCommentProps[];
}

interface GeneralSecretSquareItem extends BaseSecretSquareItem {
  type: "general";
}

interface PollItem {
  _id: string;
  name: string;
  users: string[];
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
