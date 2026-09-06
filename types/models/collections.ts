import { UserSimpleInfoProps } from "@/types/models/userTypes/userInfoTypes";
import { TimeStampProps } from "@/types/utils/timeAndDate";

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
