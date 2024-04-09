import { ITimeStamps } from "./timeAndDate";
import { IUserSummary } from "./userTypes/userInfoTypes";

export type Alphabet = "A" | "B" | "O" | "U" | "T";

export interface ICollectionAlphabet extends ITimeStamps {
  collects: Alphabet[];
  collectCnt: number;
  user: IUserSummary;
}
