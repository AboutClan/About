import { IUserSummary } from "../userTypes/userInfoTypes";

export interface IArrivedInfo {
  uid: string;
  name: string;
}

export interface IArrivedInfoList {
  placeId: string;
  arrivedInfo: IArrivedInfo[];
}

export interface IArrivedData {
  date: number;
  arrivedInfoList: IArrivedInfoList[];
}

export interface IVoteRate {
  uid: string;
  cnt: number;
  userSummary?: IUserSummary;
}

export interface VoteCntProps {
  date: string;
  value: number;
  totalValue?: number;
}
