import { Dayjs } from "dayjs";

import { Location } from "../../services/locationTypes";
import { ITimeStamps } from "../../utils/timeAndDate";

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
  | "장소 추가";

export interface IUserRequest extends ITimeStamps {
  category: UserRequestCategory;
  location?: Location;
  title?: string;
  date?: Dayjs;
  writer: string;
  content?: string;
  rest?: { type: "일반" | "특별"; start: Dayjs; end: Dayjs };
}

export type DeclareRequest = "distance" | "declare";
