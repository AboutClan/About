import { GatherCategoryMain } from "../../../constants/contentsText/GatherContents";
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
  date: string;
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
  category?: GatherCategory;
  groupId?: string;
}

export type GatherCategory = "gather" | "event" | "group";
export type IGatherType = { title: GatherCategoryMain; subtitle?: string };

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
  reviewed?: boolean;
  absence?: boolean;
}

// export interface IGatherHeader {
//   title: string;
//   date: Dayjs | string | "미정";
//   locationMain: string;
// }
