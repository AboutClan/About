import { Dayjs } from "dayjs";

import { TimeStampProps } from "../../utils/timeAndDate";
import { MessageSimpleProps } from "../commonTypes";
import { UserSimpleInfoProps } from "../userTypes/userInfoTypes";
import { PlaceInfoProps, TimeRangeProps } from "../utilTypes";

export interface StudyVoteDataProps {
  date: string;
  status: "before" | "after";
  participations?: StudyParticipationProps[];
  results: StudyResultProps[];
  realTimes?: { date: string; userList: RealTimeMemberProps[] };
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
  commentInfo?: MessageSimpleProps;
  attendanceInfo?: StudyAttendanceInfoProps;
  absenceInfo?: MessageSimpleProps;
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
  commentInfo?: MessageSimpleProps;
}

export interface StudyAttendanceInfoProps {
  time: string;
  memo: string;
  type: "arrived" | "absenced";
  attendanceImage?: string;
}

export interface StudyAttendanceRequestProps {
  image?: Blob;
  place?: PlaceInfoProps;
  arrivedMessage: string;
  status: StudyStatus;
  time: TimeRangeProps;
}

export type MyVoteStatus = "voting" | "open" | "private" | "pending" | "todayPending";

export type StudyStatus = "open" | "free" | "recruiting" | "expected";
////

export interface AbsenceInfoProps extends TimeStampProps {
  user: UserSimpleInfoProps;
  message: string;
}

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
  status: "solo";
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
  coverImage: string;
  locationDetail: string;
  mapURL: string;
  time?: string;
}

export interface StudyPlaceProps extends PlaceRegisterProps {
  _id: string;
  registerDate: string;
}
