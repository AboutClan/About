import { Dayjs } from "dayjs";

import { TimeStampProps } from "../../utils/timeAndDate";
import { IUserSummary } from "../userTypes/userInfoTypes";
import { StudyPlaceProps } from "./baseTypes";

export interface StudyVoteProps {
  latitude: number;
  longitude: number;
  locationDetail: string;
  start: Dayjs;
  end: Dayjs;
}

export interface IStudyVote extends IStudyVotePlaces, IStudyVoteTime {
  memo?: string;
}

export interface MyVoteProps {
  main: string;
  sub: string[];
}
export interface IStudyVoteWithPlace extends IStudyVoteTime {
  memo?: string;
  place: StudyPlaceProps;
  subPlace: StudyPlaceProps[];
}

export interface StudyCommentProps extends TimeStampProps {
  text: string;
}

export interface IStudyVotePlaces extends TimeStampProps {
  place: string;
  subPlace?: string[];
}

export interface IStudyVoteTime {
  start: Dayjs;
  end: Dayjs;
}

export interface IAbsence extends TimeStampProps {
  user: IUserSummary;
  noShow: boolean;
  message: string;
}

export type StudyDateStatus = "passed" | "today" | "not passed";

export interface StudyWritingProps extends StudyPlaceProps {
  content: string;
}

interface StudyWaitingPlaceProps {
  id: string;
  branch: string;
}
export interface StudyWaitingUser {
  user: IUserSummary;
  place: StudyWaitingPlaceProps;
  subPlace: StudyWaitingPlaceProps[];
  createdAt?: string;
  point?: number;
}

export interface StudyVotingSave {
  date: string;
  isVoting: boolean;
}

export interface StudyAttendMembersProp {
  date: string;
  members: IUserSummary[];
}
