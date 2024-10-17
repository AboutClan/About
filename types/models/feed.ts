import { WritingFormProps } from "../services/writingTypes";
import { TimeStampProps } from "../utils/timeAndDate";
import { IUserSummary } from "./userTypes/userInfoTypes";

export interface FeedProps
  extends Omit<WritingFormProps, "images" | "isAnonymous">,
    TimeStampProps {
  images: string[];
  _id: string;
  like: IUserSummary[];
  likeCnt: number;
  writer: IUserSummary;
  comments: FeedComment[];
  subCategory: string;
  isAnonymous: boolean;
}

export interface FeedComment extends TimeStampProps {
  user: IUserSummary;
  comment: string;
  feedId: string;
}

export type FeedType = "gather" | "group";
