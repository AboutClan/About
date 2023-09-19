import { IVoteRate } from "../study/studyRecord";
import { IScore } from "../user/pointSystem";
import { IUser2 } from "../user/user";

export interface IRankScore {
  isRank: boolean;
  rankNum?: number;
  percent?: number;
  scoreArr?: IScore[] | IVoteRate[];
  score?: number;
}

export interface IMyRank {
  rankValue: number;
  isRankNum: boolean;
}
export interface ISortedUserScores extends IMyRank {
  scoreArr: IScore[];
}
export interface ISortedUserAttends extends IMyRank {
  attendArr: IRankingUser[];
}

export type RankingCategory = "월간" | "누적" | "지난";

export interface IRankingUser extends IUser2 {
  cnt?: number;
}

export type RankingType = ISortedUserScores | ISortedUserAttends;
