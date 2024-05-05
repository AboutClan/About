import { IScore } from "../services/pointSystem";
import { IVoteRate } from "./studyTypes/studyRecords";
import { IUser, IUserSummary } from "./userTypes/userInfoTypes";

export interface IRankScore {
  isRank: boolean;
  rankNum?: number;
  percent?: number;
  scoreArr?: IScore[] | IVoteRate[];
  score?: number;
}

export interface IUserRankings {
  mine: IMyRank;
  users: IVoteRate[];
}
export interface IMyRank {
  rankNum?: number;
  percent?: number;
  isRank: boolean;
  value: number;
}
export interface ISortedUserScores extends IMyRank {
  scoreArr: IScore[] | IUser[];
}
export interface ISortedUserAttends extends IMyRank {
  attendArr: IRankingUser[];
}

export type RankingCategory = "월간" | "누적" | "지난";

export interface IRankingUser extends IMyRank {
  uid: string;
  cnt: number;
  userSummary?: IUserSummary;
}

export type RankingType = ISortedUserScores | ISortedUserAttends;
