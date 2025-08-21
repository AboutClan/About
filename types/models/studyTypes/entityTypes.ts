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
  title: string;
  status?: PlaceStatus;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

export interface PlaceReviewProps extends TimeStampProps {
  user: UserSimpleInfoProps;
  rating: number;
  isSecret: boolean;
  review: string;
}
