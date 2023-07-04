import axios, { AxiosError } from "axios";
import { Dayjs } from "dayjs";
import { useQuery, UseQueryOptions } from "react-query";
import { SERVER_URI } from "../../constants/system";
import { VOTE_GET } from "../../libs/queryKeys";
import { IStudyPreferencesQuery } from "../../modals/study/StudyQuickVoteModal";
import { IPlace, IStudyStart, IVote } from "../../types/studyDetails";
import { IArrivedData } from "../../types/studyRecord";
import { Location } from "../../types/system";
import { IAbsentInfo } from "../../types/userRequest";

export const useStudyVoteQuery = (
  date: Dayjs,
  location: Location,
  options?: Omit<
    UseQueryOptions<IVote, AxiosError, IVote>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<IVote, AxiosError, IVote>(
    [VOTE_GET, date, location],
    async () => {
      const res = await axios.get<IVote>(
        `${SERVER_URI}/vote/${date.format("YYYY-MM-DD")}?location=${location}` // location 변수를 API 요청 URL에 추가
      );
      return res.data;
    },
    options
  );
};

export const useStudyPlaceQuery = (
  options?: Omit<
    UseQueryOptions<IPlace[], AxiosError, IPlace[]>,
    "queryKey" | "queryFn"
  >
) =>
  useQuery<IPlace[], AxiosError, IPlace[]>(
    "studyPlace",
    async () => {
      const res = await axios.get<IPlace[]>(`${SERVER_URI}/place`);
      return res.data;
    },
    options
  );

export const useStudyStartTimeQuery = (
  date: Dayjs,
  options?: Omit<
    UseQueryOptions<IStudyStart[], AxiosError, IStudyStart[]>,
    "queryKey" | "queryFn"
  >
) =>
  useQuery(
    "studyStartTime",
    async () => {
      const res = await axios.get<IStudyStart[]>(
        `${SERVER_URI}/vote/${date.format("YYYY-MM-DD")}/start`
      );
      return res.data;
    },
    options
  );

export const useStudyCheckRecordsQuery = (
  startDay: Dayjs,
  endDay: Dayjs,
  options?: Omit<
    UseQueryOptions<IArrivedData[], AxiosError, IArrivedData[]>,
    "queryKey" | "queryFn"
  >
) =>
  useQuery(
    ["studyCheckRecords", startDay, endDay],
    async () => {
      const res = await axios.get<IArrivedData[]>(
        `${SERVER_URI}/vote/arrived`,
        {
          params: {
            startDay: startDay.format("YYYY-MM-DD"),
            endDay: endDay.format("YYYY-MM-DD"),
          },
        }
      );

      return res.data;
    },
    options
  );

export const useStudyAbsentQuery = (
  date: Dayjs,
  options?: Omit<
    UseQueryOptions<IAbsentInfo[], AxiosError, IAbsentInfo[]>,
    "queryKey" | "queryFn"
  >
) =>
  useQuery(
    "studyAbsent",
    async () => {
      const res = await axios.get<IAbsentInfo[]>(
        `${SERVER_URI}/vote/${date.format("YYYY-MM-DD")}/absence`
      );
      return res.data;
    },
    options
  );

export const useStudyPreferenceQuery = (
  options?: Omit<
    UseQueryOptions<IStudyPreferencesQuery, AxiosError, IStudyPreferencesQuery>,
    "queryKey" | "queryFn"
  >
) =>
  useQuery(
    "studyPreference",
    async () => {
      const res = await axios.get<IStudyPreferencesQuery>(
        `${SERVER_URI}/user/preference`
      );
      return res.data;
    },
    options
  );

// export const useStudyArrivedQuery = (
//   date: Dayjs,
//   options?: Omit<
//     UseQueryOptions<
//       { user: IUser; memo: string }[],
//       AxiosError,
//       { user: IUser; memo: string }[]
//     >,
//     "mutationKey" | "mutationFn"
//   >
// ) =>
//   useQuery<
//     { user: IUser; memo: string }[],
//     AxiosError,
//     { user: IUser; memo: string }[]
//   >(
//     ARRIVE_FINDMEMO,
//     async () => {
//       const res = await axios.get(
//         `${SERVER_URI}/vote/${date.format("YYYY-MM-DD")}/arrived`
//       );
//       return res.data;
//     },
//     options
//   );
