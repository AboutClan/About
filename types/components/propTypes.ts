import { ThemeTypings } from "@chakra-ui/react";

import { IUserSummary } from "../models/userTypes/userInfoTypes";
import { LocationEn } from "../services/locationTypes";
import { ITimeStamps } from "../utils/timeAndDate";

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

interface CommentProps extends ITimeStamps {
  comment: string;
  user: IUserSummary;
  _id?: string;
}
export interface UserCommentProps extends CommentProps {
  subComments?: CommentProps[];
}
