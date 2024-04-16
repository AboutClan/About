import { Dayjs } from "dayjs";

import { ActiveLocation, CombinedLocation } from "../../services/locationTypes";
import { ITimeStamps } from "../../utils/timeAndDate";
import { IUserSummary } from "../userTypes/userInfoTypes";

export interface IGather extends Omit<IGatherWriting, "date">, ITimeStamps {
  date: string;
  participants: IGatherParticipants[];
  id: number;
  status: GatherStatus;
  comment: IGatherComment[];
}

export interface IGatherWriting {
  type: IGatherType;
  place: ActiveLocation | CombinedLocation;
  genderCondition: boolean;
  title: string;
  content: string;
  gatherList: IGatherListItem[];
  date: Dayjs;
  location: IGatherLocation;
  memberCnt: IGatherMemberCnt;
  password?: string;
  age: number[];
  preCnt?: number;
  user: IUserSummary;
  isAdminOpen?: boolean;
  image?: string;
}

export type GatherCategory = "전체" | "모집중" | "완료";
export type IGatherType = { title: string; subtitle?: string };

export type GatherStatus = "open" | "close" | "end" | "pending";

export type IGatherLocation = {
  main: string;
  sub: string;
};

export type IGatherMemberCnt = {
  min: number;
  max: number;
};

export interface IGatherListItem {
  text: string;
  time: {
    hours: number;
    minutes: number;
  };
}
export interface IGatherParticipants {
  user: IUserSummary;
  phase: "first" | "second";
}

export interface IGatherComment extends ITimeStamps {
  user: IUserSummary;
  comment: string;
  _id: string;
}

// export interface IGatherHeader {
//   title: string;
//   date: Dayjs | string | "미정";
//   locationMain: string;
// }
