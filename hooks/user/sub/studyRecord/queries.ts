import axios, { AxiosError } from "axios";
import { Dayjs } from "dayjs";
import { useQuery } from "react-query";

import { USER_ATTEND_RATE, USER_FINDPARTICIPATION } from "../../../../constants/keys/queryKeys";
import { SERVER_URI } from "../../../../constants/system";
import { QueryOptions } from "../../../../types/hooks/reactTypes";
import { IVoteRate } from "../../../../types/models/studyTypes/studyRecords";
import { ActiveLocation } from "../../../../types/services/locationTypes";
import { IDayjsStartToEnd } from "../../../../types/utils/timeAndDate";
import { dayjsToStr } from "../../../../utils/dateTimeUtils";

type UserAttendRateReturn<T> = T extends true ? IVoteRate : IVoteRate[];

export const useUserAttendRateQuery = <T extends boolean>(
  startDay: Dayjs,
  endDay: Dayjs,
  isUserScope: T = true as T,
  summary: boolean,
  location?: ActiveLocation,
  options?: QueryOptions<UserAttendRateReturn<T>>,
) =>
  useQuery<UserAttendRateReturn<T>, AxiosError, UserAttendRateReturn<T>>(
    [USER_ATTEND_RATE, dayjsToStr(startDay), dayjsToStr(endDay), isUserScope, summary, location],
    async () => {
    
      const scopeQuery = isUserScope ? "" : "all";
      const res = await axios.get<UserAttendRateReturn<T>>(
        `${SERVER_URI}/user/participationrate/${scopeQuery}`,
        {
          params: {
            startDay: startDay.format("YYYY-MM-DD"),
            endDay: endDay.format("YYYY-MM-DD"),
            ...(summary ? { summary: true } : {}),
            ...(location ? { location } : {}),
          },
        },
      );
      return res.data;
    },
    options,
  );

type UserAttendRatesGet<T> = T extends true ? IVoteRate : IVoteRate[];
type UserAttendRatesReturn<T> = T extends true ? number[] : IVoteRate[][];

export const useUserAttendRateQueries = <T extends boolean>(
  monthList: IDayjsStartToEnd[],
  isUserScope: T = true as T,
  options?: QueryOptions<UserAttendRatesReturn<T>>,
) => {
  const scopeQuery = isUserScope ? "" : "all";
  const queryFn = async (month: IDayjsStartToEnd) => {
    const res = await axios.get<UserAttendRatesGet<T>>(
      `${SERVER_URI}/user/participationrate/${scopeQuery}`,
      {
        params: {
          startDay: month.start.format("YYYY-MM-DD"),
          endDay: month.end.format("YYYY-MM-DD"),
        },
      },
    );
    if (isUserScope) return (res.data as IVoteRate).cnt;
    return res.data as IVoteRate[];
  };
  const queryFns = monthList.map((month) => queryFn(month));
  return useQuery(
    [USER_FINDPARTICIPATION, isUserScope, monthList],
    async () => {
      const results = await Promise.all(queryFns);
      return results;
    },
    options,
  );
};
