import { UserRole } from "../../types/models/userTypes/userInfoTypes";

export const USER_ROLE: Record<UserRole, string> = {
  human: "수습 멤버",
  manager: "운영진",
  member: "동아리원",
  guest: "게스트",
  newUser: "신규 인원",
  previliged: "관리자",
  resting: "휴식 멤버",
  waiting: "대기 인원",
  enthusiastic: "열활 멤버",
  support: "서포터즈",
  block: "정지멤버",
};
