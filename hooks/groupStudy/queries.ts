import axios, { AxiosError } from "axios";
import { useQuery } from "react-query";

import { GatherCategoryMain } from "../../constants/contentsText/GatherContents";
import { GATHER_CONTENT, GROUP_STUDY } from "../../constants/keys/queryKeys";
import { SERVER_URI } from "../../constants/system";
import { IGatherSummary } from "../../pages/review";
import { QueryOptions } from "../../types/hooks/reactTypes";
import { IGather } from "../../types/models/gatherTypes/gatherTypes";
import { GroupStatus, IGroup, IGroupAttendance } from "../../types/models/groupTypes/group";

export interface GroupShapShotProps {
  hobby: IGroup[];
  hobby2: IGroup[];
  develop: IGroup[];
  waiting: IGroup[];
}

export const useGroupOnlyStudyQuery = (options?: QueryOptions<{ study: IGroup[] }>) =>
  useQuery<{ study: IGroup[] }, AxiosError, { study: IGroup[] }>(
    [GROUP_STUDY, "study"],
    async () => {
      const res = await axios.get<{ study: IGroup[] }>(`${SERVER_URI}/groupStudy/study`, {});

      return res.data;
    },
    options,
  );
export const useGroupSnapshotQuery = (options?: QueryOptions<GroupShapShotProps>) =>
  useQuery<GroupShapShotProps, AxiosError, GroupShapShotProps>(
    [GROUP_STUDY, "snapshot"],
    async () => {
      const res = await axios.get<GroupShapShotProps>(`${SERVER_URI}/groupStudy/snapshot`, {});
      return res.data;
    },
    options,
  );

export const useGroupMyStatusQuery = (
  cursor?: number,
  status?: "isParticipating" | "isEnded" | "isOwner",
  options?: QueryOptions<IGroup[]>,
) =>
  useQuery<IGroup[], AxiosError>(
    [GROUP_STUDY, "status", cursor, status],
    async () => {
      const res = await axios.get<IGroup[]>(`${SERVER_URI}/groupStudy/status`, {
        params: { cursor, status },
      });
      return res.data;
    },
    options,
  );

export const useGroupQuery = (
  filter: GroupStatus,
  category: GatherCategoryMain | "전체",
  cursor: number,
  options?: QueryOptions<IGroup[]>,
) =>
  useQuery<IGroup[], AxiosError, IGroup[]>(
    [GROUP_STUDY, filter, category, cursor],
    async () => {
      const res = await axios.get<IGroup[]>(`${SERVER_URI}/groupStudy`, {
        params: { filter, category, cursor },
      });

      return res.data;
    },
    options,
  );
export const useGroupsMineQuery = (status: "pending" | "all", options?: QueryOptions<IGroup[]>) =>
  useQuery<IGroup[], AxiosError, IGroup[]>(
    [GROUP_STUDY, status],
    async () => {
      const res = await axios.get<IGroup[]>(`${SERVER_URI}/groupStudy/mine`, {
        params: { status },
      });
      return res.data;
    },
    options,
  );
export const useGroupsTitleQuery = (
  userId: string,
  options?: QueryOptions<{ _id: string; title: string; category: { sub: string } }[]>,
) =>
  useQuery<
    { _id: string; title: string; category: { sub: string } }[],
    AxiosError,
    { _id: string; title: string; category: { sub: string } }[]
  >(
    [GROUP_STUDY, userId],
    async () => {
      const res = await axios.get<{ _id: string; title: string; category: { sub: string } }[]>(
        `${SERVER_URI}/groupStudy/profile/${userId}`,
        {},
      );
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

      const data = res.data;
      return { ...data, participants: data?.participants?.filter((par) => !!par?.user?.uid) };
    },
    options,
  );

export interface GradeProps {
  [uid: string]: {
    great: number;
    good: number;
    soso: number;
    block: number;
  };
}

export const useGroupIdMannerQuery = (
  groupStudyId?: string,
  options?: QueryOptions<GradeProps[]>,
) =>
  useQuery<GradeProps[], AxiosError, GradeProps[]>(
    [GROUP_STUDY, "manner", groupStudyId],
    async () => {
      const res = await axios.get<GradeProps[]>(`${SERVER_URI}/groupStudy/manner`, {
        params: { groupStudyId },
      });

      const data = res.data;
      return data;
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
