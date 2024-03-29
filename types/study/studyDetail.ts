import { Dayjs } from "dayjs";
import { Document } from "mongoose";
import { IStudyPlaces } from "../../types2/studyTypes/studyVoteTypes";

import { IDayjsStartToEnd, ITimeStamps, ITimeStartToEnd } from "../timeAndDate";
import { IUser } from "../user/user";

export interface IVote extends Document {
  date: Date;
  participations: IParticipation[];
}
export interface IVote2 {
  date: Date;
  participations: IParticipation[];
}

export interface IParticipation extends ITimeStartToEnd {
  place: IPlace;
  attendences: IAttendance[];
  absences: IAbsence[];
  startTime?: Date;
  endTime?: Date;
  status: StudyStatus;
}

export interface IAttendance {
  user: IUser;
  time: IDayjsStartToEnd;
  created: Date;
  arrived?: Date;
  firstChoice: boolean;
  confirmed: boolean;
  memo: string;
}

export interface IPlace {
  status: string;
  fullname: string;
  brand?: string;
  branch?: string;
  image?: string;
  latitude: number;
  longitude: number;
  priority?: number;
  _id: string;
  location: string;
  time?: string;
  locationText?: string;
  locationDetail?: string;
  coverImage?: string;
}

export interface IAbsence extends ITimeStamps {
  user: IUser;
  noShow: boolean;
  message: string;
}

export type StudyStatus = "pending" | "open" | "dismissed" | "free";

export type StudyDateStatus = "passed" | "today" | "not passed";

export interface IStudyPreferencesQuery {
  _id: string;
  studyPreference: IStudyPlaces;
}

export interface IStudyStartTime {
  place_id: string;
  startTime: Dayjs;
}
