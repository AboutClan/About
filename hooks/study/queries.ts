import axios, { AxiosError } from "axios";
import dayjs, { Dayjs } from "dayjs";
import { useQuery, UseQueryOptions } from "react-query";

import {
  STUDY_ARRIVED_CNT,
  STUDY_PLACE,
  STUDY_PREFERENCE,
  STUDY_RECORD_MODAL_AT,
  STUDY_START_TIME,
  STUDY_VOTE,
  STUDY_VOTE_CNT,
} from "../../constants/keys/queryKeys";
import { SERVER_URI } from "../../constants/system";
import { setStudyOneDayData, setStudyWeekData } from "../../libs/study/studyConverters";
import { CoordinatesProps, TimeRangeProps } from "../../types/common";
import { QueryOptions } from "../../types/hooks/reactTypes";
import {
  RealTimesStudyStatus,
  StudyPlaceProps,
} from "../../types/models/studyTypes/study-entity.types";
import { StudySetProps } from "../../types/models/studyTypes/study-set.types";
import { IStudyVotePlaces } from "../../types/models/studyTypes/studyInterActions";
import { IArrivedData, VoteCntProps } from "../../types/models/studyTypes/studyRecords";
import { UserSimpleInfoProps } from "../../types/models/userTypes/userInfoTypes";
import { dayjsToStr } from "../../utils/dateTimeUtils";

export interface StudySetInitialDataProps {
  date: string;
  realTimes: InitialRealTimesProps[];
  participations: InitialParticipationsProps[];
  results: {
    center?: CoordinatesProps;
    members: { time: TimeRangeProps; user: UserSimpleInfoProps }[];
    place: StudyPlaceProps;
  }[];
  unmatchedUsers: UserSimpleInfoProps[];
  status: "expected" | "open";
}

export interface InitialParticipationsProps {
  start: string;
  end: string;
  locationDetail: string;
  latitude: number;
  longitude: number;
  user: UserSimpleInfoProps;
  isBeforeResult: boolean;
}

export interface InitialRealTimesProps {
  user: UserSimpleInfoProps;
  time: TimeRangeProps;
  status: RealTimesStudyStatus;
  place: StudyPlaceProps;
  attendance: {
    attendanceImage: string;
    memo: string;
    time: string;
    type: "arrived" | "absenced";
  };
  comment?: { text: string };
}

type StudyWeekQueryOptions = Omit<
  UseQueryOptions<StudySetInitialDataProps[], AxiosError, StudySetProps>,
  "queryKey" | "queryFn" | "select"
>;

const studyWeekCacheMap = new WeakMap<
  StudySetInitialDataProps[], // 서버 원본 배열 "참조" 키
  Map<string, StudySetProps> // dateKey별 결과 저장
>();

export const useStudySetQuery = (date: string, options?: StudyWeekQueryOptions) =>
  useQuery<StudySetInitialDataProps[], AxiosError, StudySetProps>(
    [STUDY_VOTE, "week"],
    async () => {
      const { data } = await axios.get<StudySetInitialDataProps[]>(`${SERVER_URI}/vote2/week`);

      return data;
    },
    {
      select: (data) => {
        if (dayjs(date).startOf("day").isBefore(dayjs().startOf("day"))) return null;
        let byDate = studyWeekCacheMap.get(data);
        if (!byDate) {
          byDate = new Map();
          studyWeekCacheMap.set(data, byDate);
        }
        const cached = byDate.get(date);
        if (cached) return cached;

        // 4) 미스 시: 계산해서 캐싱 후 반환
        const dateStart = dayjs(date).startOf("day");
        const filtered = data.filter((d) => !dayjs(d.date).startOf("day").isBefore(dateStart));
        const result = setStudyWeekData(filtered);

        byDate.set(date, result);

        return result;
      },
      ...options,
    },
  );

export interface InitialStudyPassedDayProps {
  realTimes: {
    userList: InitialStudyPassedDayUserProps[];
  };
  results: {
    center?: CoordinatesProps;
    members: { time: TimeRangeProps; user: UserSimpleInfoProps }[];
    place: StudyPlaceProps;
  }[];
}

