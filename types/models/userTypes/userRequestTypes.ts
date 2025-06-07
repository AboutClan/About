import { Dayjs } from "dayjs";

import { TimeStampProps } from "../../utils/timeAndDate";
import { IUser } from "./userInfoTypes";

export type UserRequestCategory =
  | "건의"
  | "신고"
  | "홍보"
  | "휴식"
  | "충전"
  | "탈퇴"
  | "불참"
  | "출석"
  | "배지"
  | "조모임"
  | "장소 추가"
  | "지원금"
  | "출금";

export interface IUserRequest extends TimeStampProps {
  category: UserRequestCategory;
  title?: string;
  date?: Dayjs;
  content?: string;
  rest?: { type: "일반" | "특별"; start: Dayjs; end: Dayjs };
  writer?: IUser;
}

export type DeclareRequest = "distance" | "declare";
