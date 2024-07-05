import { GROUP_STUDY_CATEGORY_ARR } from "../../../constants/contentsText/GroupStudyContents";
import { LocationFilterType } from "../../services/locationTypes";
import { ITimeStamps } from "../../utils/timeAndDate";
import { GatherStatus, IGatherComment } from "../gatherTypes/gatherTypes";
import { IUser, IUserSummary } from "../userTypes/userInfoTypes";

export type GroupCategory = (typeof GROUP_STUDY_CATEGORY_ARR)[number];

export interface IGroup extends IGroupWriting {
  createdAt: string;
  participants: GroupParicipantProps[];
  comment: IGatherComment[];
}

export interface GroupParicipantProps {
  user: IUserSummary;
  role: "member" | "manager" | "admin";
  attendCnt?: number;
  randomId?: number;
}

export interface IGroupWriting extends ITimeStamps {
  category: IGroupWritingCategory;
  challenge?: string;
  title: string;
  content: string;
  rules: string[];
  status: GatherStatus | "gathering";
  guide: string;
  feeText: string;
  image?: string;
  fee: number;
  gender: boolean;
  isFree: boolean;
  age: number[];
  password: string;
  period: string;
  organizer: IUser;
  location: LocationFilterType;
  isSecret?: boolean;
  link?: string;
  questionText?: string;
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
  main: string;
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
