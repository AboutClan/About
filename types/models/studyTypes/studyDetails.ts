import { Dayjs } from "dayjs";
import { ActiveLocation } from "../../services/locationTypes";

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
}

export type StudyStatus = "pending" | "open" | "dismissed" | "free";
