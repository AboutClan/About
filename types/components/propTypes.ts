import { ThemeTypings } from "@chakra-ui/react";

import { UserSimpleInfoProps } from "../models/userTypes/userInfoTypes";
import { LocationEn } from "../services/locationTypes";
import { TimeStampProps } from "../utils/timeAndDate";

export interface ILocationParam {
  locationParam: LocationEn;
}

export interface LinkButtonProp {
  text: string;
  url: string;
}

export interface ITextAndColorSchemes {
  text: string;
  colorScheme: ThemeTypings["colorSchemes"];
}

interface CommentProps extends TimeStampProps {
  comment: string;
  user?: Partial<UserSimpleInfoProps>;
  likeList?: string[];
  _id?: string;
}
export interface UserCommentProps extends CommentProps {
  subComments?: CommentProps[];
}

export interface BasicButtonProps {
  text: string;
  func: () => void;
  isLoading?: boolean;
}
