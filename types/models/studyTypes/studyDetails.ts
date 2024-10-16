import { Dayjs } from "dayjs";

import { ActiveLocation } from "../../services/locationTypes";
import { TimeStampProps } from "../../utils/timeAndDate";
import { MessageSimpleProps } from "../commonTypes";
import { IUserSummary, UserSimpleInfoProps } from "../userTypes/userInfoTypes";
import { PlaceInfoProps, TimeRangeProps } from "../utilTypes";
import { IAbsence } from "./studyInterActions";

export interface StudyDailyInfoProps {
  date: string;
  participations: StudyParticipationProps[];
  realTime: RealTimeInfoProps[];
}

export interface StudyParticipationProps {
  place: StudyPlaceProps;
  status: StudyStatus;
  members: StudyMemberProps[];
  absences?: IAbsence[];
}
export interface RealTimeInfoProps extends TimeStampProps {
  user: UserSimpleInfoProps;
  place: PlaceInfoProps;
  status: StudyStatus;
  attendanceInfo?: StudyAttendanceInfoProps;
  comment?: MessageSimpleProps;
  time: TimeRangeProps;
  _id: string;
}

export interface StudyMergeParticipationProps extends Omit<StudyParticipationProps, "place"> {
  place: StudyPlaceProps | PlaceInfoProps;
}
export interface StudyMemberProps extends TimeStampProps {
  user: UserSimpleInfoProps;
  time: TimeRangeProps;
  isMainChoice?: boolean;
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

export type StudyStatus = "pending" | "open" | "dismissed" | "free" | "cancel";
