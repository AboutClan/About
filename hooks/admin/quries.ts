import axios, { AxiosError } from "axios";
import { Dayjs } from "dayjs";
import { useQuery } from "react-query";

import {
  ADMIN_STUDY_RECORD,
  USER_REGISTER_FORM,
  USER_REQUEST,
} from "../../constants/keys/queryKeys";
import { SERVER_URI } from "../../constants/system";
import { QueryOptions } from "../../types/hooks/reactTypes";
import { IUser, IUserRegisterForm } from "../../types/models/userTypes/userInfoTypes";
import { IUserRequest, UserRequestCategory } from "../../types/models/userTypes/userRequestTypes";
import { Location } from "../../types/services/locationTypes";
import { dayjsToStr } from "../../utils/dateTimeUtils";

export const useAdminUsersLocationControlQuery = (
  location: Location,
  filterType?: "score" | "monthScore",
  isSummary?: boolean,
  options?: QueryOptions<IUser[]>,
) =>
  useQuery<IUser[], AxiosError, IUser[]>(
    ["adminUserControl", location, isSummary, filterType],
    async () => {
      const res = await axios.get<IUser[]>(`${SERVER_URI}/admin/user`, {
        params: {
          location,
          isSummary,
          filterType,
        },
      });
      return res.data;
    },
    options,
  );

export const useUserRequestQuery = (
  category: UserRequestCategory,
  options?: QueryOptions<IUserRequest[]>,
) =>
  useQuery<IUserRequest[], AxiosError, IUserRequest[]>(
    [USER_REQUEST, category],
    async () => {
      const res = await axios.get<IUserRequest[]>(`${SERVER_URI}/request`);
      const filterData = res.data.filter((item) => item.category === category);
      return filterData;
    },
    options,
  );

export const useUserRegisterFormsQuery = (options?: QueryOptions<IUserRegisterForm[]>) =>
  useQuery<IUserRegisterForm[], AxiosError, IUserRegisterForm[]>(
    [USER_REGISTER_FORM],
    async () => {
      const res = await axios.get<IUserRegisterForm[]>(`${SERVER_URI}/register`);
      return res.data;
    },
    options,
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
  isAttend: boolean,
  location: Location,
  uid?: string,
  options?: QueryOptions<IAdminStudyRecordReturn>,
) =>
  useQuery(
    [ADMIN_STUDY_RECORD, startDay, endDay, isAttend, location, uid],
    async () => {
      const res = await axios.get<IAdminStudyRecordReturn>(`${SERVER_URI}/admin/vote/studyRecord`, {
        params: {
          startDay: dayjsToStr(startDay),
          endDay: dayjsToStr(endDay),
          isAttend,
          location,
          uid,
        },
      });
      return res.data;
    },
    options,
  );
