import axios, { AxiosError } from "axios";
import dayjs, { Dayjs } from "dayjs";
import { useQuery } from "react-query";

import {
  STUDY_ARRIVED_CNT,
  STUDY_ATTEND_RECORD,
  STUDY_PLACE,
  STUDY_PREFERENCE,
  STUDY_START_TIME,
  STUDY_VOTE,
  STUDY_VOTE_CNT,
} from "../../constants/keys/queryKeys";
import { SERVER_URI } from "../../constants/system";
import { QueryOptions } from "../../types/hooks/reactTypes";
import { IParticipation, IPlace, IStudy } from "../../types/models/studyTypes/studyDetails";
import { IStudyVotePlaces } from "../../types/models/studyTypes/studyInterActions";
import { IArrivedData, VoteCntProps } from "../../types/models/studyTypes/studyRecords";
import { Location } from "../../types/services/locationTypes";
import { dayjsToStr } from "../../utils/dateTimeUtils";

export const useStudyPlacesQuery = (
  location: Location | "all",
  active?: "active" | "inactive",
  options?: QueryOptions<IPlace[]>,
) =>
  useQuery<IPlace[], AxiosError, IPlace[]>(
    [STUDY_PLACE, location, active],
    async () => {
      const res = await axios.get<IPlace[]>(`${SERVER_URI}/place`, {
        params: {
          status: active,
        },
      });

      const places = res.data.filter(
        (place) =>
          place.brand !== "자유 신청" && (location === "all" || place.location === location),
      );
      return places;
    },
    options,
  );

export interface StudyVoteProps {}

export const useStudyVoteQuery = (
  date: string,
  location: Location,
  isBasic: boolean,
  isTwoDay: boolean,
  options?: QueryOptions<IStudy[]>,
) =>
  useQuery<IStudy[], AxiosError, IStudy[]>(
    [STUDY_VOTE, date, location, isBasic, isTwoDay],
    async () => {
      const res = await axios.get<IStudy[]>(`${SERVER_URI}/vote/${date}`, {
        params: { location, isBasic, isTwoDay },
      });
      return res.data;
    },
    options,
  );

export const useStudyVoteOneQuery = (
  date: string,
  id: string,
  options?: QueryOptions<IParticipation>,
) =>
  useQuery<IParticipation, AxiosError, IParticipation>(
    [STUDY_VOTE, date, id],
    async () => {
      const res = await axios.get<IParticipation>(`${SERVER_URI}/vote/${date}/one`, {
        params: { id },
      });
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
    [STUDY_ATTEND_RECORD, dayjsToStr(startDay), dayjsToStr(endDay)],
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
