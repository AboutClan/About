import { TimeStampProps } from "../../utils/timeAndDate";
import { UserSimpleInfoProps } from "../userTypes/userInfoTypes";

export interface PlaceRegisterProps {
  fullname: string;
  brand: string;
  branch: string;
  image: string;
  longitude: number;
  latitude: number;
  coverImage: string;
  locationDetail: string;
  time?: string;
}

export interface PlaceReviewProps extends TimeStampProps {
  user: UserSimpleInfoProps;
  rating: number;
  isSecret: boolean;
  review: string;
}
