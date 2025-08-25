import { LocationProps } from "../../common";
import { TimeStampProps } from "../../utils/timeAndDate";
import { UserSimpleInfoProps } from "../userTypes/userInfoTypes";

export type PlaceStatus = "main" | "sub" | "inactive";
export interface PlaceProps extends PlaceRegisterProps {
  _id: string;
  registerDate: string;
  prefCnt: number;
  reviews?: PlaceReviewProps[];
  rating?: number;
  registrant: UserSimpleInfoProps;
}
export interface PlaceRegisterProps {
  status?: PlaceStatus;
  location: LocationProps;
}

export interface PlaceReviewProps extends TimeStampProps {
  user: UserSimpleInfoProps;
  rating: number;
  isSecret: boolean;
  review: string;
}
