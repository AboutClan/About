import { ABOUT_USER_SUMMARY } from "../constants/serviceConstants/userConstants";
import { GroupParicipantProps } from "../types/models/groupTypes/group";

// 어바웃 운영진 계정은 그룹 개설을 위해 형식상 참여시킨 유저라 인원수 계산에서 제외한다.
export const getGroupParticipantCount = (participants: GroupParicipantProps[]): number =>
  participants.filter((par) => par?.user?._id !== ABOUT_USER_SUMMARY._id).length;
