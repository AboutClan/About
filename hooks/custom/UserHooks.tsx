import { useCallback } from "react";

import { IUser, UserMemberShip } from "../../types/models/userTypes/userInfoTypes";
import { useUserInfoQuery } from "../user/queries";
import { useTypeToast } from "./CustomToast";

export const useUserInfo = (): IUser => {
  const { data } = useUserInfoQuery();
  return data;
};

export const useCheckGuest = (): boolean | undefined => {
  const { data } = useUserInfoQuery();
  if (!data) return undefined;

  return data?.role === "guest";
};

export const useDenyGuest = () => {
  const isGuest = useCheckGuest();
  const typeToast = useTypeToast();

  return useCallback(
    function denyGuest<TArgs extends unknown[], TResult>(
      callback: (...args: TArgs) => TResult,
      ...args: TArgs
    ): TResult | undefined {
      // 유저 정보 조회 전에는 실행하지 않음
      if (isGuest === undefined) {
        return undefined;
      }

      if (isGuest) {
        typeToast("guest");
        return undefined;
      }

      return callback(...args);
    },
    [isGuest, typeToast],
  );
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
