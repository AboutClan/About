import { AxiosError } from "axios";
import dayjs from "dayjs";
import { useMutation } from "react-query";

import { requestServer } from "../../libs/methodHelpers";
import { LocationProps, PointInfoProps } from "../../types/common";
import { MutationOptions } from "../../types/hooks/reactTypes";
import {
  RealTimeAttendanceProps,
  RealTimeVoteProps,
} from "../../types/models/studyTypes/requestTypes";
import { RealTimesStudyStatus } from "../../types/models/studyTypes/study-entity.types";
import { DayjsTimeProps, StringTimeProps } from "../../types/utils/timeAndDate";

interface RealTimeVoteRequestServerProps {
  place: LocationProps;
  time: StringTimeProps;
}

interface RealTimesVoteReturnProps extends PointInfoProps {
  _id: string;
}

export const useRealtimeVoteMutation = (
  date: string,
  options?: MutationOptions<RealTimeVoteProps, RealTimesVoteReturnProps>,
) =>
  useMutation<RealTimesVoteReturnProps, AxiosError, RealTimeVoteProps>((param) => {
    const { start, end } = param.time;
    const time = {
      start: start.toISOString(),
      end: end.toISOString(),
    };

    return requestServer<RealTimeVoteRequestServerProps, RealTimesVoteReturnProps>({
      method: "post",
      url: `realtime/${date}/basicVote`,
      body: { ...param, time },
    });
  }, options);

interface RealTimesInviteProps extends RealTimeVoteProps {
  userId: string;
}

export const useRealtimeInviteMutation = (
  date: string,
  options?: MutationOptions<RealTimesInviteProps, RealTimesVoteReturnProps>,
) =>
  useMutation<RealTimesVoteReturnProps, AxiosError, RealTimesInviteProps>((param) => {
    const { start, end } = param.time;
    const time = {
      start: start.toISOString(),
      end: end.toISOString(),
    };

    return requestServer<RealTimeVoteRequestServerProps, RealTimesVoteReturnProps>({
      method: "post",
      url: `realtime/${date}/invite`,
      body: { ...param, time },
    });
  }, options);

export const useRealTimeHeartMutation = (
  date: string,
  options?: MutationOptions<{ userId: string }, void>,
) =>
  useMutation<void, AxiosError, { userId: string }>((param) => {
    return requestServer<{ userId: string }, void>({
      method: "post",
      url: `realtime/${date}/heart`,
      body: param,
    });
  }, options);

export const useRealTimeAttendMutation = (
  date: string,
  options?: MutationOptions<RealTimeAttendanceProps | FormData, PointInfoProps>,
) =>
  useMutation<PointInfoProps, AxiosError, RealTimeAttendanceProps | FormData>((param) => {
    return requestServer<RealTimeAttendanceProps | FormData, PointInfoProps>({
      method: "post",
      url: `realtime/${date}/attendance`,
      body: param,
    });
  }, options);

export const useRealTimeTimeChangeMutation = (
  date: string,
  options?: MutationOptions<DayjsTimeProps>,
) =>
  useMutation<void, AxiosError, DayjsTimeProps>(({ start, end }) => {
    const startHour = dayjs().hour(start.hour()).minute(start.minute());
    const endHour = dayjs().hour(end.hour()).minute(end.minute());

    return requestServer<StringTimeProps>({
      method: "patch",
      url: `realtime/${date}/time`,
      body: { start: startHour.toISOString(), end: endHour.toISOString() },
    });
  }, options);

export const useRealTimeCommentMutation = (date: string, options?: MutationOptions<string>) =>
  useMutation<void, AxiosError, string>(
    (params) =>
      requestServer<{ comment: string }>({
        method: "patch",
        url: `realtime/${date}/comment`,
        body: { comment: params },
      }),
    options,
  );
export const useRealTimeCancelMutation = (date: string, options?: MutationOptions<void>) =>
  useMutation<void, AxiosError, void>(
    () =>
      requestServer<void>({
        method: "delete",
        url: `realtime/${date}/cancel`,
      }),
    options,
  );
export const useRealTimeAbsenceMutation = (date: string, options?: MutationOptions<void>) =>
  useMutation<void, AxiosError, void>(
    () =>
      requestServer<void>({
        method: "patch",
        url: `realtime/${date}/absence`,
      }),
    options,
  );

export const useRealTimeStatusMutation = (
  date: string,
  options?: MutationOptions<RealTimesStudyStatus>,
) =>
  useMutation<void, AxiosError, RealTimesStudyStatus>(
    (params) =>
      requestServer<{ status: RealTimesStudyStatus }>({
        method: "patch",
        url: `realtime/status`,
        body: { status: params },
      }),
    options,
  );
