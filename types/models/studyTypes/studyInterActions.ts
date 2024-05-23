import { Dayjs } from "dayjs";

import { ITimeStamps } from "../../utils/timeAndDate";
import { IUserSummary } from "../userTypes/userInfoTypes";
import { IPlace } from "./studyDetails";

export interface IStudyVote extends IStudyVotePlaces, IStudyVoteTime {
  memo?: string;
}

export interface IStudyVotePlaces {
  place: string;
  subPlace?: string[];
}

export interface IStudyVoteTime {
  start: Dayjs;
  end: Dayjs;
}

export interface IAbsence extends ITimeStamps {
  user: IUserSummary;
  noShow: boolean;
  message: string;
}

export type StudyDateStatus = "passed" | "today" | "not passed";

export interface StudyWritingProps extends IPlace {
  content: string;
}
