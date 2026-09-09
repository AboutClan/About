import { STUDY_CREW } from "@/constants/service/study/place";
import { LocationProps, TimeRangeProps } from "@/types/common";
import { CommentProps } from "@/types/models/commonTypes";
import { PlaceRegisterProps, PlaceReviewProps } from "@/types/models/studyTypes/entityTypes";
import { StudyAttendanceProps } from "@/types/models/studyTypes/requestTypes";
import { UserSimpleInfoProps } from "@/types/models/userTypes/userInfoTypes";
import { StringTimeProps, TimeStampProps } from "@/types/utils/timeAndDate";

/**
 * study entry detail types
 */

export interface StudyParticipationProps {
  user: UserSimpleInfoProps;
  location: LocationProps;
  /** 기준점이 여러 개일 수 있다. location은 anchors[0]과 같다. */
  locations?: LocationProps[];
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

export type StudyPlaceFilter = "all" | "about" | "good";
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
  prefCnt?: number;
  reviews?: PlaceReviewProps[];
  image?: string;
  coverImage?: string;
  ratings?: StudyRatingProps[];
  operatingHours?: string[];
  pick?: string;
  likes?: string[];
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
