import { UserCommentProps } from "../components/propTypes";
import { TimeStampProps } from "../utils/timeAndDate";

export type SecretSquareCategory = "일상" | "고민" | "정보" | "같이해요";
export type SecretSquareCategoryWithAll = "전체" | SecretSquareCategory;

interface BaseSecretSquare extends TimeStampProps {
  _id: string;
  category: SecretSquareCategory;
  title: string;
  content: string;
  viewCount: number;
  likeCount: number;
  images: string[];
  author: string;
  comments: UserCommentProps[];
  isAnonymous: boolean;
  uid?: string;
  name?: string;
  profileImage?: string;
}

interface GeneralSecretSquare extends BaseSecretSquare {
  type: "general";
}

interface PollItem {
  _id: string;
  name: string;
  count: number;
}

interface PollSecretSquare extends BaseSecretSquare {
  type: "poll";
  poll: {
    pollItems: PollItem[];
    canMultiple: boolean;
  };
}

export type SecretSquareType = "general" | "poll";

export type SecretSquareItem = GeneralSecretSquare | PollSecretSquare;

export type SecretSquareFormData = {
  category: SecretSquareCategory;
  title: string;
  content: string;
  pollItems: { name: string }[];
  canMultiple: boolean;
  isAnonymous: boolean;
};
