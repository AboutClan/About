import { ITimeStamps } from "../utils/timeAndDate";
import { IUserSummary } from "./userTypes/userInfoTypes";

export type Alphabet = "A" | "B" | "O" | "U" | "T";

export interface ICollectionAlphabet extends ITimeStamps {
  collects: Alphabet[];
  collectCnt: number;
  user: IUserSummary;
}

export interface CollectionProps {
  stamps: number;
  alphabet: Alphabet;
}
