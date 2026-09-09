import { Dayjs } from "dayjs";

import { StudyPlaceProps } from "@/types/models/studyTypes/study-entity.types";
import { UserSimpleInfoProps } from "@/types/models/userTypes/userInfoTypes";
import { TimeStampProps } from "@/types/utils/timeAndDate";

/**
 * 매칭 기준점. 유저는 최대 2개까지 지정할 수 있고, 그중 어느 하나라도
 * eps 범위 안에 들면 참여 가능으로 본다(union).
 * 순서에는 의미가 없다 — anchors[0]은 아래 flat 필드를 채우기 위한 미러링일 뿐이다.
 */
export interface StudyVoteAnchorProps {
  latitude: number;
  longitude: number;
  locationDetail: string;
}

export interface StudyVoteProps {
  userId?: string;
  // anchors[0] 미러링. anchors를 안 보내는 레거시 호출 지점이 있어 계속 전송한다.
  latitude: number;
  longitude: number;
  locationDetail: string;
  start: Dayjs;
  end: Dayjs;
  // 매칭 반경. 유저당 1개이며 모든 anchor에 공통 적용된다.
  eps: number;
  anchors?: StudyVoteAnchorProps[];
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
