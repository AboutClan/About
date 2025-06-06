import axios, { AxiosError } from "axios";
import dayjs, { Dayjs } from "dayjs";
import { useQuery } from "react-query";

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
import { QueryOptions } from "../../types/hooks/reactTypes";
import {
  RealTimeMemberProps,
  StudyParticipationProps,
  StudyPlaceProps,
  StudyVoteDataProps,
} from "../../types/models/studyTypes/baseTypes";
import { IStudyVotePlaces } from "../../types/models/studyTypes/studyInterActions";
import { IArrivedData, VoteCntProps } from "../../types/models/studyTypes/studyRecords";
import { Location } from "../../types/services/locationTypes";
import { dayjsToStr } from "../../utils/dateTimeUtils";

export const useStudyPlacesQuery = (
  location: Location | "all",
  active?: "active" | "inactive",
  options?: QueryOptions<StudyPlaceProps[]>,
) =>
  useQuery<StudyPlaceProps[], AxiosError, StudyPlaceProps[]>(
    [STUDY_PLACE, location, active],
    async () => {
  
      const res = await axios.get<StudyPlaceProps[]>(`${SERVER_URI}/place`, {
        params: {
          status: active,
        },
      });
 
      const places = res.data.filter((place) => place.brand !== "자유 신청" && location === "all");
      return places;
    },
    options,
  );

export const useStudyVoteQuery = (date: string, options?: QueryOptions<StudyVoteDataProps>) =>
  useQuery<StudyVoteDataProps, AxiosError, StudyVoteDataProps>(
    [STUDY_VOTE, date],
    async () => {
      const res = await axios.get<StudyVoteDataProps>(`${SERVER_URI}/vote2/${date}/info`);
      return res.data;
    },
    options,
  );

export const useStudyVoteOneQuery = (
  date: string,
  options?: QueryOptions<{
    data: StudyParticipationProps | RealTimeMemberProps[];
    rankNum: number;
  }>,
) =>
  useQuery<
    { data: StudyParticipationProps | RealTimeMemberProps[]; rankNum: number },
    AxiosError,
    { data: StudyParticipationProps | RealTimeMemberProps[]; rankNum: number }
  >(
    [STUDY_VOTE, date],
    async () => {
      const res = await axios.get<{
        data: StudyParticipationProps | RealTimeMemberProps[];
        rankNum: number;
      }>(`${SERVER_URI}/vote2/${date}/one`, {});
      return res.data;
    },
    options,
  );

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
