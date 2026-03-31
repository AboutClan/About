import { TimeStampProps } from "../utils/timeAndDate";
import { UserSimpleInfoProps } from "./userTypes/userInfoTypes";

export type Alphabet = "A" | "B" | "O" | "U" | "T";

export interface ICollectionAlphabet extends TimeStampProps {
  collects: Alphabet[];
  collectCnt: number;
  user: UserSimpleInfoProps;
  stamps: number;
}

export interface CollectionProps {
  alphabet: Alphabet;
  stamps?: number;
}
