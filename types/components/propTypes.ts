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

export interface UserCommentProps extends ITimeStamps {
  user: IUserSummary;
  comment: string;
  _id?: string;
}
