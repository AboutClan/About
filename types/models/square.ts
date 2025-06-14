import { UserCommentProps } from "../components/propTypes";
import { TimeStampProps } from "../utils/timeAndDate";

export type SecretSquareCategory = "일상" | "질문" | "고민" | "기타";
export type InfoSquareCategory = "정보" | "팀원 모집" | "홍보" | "기타";
export type SecretSquareCategoryWithAll = "전체" | SecretSquareCategory;
export type InfoSquareCategoryWithAll = "전체" | InfoSquareCategory;

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
