import { UserSimpleInfoProps } from "./userTypes/userInfoTypes";

export interface StoreGiftProps {
  winnerCnt: number;
  winner: UserSimpleInfoProps[];
  status: "pending" | "processed" | "end";
  point: number;
  name: string;
  max: number;
  image: string;
  applicants: { user: UserSimpleInfoProps; cnt: number }[];
  _id: string;
}

export interface IStoreGift {
  image: string;
  name: string;
  type?: "about" | "ticket" | null;
  brand: string;
  point: number;
  winner: number;
  giftId?: number;
  max?: number;
}

export interface IStoreApplicant {
  uid?: string | unknown;
  name: string;
  cnt: number;
  giftId?: number;
}

export interface IStoreQuery {
  users: IStoreApplicant[];
}
