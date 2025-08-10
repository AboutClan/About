import { CoordinatesProps } from "../../common";
import { StringTimeProps, TimeStampProps } from "../../utils/timeAndDate";
import { CommentProps } from "../commonTypes";
import { UserSimpleInfoProps } from "../userTypes/userInfoTypes";
import { PlaceInfoProps } from "../utilTypes";
import { PlaceRegisterProps, PlaceReviewProps } from "./entityTypes";
import { StudyAttendanceProps } from "./requestTypes";

export interface StudyOneDayProps {
  date: string;
  results: StudyResultProps[];
  participations: StudyParticipationProps[];
  realTimes: StudyRealTimesProps;
}
export interface StudyVoteDataProps {
  date: string;
  participations?: StudyParticipationProps[];
  results: StudyResultProps[];
  realTimes?: StudyRealTimesProps;
  unmatchedUsers?: string[];
}

export interface StudyParticipationProps {
  start: string;
  end: string;
  latitude: number;
  longitude: number;
  user: ParticipationUser;
}

export interface StudyResultProps {
  place: StudyPlaceProps;
  members: StudyMemberProps[];
  center?: CoordinatesProps;
}

export interface StudyRealTimesProps {
  date: string;
  userList: RealTimeMemberProps[];
}

export interface StudyMemberProps extends TimeStampProps {
  user: UserSimpleInfoProps;
  time: StringTimeProps;
  attendance?: StudyAttendanceProps;
  comment?: CommentProps;
}

export interface RealTimeMemberProps extends StudyMemberProps {
  place: PlaceInfoProps;
  status: RealTimesStatus;
}

export interface StudyPlaceProps extends PlaceRegisterProps {
  _id: string;
  registerDate: string;
  registrant?: UserSimpleInfoProps;
  status?: "active" | "inactive";
  prefCnt?: number;
  reviews: PlaceReviewProps[];
}

// | "recruiting" | "expected"
export type StudyStatus = "open" | RealTimesStatus;

export type RealTimesStatus = "free" | "solo" | "cancel";

interface ParticipationUser extends UserSimpleInfoProps {
  isLocationSharingDenided?: boolean;
}
