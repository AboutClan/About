import { TimeStampProps } from "../utils/timeAndDate";
import { IUserSummary } from "./userTypes/userInfoTypes";

export type Alphabet = "A" | "b" | "o" | "u" | "t";

export interface ICollectionAlphabet extends TimeStampProps {
  collects: Alphabet[];
  collectCnt: number;
  user: IUserSummary;
}

export interface CollectionProps {
  alphabet: Alphabet;
  stamps?: number;
}
