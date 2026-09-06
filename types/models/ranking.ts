import { IVoteRate } from "@/types/models/studyTypes/studyRecords";
import { IUser, UserSimpleInfoProps } from "@/types/models/userTypes/userInfoTypes";
import { IScore } from "@/types/services/pointSystem";

export interface IRankScore {
  isRank: boolean;
  rankNum?: number;
  percent?: number;
  scoreArr?: IScore[] | IVoteRate[];
  score?: number;
}

export interface IMyRank {
  rankNum: number;
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
  userSummary?: UserSimpleInfoProps;
}

export type RankingType = ISortedUserScores | ISortedUserAttends;
