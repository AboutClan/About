import { Dayjs } from "dayjs";

import { UserCommentProps } from "../../components/propTypes";
import { Location } from "../../services/locationTypes";
import { TimeStampProps } from "../../utils/timeAndDate";
import { IUserSummary, UserSimpleInfoProps } from "../userTypes/userInfoTypes";

export interface IGather extends Omit<IGatherWriting, "date">, TimeStampProps {
  date: string;
  participants: IGatherParticipants[];
  id: number;
  status: GatherStatus;
  comments: UserCommentProps[];
  waiting: {
    user: IUserSummary;
    phase: "first" | "second";
  }[];
}

export interface IGatherWriting {
  type: IGatherType;
  place: Location | "전체";
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
  user: string | UserSimpleInfoProps;
  isAdminOpen?: boolean;
  image?: string;
  coverImage?: string;
  kakaoUrl?: string;
  isApprovalRequired?: boolean;
}

export type GatherCategory = "전체" | "모집중" | "완료";
export type IGatherType = { title: string; subtitle?: string };

export type GatherStatus = "open" | "close" | "end" | "pending" | "planned";

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
    hours?: number;
    minutes?: number;
  };
}
export interface IGatherParticipants {
  user: IUserSummary;
  phase?: "first" | "second";
}

// export interface IGatherHeader {
//   title: string;
//   date: Dayjs | string | "미정";
//   locationMain: string;
// }
