import { IUser } from "./userTypes/userInfoTypes";

export type MemberGroup = "member" | "human" | "resting" | "birth" | "enthusiastic";

export interface IGroupedMembers extends Record<MemberGroup, IUser[]> {}
