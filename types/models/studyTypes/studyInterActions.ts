import { Dayjs } from "dayjs";

import { StudyPlaceProps } from "@/types/models/studyTypes/study-entity.types";
import { UserSimpleInfoProps } from "@/types/models/userTypes/userInfoTypes";
import { TimeStampProps } from "@/types/utils/timeAndDate";

export interface StudyVoteProps {
  userId?: string;
  latitude: number;
  longitude: number;
  locationDetail: string;
  start: Dayjs;
  end: Dayjs;
  eps: number;
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
  user: UserSimpleInfoProps;
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
  user: UserSimpleInfoProps;
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
  members: UserSimpleInfoProps[];
}
