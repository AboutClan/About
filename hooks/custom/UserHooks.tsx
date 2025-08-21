import { IUser } from "../../types/models/userTypes/userInfoTypes";
import { useUserInfoQuery } from "../user/queries";

export const useUserInfo = (): IUser => {
  const { data } = useUserInfoQuery();
  return data;
};
