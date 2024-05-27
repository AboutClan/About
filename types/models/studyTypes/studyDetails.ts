import { Dayjs } from "dayjs";

import { Location } from "../../services/locationTypes";
import { IUserSummary } from "../userTypes/userInfoTypes";
import { IAbsence } from "./studyInterActions";

export interface IStudy {
  date: Date;
  participations: IParticipation[];
}

export interface IParticipation {
  place: IPlace;
  attendences: IAttendance[];
  absences: IAbsence[];
  startTime?: Date;

  status: StudyStatus;
}

export interface IAttendance {
  user: IUserSummary;
  time: {
    start: Dayjs;
    end: Dayjs;
  };
  imageUrl?: string;
  arrived?: Date;
  firstChoice: boolean;
  memo: string;
}

export interface IPlace {
  status: string;
  brand: string;
  branch: string;
  fullname: string;
  coverImage: string;
  image: string;
  latitude: number;
  longitude: number;
  _id: string;
  location: Location;
  locationDetail: string;
  time: string;
  mapUrl: string;
}

export type StudyStatus = "pending" | "open" | "dismissed" | "free";