export interface InitialStudyPassedDayUserProps {
  attendance: {
    attendanceImage: string;
    memo: string;
    time: string;
    type: "arrived" | "absenced";
  };
  place: StudyPlaceProps;
  comment?: { text: string };
  status: RealTimesStudyStatus;
  time: TimeRangeProps;
  user: UserSimpleInfoProps;
}

export const useStudyPassedDayQuery = (date: string, options?: QueryOptions<StudySetProps>) =>
  useQuery<StudySetProps, AxiosError, StudySetProps>(
    [STUDY_VOTE, date],
    async () => {
      const { data } = await axios.get<InitialStudyPassedDayProps>(
        `${SERVER_URI}/vote2/${date}/info`,
      );
   
      return setStudyOneDayData(data, date);
    },
    options,
  );

export const useStudyPlacesQuery = (
  status: "main" | "sub" | "all",
  options?: QueryOptions<StudyPlaceProps[]>,
) =>
  useQuery<StudyPlaceProps[], AxiosError, StudyPlaceProps[]>(
    [STUDY_PLACE, status],
    async () => {
      const res = await axios.get<StudyPlaceProps[]>(`${SERVER_URI}/place`, {
        params: {
          status,
        },
      });

      return res.data;
    },
    options,
  );

// export const useStudyVoteOneQuery = (
//   date: string,
//   options?: QueryOptions<{
//     data: StudyParticipationProps;
//     rankNum: number;
//   }>,
// ) =>
//   useQuery<
//     { data: StudyParticipationProps; rankNum: number },
//     AxiosError,
//     { data: StudyParticipationProps; rankNum: number }
//   >(
//     [STUDY_VOTE, date, "one"],
//     async () => {
//       const res = await axios.get<{
//         data: StudyParticipationProps | any[];
//         rankNum: number;
//       }>(`${SERVER_URI}/vote2/${date}/one`, {});
//       return res.data;
//     },
//     options,
//   );

interface IStudyStartTimeData {
  place_id: string;
  startTime: string;
}

export const useStudyStartTimeQuery = (
  date: Dayjs,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options?: QueryOptions<any>,
) =>
  useQuery(
    [STUDY_START_TIME, dayjsToStr(date)],
    async () => {
      const res = await axios.get<IStudyStartTimeData[]>(
        `${SERVER_URI}/vote/${dayjsToStr(date)}/start`,
      );

      return res.data.map((item) => ({
        ...item,
        startTime: dayjs(item.startTime),
      }));
    },
    options,
  );

export const useStudyAttendRecordQuery = (
  startDay: Dayjs,
  endDay: Dayjs,
  options?: QueryOptions<IArrivedData[]>,
) =>
  useQuery(
    [STUDY_RECORD_MODAL_AT, dayjsToStr(startDay), dayjsToStr(endDay)],
    async () => {
      const res = await axios.get<IArrivedData[]>(`${SERVER_URI}/vote/arrived`, {
        params: {
          startDay: dayjsToStr(startDay),
          endDay: dayjsToStr(endDay),
        },
      });
      return res.data;
    },
    options,
  );

interface IArrivedTotal {
  [key: string]: number;
}
export const useStudyArrivedCntQuery = (uid: string, options?: QueryOptions<number>) =>
  useQuery(
    [STUDY_ARRIVED_CNT, uid],
    async () => {
      if (!uid) return;
      const res = await axios.get<IArrivedTotal>(`${SERVER_URI}/vote/arriveCnt`);
      return res.data?.[uid];
    },
    options,
  );

export const useStudyPreferenceQuery = (options?: QueryOptions<IStudyVotePlaces>) =>
  useQuery(
    [STUDY_PREFERENCE],
    async () => {
      const res = await axios.get<{ studyPreference: IStudyVotePlaces }>(
        `${SERVER_URI}/user/preference`,
      );
      return res.data?.studyPreference;
    },
    options,
  );

export const useStudyDailyVoteCntQuery = (
  location,
  startDay,
  endDay,
  options?: QueryOptions<VoteCntProps[]>,
) =>
  useQuery(
    [STUDY_VOTE_CNT, location, dayjsToStr(startDay), dayjsToStr(endDay)],
    async () => {
      const res = await axios.get<VoteCntProps[]>(`${SERVER_URI}/vote/participationCnt`, {
        params: {
          location,
          startDay: dayjsToStr(startDay),
          endDay: dayjsToStr(endDay),
        },
      });
      return res.data;
    },
    options,
  );
