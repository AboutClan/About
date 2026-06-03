import { STUDY_CREW } from "../../../constants/service/study/place";
import { LocationProps, TimeRangeProps } from "../../common";
import { StringTimeProps, TimeStampProps } from "../../utils/timeAndDate";
import { CommentProps } from "../commonTypes";
import { UserSimpleInfoProps } from "../userTypes/userInfoTypes";
import { PlaceRegisterProps, PlaceReviewProps } from "./entityTypes";
import { StudyAttendanceProps } from "./requestTypes";

/**
 * study entry detail types
 */

export interface StudyParticipationProps {
  user: UserSimpleInfoProps;
  location: LocationProps;
  isBeforeResult: boolean;
  times: TimeRangeProps;
  dates?: string[];
}

export interface StudyConfirmedProps {
  place: StudyPlaceProps;
  members: StudyConfirmedMemberProps[];
  status: StudyStatus;
}

/**
 * study status
 */

export type StudyStatus = RealTimesStudyStatus | VoteStudyStatus;
export type VoteStudyStatus = "open" | "expected";
export type RealTimesStudyStatus = "open" | "participation" | "solo" | "pending";
export type MyStudyStatus = "pending" | "participation" | "otherParticipation";

export type StudyCrew = (typeof STUDY_CREW)[number];
/**
 * study member (participation 제외)
 */

export interface StudyConfirmedMemberProps extends TimeStampProps {
  user: UserSimpleInfoProps;
  time?: StringTimeProps;
  attendance?: StudyAttendanceProps;
  heartCnt?: number;
  comment?: CommentProps;
  status?: RealTimesStudyStatus;
}

export type StudyPlaceFilter = "main" | "best" | "good" | "all" | "about" | "bad";
export interface StudyRatingProps {
  comment?: string;
  etc: number;
  mood: number;
  space: number;
  power: number;
  user?: string;
  createdAt?: string;
  name?: string;
}
export interface StudyPlaceProps extends PlaceRegisterProps {
  _id: string;
  registerDate?: string;
  registrant?: UserSimpleInfoProps;
  prefCnt?: number;
  reviews?: PlaceReviewProps[];
  image?: string;
  coverImage?: string;
  ratings?: StudyRatingProps[];
  operatingHours?: string[];
  pick?: string;
  studyCafeMeta?: StudyCafeMetaProps;
}

export interface StudyCafeMetaProps {
  is24Hours: boolean;
  hasParking: boolean;
  hasGroupSeats: boolean;
  hasComfortableSeats: boolean;
  hasCleanRestroom: boolean;
  hasGoodWifi: boolean;
  hasGoodValueDrinks: boolean;
  hasTimeLimit: boolean;
}

// export interface RealTimeMemberProps extends StudyConfirmedMemberProps {
//   place: PlaceInfoProps;
//   status: StudyStatus;
// }
// export interface RealTimesToResultProps extends StudyConfirmedProps {
//   status?: StudyStatus2;
