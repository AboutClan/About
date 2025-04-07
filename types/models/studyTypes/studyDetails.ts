import { Dayjs } from "dayjs";

import { ActiveLocation } from "../../services/locationTypes";
import { TimeStampProps } from "../../utils/timeAndDate";
import { MessageSimpleProps } from "../commonTypes";
import { UserSimpleInfoProps } from "../userTypes/userInfoTypes";
import { PlaceInfoProps, TimeRangeProps } from "../utilTypes";

export interface StudyVoteDataProps {
  date: string;
  status: "before" | "after";
  participations?: StudyParticipationProps[];
  results: StudyResultProps[];
  realTimes?: RealTimeMemberProps[];
}

export interface StudyParticipationProps {
  start: string;
  end: string;
  latitude: number;
  longitude: number;
  user: UserSimpleInfoProps;
}

export interface StudyResultProps {
  place: StudyPlaceProps;
  members: StudyMemberProps[];
}

export interface RealTimeMemberProps extends StudyMemberProps {
  place: PlaceInfoProps;
  status: StudyStatus;
}

export interface StudyMemberProps extends TimeStampProps {
  user: UserSimpleInfoProps;
  time: TimeRangeProps;
  comment?: MessageSimpleProps;
  attendanceInfo?: StudyAttendanceInfoProps;
}

export interface StudyMergeResultProps extends Omit<StudyResultProps, "place"> {
  place: StudyPlaceProps | PlaceInfoProps;
  status?: StudyStatus;
}

export interface StudyMergeParticipationProps extends StudyResultProps {
  // place: StudyPlaceProps | PlaceInfoProps;
}
export interface StudyMemberProps extends TimeStampProps {
  user: UserSimpleInfoProps;
  time: TimeRangeProps;
  attendanceInfo?: StudyAttendanceInfoProps;
  comment?: MessageSimpleProps;
  absenceInfo?: MessageSimpleProps;
}

export interface StudyAttendanceInfoProps {
  attendanceImage?: string;
  arrived: string;
  arrivedMessage: string;
}

export interface StudyAttendanceRequestProps {
  image?: Blob;
  place?: PlaceInfoProps;
  arrivedMessage: string;
  status: StudyStatus;
  time: TimeRangeProps;
}

////

export interface AbsenceInfoProps extends TimeStampProps {
  user: UserSimpleInfoProps;
  message: string;
}

export type StudyUserStatus = "pending" | "solo" | "open" | "completed" | "cancel";

export interface RealTimeBasicVoteProps {
  place: PlaceInfoProps;
  time: {
    start: string | Dayjs;
    end: string | Dayjs;
  };
}

export interface RealTimeBasicAttendanceProps {
  memo: string;
  image: string | Blob;
  status: StudyUserStatus;
}
export interface RealTimeDirectAttendanceProps
  extends RealTimeBasicAttendanceProps,
    RealTimeBasicVoteProps {}

export interface PlaceRegisterProps {
  fullname: string;
  brand: string;
  branch: string;
  image: string;
  longitude: number;
  latitude: number;
  location: ActiveLocation;
  coverImage: string;
  locationDetail: string;
  mapURL: string;
  time?: string;
}

export interface StudyPlaceProps extends PlaceRegisterProps {
  status: string;
  _id: string;
  registerDate: string;
}

export type StudyStatus = "recruiting" | "open" | "free" | "solo";
