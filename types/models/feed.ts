import { UserSimpleInfoProps } from "@/types/models/userTypes/userInfoTypes";
import { WritingFormProps } from "@/types/services/writingTypes";
import { TimeStampProps } from "@/types/utils/timeAndDate";

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
