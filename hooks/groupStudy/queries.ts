import axios, { AxiosError } from "axios";
import { useQuery } from "react-query";

import { GATHER_CONTENT, GROUP_STUDY, GROUP_STUDY_ALL } from "../../constants/keys/queryKeys";
import { SERVER_URI } from "../../constants/system";
import { IGatherSummary } from "../../pages/review";
import { QueryOptions } from "../../types/hooks/reactTypes";
import { IGather } from "../../types/models/gatherTypes/gatherTypes";
import { GroupStatus, IGroup, IGroupAttendance } from "../../types/models/groupTypes/group";

export const useGroupQuery = (
  filter: GroupStatus,

  options?: QueryOptions<IGroup[]>,
) =>
  useQuery<IGroup[], AxiosError, IGroup[]>(
    [GROUP_STUDY_ALL, filter],
    async () => {
      const res = await axios.get<IGroup[]>(`${SERVER_URI}/groupStudy`, {
        params: { filter },
      });

      return res.data;
    },
    options,
  );

export const useGroupIdQuery = (groupStudyId?: string, options?: QueryOptions<IGroup>) =>
  useQuery<IGroup, AxiosError, IGroup>(
    [GROUP_STUDY, groupStudyId],
    async () => {
      const res = await axios.get<IGroup>(`${SERVER_URI}/groupStudy`, {
        params: { groupStudyId },
      });

      return res.data;
    },
    options,
  );

export const useGroupAttendanceQuery = (id: number, options?: QueryOptions<IGroupAttendance>) =>
  useQuery<IGroupAttendance, AxiosError, IGroupAttendance>(
    [GROUP_STUDY, "attendance"],
    async () => {
      const res = await axios.get<IGroupAttendance>(`${SERVER_URI}/group/attendance/${id}`);
      return res.data;
    },
    options,
  );
export const useGroupWaitingQuery = (id: number, options?: QueryOptions<IGroupAttendance>) =>
  useQuery<IGroupAttendance, AxiosError, IGroupAttendance>(
    [GROUP_STUDY, "waiting"],
    async () => {
      const res = await axios.get<IGroupAttendance>(`${SERVER_URI}/group/waiting/${id}`);
      return res.data;
    },
    options,
  );

export const useGatherAllSummaryQuery = (options?: QueryOptions<IGatherSummary[]>) =>
  useQuery<IGatherSummary[], AxiosError, IGatherSummary[]>(
    [GATHER_CONTENT, "summary"],
    async () => {
      const res = await axios.get<IGather[]>(`${SERVER_URI}/gather`);
      const data = res.data.map((item) => ({
        title: item.title,
        type: item.type,
        location: item.location,
        date: item.date,
        id: item.id,
        place: item.place,
      }));
      return data;
    },
    options,
  );
