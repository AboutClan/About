import {
  USER_BADGE_ARR,
  USER_EVENT_BADGE_ARR,
} from "../../../constants/serviceConstants/badgeConstants";
import { USER_ROLE } from "../../../constants/serviceConstants/userConstants";
import { ActiveLocation, Location } from "../../services/locationTypes";

export interface IUser extends Omit<IUserRegisterForm, "location">, IUserSummary {
  id: string;
  point: number;
  role: UserRole;
  rest: IRest;
  deposit: number;
  friend: string[];
  like: number;
  belong?: string;
  _id: string;
}

export interface IUserSummary {
  avatar: IAvatar;
  birth: string;
  comment: string;
  isActive: boolean;
  location: ActiveLocation;
  name: string;
  profileImage: string;
  score: number;
  uid: string;
  _id?: string;
}

export interface IUserRegisterForm extends IUserRegisterFormWriting {
  registerDate: string;
  profileImage: string;
  uid: string;
}

export interface IUserRegisterFormWriting {
  location: Location;
  name: string;
  mbti: string;
  birth: string;
  gender: "남성" | "여성";
  interests: { first: string; second?: string };
  majors: { department: string; detail: string }[];
  comment: string;
  telephone: string;
}
export interface IAvatar {
  type: number;
  bg: number;
}
export interface IRest {
  type: string;
  startDate: Date;
  endDate: Date;
  content: string;
  cumulativeSum: number;
  restCnt: number;
}

export type UserRole = (typeof USER_ROLE)[number];
export type UserBadge = (typeof USER_BADGE_ARR)[number];
export type EventBadge = (typeof USER_EVENT_BADGE_ARR)[number];
