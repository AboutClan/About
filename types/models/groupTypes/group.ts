import { GatherCategoryMain } from "../../../constants/contentsText/GatherContents";
import { UserCommentProps } from "../../components/propTypes";
import { LocationFilterType } from "../../services/locationTypes";
import { TimeStampProps } from "../../utils/timeAndDate";
import { IUser, IUserSummary } from "../userTypes/userInfoTypes";

export type GroupStatus = "pending" | "end" | "imminent" | "full" | "planned" | "resting";
export interface IGroup extends IGroupWriting {
  createdAt: string;
  participants: GroupParicipantProps[];
  comments: UserCommentProps[];
  notionUrl?: string;
  requiredTicket: number;
  randomTicket: number;
}

export type GroupMemberRole = "member" | "manager" | "admin" | "regularMember";

export interface GroupParicipantProps {
  user: IUserSummary;
  role: GroupMemberRole;
  randomId?: number;
  deposit: number;
  lastMonthAttendance: boolean;
  monthAttendance: boolean;
}

export interface IGroupWriting extends TimeStampProps {
  category: IGroupWritingCategory;
  challenge?: string;
  title: string;
  // meetingType: "offline" | "online" | "hybrid";
  content: string;
  rules: string[];
  status: GroupStatus;
  guide: string;
  feeText: string;
  image?: string;
  fee: number;
  gender: boolean;
  isFree: boolean;
  age: number[];
  squareImage?: string;
  password: string;
  period: string;
  organizer: IUser;
  location: LocationFilterType;
  isSecret?: boolean;
  link?: string;
  questionText?: string[];
  hashTag?: string;
  attendance: IGroupAttendance;
  waiting: {
    user: IUser;
    answer?: string;
    pointType: "point" | "deposit";
  }[];
  memberCnt: {
    min: number;
    max: number;
  };
  id: number;
}

export interface IGroupWritingCategory {
  main: GatherCategoryMain;
  sub: string;
}
export interface IWeekRecord {
  uid: string;
  name: string;
  attendRecord: string[];
  attendRecordSub?: string[];
}
export interface IGroupAttendance {
  firstDate: string;
  lastWeek: IWeekRecord[];
  thisWeek: IWeekRecord[];
}
