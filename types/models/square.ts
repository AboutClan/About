import { ITimeStamps } from "../utils/timeAndDate";

export type SecretSquareCategory = "전체" | "일상" | "고민" | "정보" | "같이해요";

interface BaseSecretSquareItem extends ITimeStamps {
  id: string;
  category: SecretSquareCategory;
  author: string;
  title: string;
  content: string;
}

interface GeneralSecretSquareItem extends BaseSecretSquareItem {
  type: "general";
}

interface PollItem {
  id: string;
  value: string;
  count: string;
}

interface PollSecretSquareItem extends BaseSecretSquareItem {
  type: "poll";
  pollList: PollItem[];
}

export type SecretSquareItem = GeneralSecretSquareItem | PollSecretSquareItem;
