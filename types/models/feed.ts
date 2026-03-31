import { WritingFormProps } from "../services/writingTypes";
import { TimeStampProps } from "../utils/timeAndDate";
import { UserSimpleInfoProps } from "./userTypes/userInfoTypes";

export interface FeedProps
  extends Omit<WritingFormProps, "images" | "isAnonymous">,
    TimeStampProps {
  images: string[];
  id: string;
  like: UserSimpleInfoProps[];
  likeCnt: number;
  writer: UserSimpleInfoProps;
  comments: FeedComment[];
  isAnonymous: boolean;
}

export interface FeedComment extends TimeStampProps {
  user: UserSimpleInfoProps;
  comment: string;
  feedId: string;
}

export type FeedType = "gather" | "group";
