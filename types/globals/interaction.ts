import { ITimeStamps } from "../utils/timeAndDate";

export type InteractionType = "like" | "friend" | "alphabet";

export interface IInteractionSendLike {
  to: string;
  message?: string;
}

export interface INoticeActiveLog extends IInteractionSendLike, ITimeStamps {
  from: string;
  type: InteractionType;
  sub?: string;
  status?: "pending" | "refusal" | "approval" | "response";
}

export interface IInteractionLikeStorage {
  uid: string;
  date: string;
}

export type CustomColor = "mint" | "orange" | "blue" | "gray";
