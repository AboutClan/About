import { CoordinatesProps } from "../../common";
import { StringTimeProps, TimeStampProps } from "../../utils/timeAndDate";
import { MessageProps } from "../commonTypes";
import { UserSimpleInfoProps } from "../userTypes/userInfoTypes";
import { PlaceInfoProps } from "../utilTypes";
import { PlaceRegisterProps } from "./entityTypes";
import { StudyAttendanceProps } from "./requestTypes";

export interface StudyVoteDataProps {
  date: string;
  participations?: StudyParticipationProps[];
  results: StudyResultProps[];
  realTimes?: StudyRealTimesProps;
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
  comment?: MessageProps;
}

export interface RealTimeMemberProps extends StudyMemberProps {
  place: PlaceInfoProps;
  status: RealTimesStatus;
}

export interface StudyPlaceProps extends PlaceRegisterProps {
  _id: string;
  registerDate: string;
}

// | "recruiting" | "expected"
export type StudyStatus = "open" | RealTimesStatus;

export type RealTimesStatus = "free" | "solo" | "cancel";

interface ParticipationUser extends UserSimpleInfoProps {
  isLocationSharingDenided?: boolean;
}
