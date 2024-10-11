import { Dayjs } from "dayjs";

import { ActiveLocation } from "../../services/locationTypes";
import { TimeStampProps } from "../../utils/timeAndDate";
import { MessageSimpleProps } from "../commonTypes";
import { IUserSummary, UserSimpleInfoProps } from "../userTypes/userInfoTypes";
import { PlaceInfoProps, TimeRangeProps } from "../utilTypes";

export interface StudyDailyInfoProps {
  date: string;
  participations: StudyParticipationProps[];
  realTime: RealTimeInfoProps[];
}

export interface StudyParticipationProps {
  place: StudyPlaceProps;
  status: StudyStatus;
  members: StudyMemberProps[];
}
export interface MyStudyParticipationProps extends Omit<StudyParticipationProps, "place"> {
  place: StudyPlaceProps | PlaceInfoProps;
}
export interface StudyMemberProps extends TimeStampProps {
  user: UserSimpleInfoProps;
  time: TimeRangeProps;
  isMainChoice: boolean;
  attendanceInfo?: StudyAttendanceInfoProps;
  comment?: MessageSimpleProps;
  absenceInfo?: MessageSimpleProps;
}

export interface StudyAttendanceInfoProps {
  attendanceImage?: string;
  arrived: string;
  arrivedMessage: string;
}

////

export interface AbsenceInfoProps extends TimeStampProps {
  user: UserSimpleInfoProps;
  message: string;
}

export interface IAttendance extends TimeStampProps {
  user: IUserSummary;
  time: {
    start: Dayjs;
    end: Dayjs;
  };
  createdAt: string;
  imageUrl?: string;
  arrived?: Date;
  firstChoice: boolean;
  memo: string;
  comment: string;
}

export interface RealTimeInfoProps extends RealTimeBasicVoteProps, TimeStampProps {
  user: UserSimpleInfoProps;
  status: StudyUserStatus;
  arrived?: string;
  image?: Blob | string;
  memo?: string;
  comment?: string;
  _id: string;
}

export type StudyUserStatus = "pending" | "solo" | "open" | "completed" | "cancel";

export interface RealTimeStudyPlaceProps {
  lat?: number;
  lon?: number;
  text: string;
  locationDetail: string;
}
export interface RealTimeBasicVoteProps {
  place: RealTimeStudyPlaceProps;
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

export interface RealTimeInfoProps extends RealTimeBasicVoteProps, TimeStampProps {
  user: UserSimpleInfoProps;
  status: StudyUserStatus;
  arrived?: string;
  image?: Blob | string;
  memo?: string;
  comment?: string;
  _id: string;
}

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

export type StudyStatus = "pending" | "open" | "dismissed" | "free";
