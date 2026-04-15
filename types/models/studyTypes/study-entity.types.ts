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
export type RealTimesStudyStatus = "open" | "participation" | "solo";
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
}

export type StudyPlaceFilter = "main" | "best" | "good" | "all";
export interface StudyRatingProps {
  comment: string;
  etc: number;
  mood: number;
  space: number;
  table: number;
  user: string;
  createdAt: string;
}
export interface StudyPlaceProps extends PlaceRegisterProps {
  _id: string;
  registerDate?: string;
  registrant?: UserSimpleInfoProps;
  prefCnt?: number;
  reviews?: PlaceReviewProps[];
  image?: string;
  coverImage?: string;
  rating?: number;
  ratings?: StudyRatingProps[];
}

// export interface RealTimeMemberProps extends StudyConfirmedMemberProps {
//   place: PlaceInfoProps;
//   status: StudyStatus;
// }
// export interface RealTimesToResultProps extends StudyConfirmedProps {
//   status?: StudyStatus2;
