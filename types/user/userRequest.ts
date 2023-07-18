import { Dayjs } from "dayjs";

export type UserRequestCategory =
  | "건의"
  | "신고"
  | "홍보"
  | "휴식"
  | "충전"
  | "탈퇴"
  | "불참";

export interface IUserRequest {
  category: UserRequestCategory;
  title?: string;
  date?: Dayjs;
  writer: string;
  content?: string;
  rest?: { type: "일반" | "특별"; start: Dayjs; end: Dayjs };
}