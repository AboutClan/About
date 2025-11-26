import { IUser, UserMemberShip } from "../../types/models/userTypes/userInfoTypes";
import { useUserInfoQuery } from "../user/queries";

export const useUserInfo = (): IUser => {
  const { data } = useUserInfoQuery();
  return data;
};

type MembershipStore = "study" | "store" | "dailyCheck" | "gather";

export const useHasMemership = (type: MembershipStore): boolean => {
  const membershipMapping: Record<MembershipStore, UserMemberShip[]> = {
    dailyCheck: ["manager", "studySupporters", "gatherSupporters", "newbie"],
    store: ["manager", "studySupporters", "gatherSupporters"],
    study: ["manager", "newbie", "studySupporters"],
    gather: ["gatherSupporters", "manager"],
  };

  const { data } = useUserInfoQuery();
  if (!data) return false;
  const membership = data.membership;

  return membershipMapping[type].includes(membership);
};
