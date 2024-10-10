import { Dayjs } from "dayjs";

import { ActiveLocation } from "../../services/locationTypes";
import { ITimeStamps } from "../../utils/timeAndDate";
import { IUserSummary, UserSimpleInfoProps } from "../userTypes/userInfoTypes";
import { IAbsence } from "./studyInterActions";

export interface IStudy {
  date: Date;
  participations: IParticipation[];
  realTime: RealTimeInfoProps[];
}

export interface IParticipation {
  place: IPlace;
  attendences: IAttendance[];
  absences: IAbsence[];
  startTime?: Date;
  status: StudyStatus;
}

export interface IAttendance extends ITimeStamps {
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

export interface RealTimeInfoProps extends RealTimeBasicVoteProps, ITimeStamps {
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

export interface IPlace extends PlaceRegisterProps {
  status: string;
  _id: string;
  prefCnt: number;
  registerDate: string;
  myPrefer: boolean;
}

export type StudyStatus = "pending" | "open" | "dismissed" | "free";
