import { KakaoProfile } from "next-auth/providers/kakao";

import { USER_BADGE_ARR } from "../../../constants/serviceConstants/badgeConstants";
import { USER_ROLE } from "../../../constants/serviceConstants/userConstants";
import { ActiveLocation, Location } from "../../services/locationTypes";
import { TimeStampProps } from "../../utils/timeAndDate";
import { IStudyVotePlaces } from "../studyTypes/studyInterActions";

export interface IUser extends Omit<IUserRegisterForm, "location">, IUserSummary {
  id: string;
  point: number;
  badge: {
    badgeIdx: number;
    badgeList: string[];
  };
  role: UserRole;
  rest: IRest;
  deposit: number;
  friend: string[];
  like: number;
  studyPreference?: IStudyVotePlaces;
  belong?: string;
  monthScore: number;
  instagram?: string;
  isPrivate?: boolean;
  _id: string;
  ticket: {
    gatherTicket: number;
    groupStudyTicket: number;
  };
  isLocationSharingDenided: boolean;
  studyRecord: UserStudyRecordProps;
  monthStudyTarget: number;
  temperature: {
    temperature: number;
    cnt: number;
    sum?: number;
  };

  kakao_account: KakaoProfile["kakao_account"];
}

export interface UserStudyRecordProps {
  accumulationMinutes: number;
  accumulationCnt: number;
  monthCnt: number;
  monthMinutes: number;
}

export interface UserSimpleInfoProps {
  name: string;
  avatar: AvatarProps;
  profileImage: string;
  _id: string;
  uid: string;
  score: number;
  comment?: string;
  badge: {
    badgeIdx: number;
    badgeList?: string[];
  };
  temperature: {
    temperature: number;
    cnt: number;
    sum?: number;
  };
}

export interface LocationDeatilProps {
  text: string;
  lat: number;
  lon: number;
}

export interface IUserSummary {
  avatar: AvatarProps;
  birth: string;
  comment: string;
  isActive: boolean;
  location: ActiveLocation;
  name: string;
  profileImage: string;
  monthScore: number;
  score: number;
  badge: {
    badgeIdx: number;
    badgeList?: string[];
  };
  uid: string;
  _id: string;
  temperature: {
    temperature: number;
    cnt: number;
    sum?: number;
  };
}

export interface IUserRegisterForm extends IUserRegisterFormWriting, TimeStampProps {
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
  locationDetail: LocationDeatilProps;
  introduceText?: string;
}
export interface AvatarProps {
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
