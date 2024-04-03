import axios, { AxiosError } from "axios";
import { Dayjs } from "dayjs";
import { useQuery } from "react-query";
import {
  ADMIN_STUDY_RECORD,
  USER_REGISTER_FORM,
  USER_REQUEST,
} from "../../constants/keys/queryKeys";
import { SERVER_URI } from "../../constants/system";
import { dayjsToStr } from "../../helpers/dateHelpers";
import { QueryOptions } from "../../types/reactTypes";
import { Location } from "../../types/system";
import { IUserRegisterForm } from "../../types/user/user";
import {
  IUserRequest,
  UserRequestCategory,
} from "../../types/user/userRequest";
import { IUser } from "../../types2/userTypes/userInfoTypes";

export const useAdminUsersControlQuery = (options?: QueryOptions<IUser[]>) =>
  useQuery<IUser[], AxiosError, IUser[]>(
    "adminUserControl",
    async () => {
      const res = await axios.get<IUser[]>(`${SERVER_URI}/admin/user`);
      return res.data;
    },
    options
  );

export const useAdminUsersLocationControlQuery = (
  location: Location,
  options?: QueryOptions<IUser[]>
) =>
  useQuery<IUser[], AxiosError, IUser[]>(
    ["adminUserControl", location],
    async () => {
      const res = await axios.get<IUser[]>(`${SERVER_URI}/admin/user`, {
        params: {
          location,
        },
      });
      return res.data;
    },
    options
  );

export const useUserRequestQuery = (
  category: UserRequestCategory,
  options?: QueryOptions<IUserRequest[]>
) =>
  useQuery<IUserRequest[], AxiosError, IUserRequest[]>(
    [USER_REQUEST, category],
    async () => {
      const res = await axios.get<IUserRequest[]>(`${SERVER_URI}/request`);
      const filterData = res.data.filter((item) => item.category === category);
      return filterData;
    },
    options
  );

export const useUserRegisterFormsQuery = (
  options?: QueryOptions<IUserRegisterForm[]>
) =>
  useQuery<IUserRegisterForm[], AxiosError, IUserRegisterForm[]>(
    [USER_REGISTER_FORM],
    async () => {
      const res = await axios.get<IUserRegisterForm[]>(
        `${SERVER_URI}/register`
      );
      return res.data;
    },
    options
  );

interface IAdminStudyRecordReturn {
  [key: string]: IStudyRecord;
}

export interface IStudyRecord {
  attend: number;
  vote: number;
  monthAcc: number;
}

export const useAdminStudyRecordQuery = (
  startDay: Dayjs,
  endDay: Dayjs,
  isAttend: Boolean,
  location: Location,
  uid?: string,
  options?: QueryOptions<IAdminStudyRecordReturn>
) =>
  useQuery(
    [ADMIN_STUDY_RECORD, startDay, endDay, isAttend, location, uid],
    async () => {
      const res = await axios.get<IAdminStudyRecordReturn>(
        `${SERVER_URI}/admin/vote/studyRecord`,
        {
          params: {
            startDay: dayjsToStr(startDay),
            endDay: dayjsToStr(endDay),
            isAttend,
            location,
            uid,
          },
        }
      );
      return res.data;
    },
    options
  );
