import { WritingFormProps } from "../services/writingTypes";
import { ITimeStamps } from "../utils/timeAndDate";
import { IUserSummary } from "./userTypes/userInfoTypes";

export interface FeedProps extends Omit<WritingFormProps, "images">, ITimeStamps {
  images: string[];
  _id: string;
  like: IUserSummary[];
  likeCnt: number;
  writer: IUserSummary;
}

export type FeedType = "gather" | "group";
