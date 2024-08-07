import { ITimeStamps } from "../utils/timeAndDate";

export type SecretSquareCategory = "전체" | "일상" | "고민" | "정보" | "같이해요";

interface BaseSecretSquareItem extends ITimeStamps {
  id: string;
  category: SecretSquareCategory;
  author: string;
  title: string;
  content: string;
  viewCount: number;
}

interface GeneralSecretSquareItem extends BaseSecretSquareItem {
  type: "general";
}

interface PollItem {
  id: string;
  value: string;
  count: number;
}

interface PollSecretSquareItem extends BaseSecretSquareItem {
  type: "poll";
  pollList: PollItem[];
  canMultiple: boolean;
}

export type SquareType = "general" | "poll";

export type SecretSquareItem = GeneralSecretSquareItem | PollSecretSquareItem;

export type SecretSquareFormData = {
  category: "일상" | "고민" | "정보" | "같이해요";
  title: string;
  content: string;
  pollList: { value: string }[];
  canMultiple: boolean;
};
