import { AxiosError } from "axios";
import dayjs from "dayjs";
import { useMutation } from "react-query";

import { requestServer } from "../../libs/methodHelpers";
import { MutationOptions } from "../../types/hooks/reactTypes";
import { CollectionProps } from "../../types/models/collections";
import { StudyStatus } from "../../types/models/studyTypes/baseTypes";
import {
  RealTimeAttendanceProps,
  RealTimeVoteProps,
} from "../../types/models/studyTypes/requestTypes";
import { PlaceInfoProps } from "../../types/models/utilTypes";
import { DayjsTimeProps, StringTimeProps } from "../../types/utils/timeAndDate";

interface RealTimeVoteRequestServerProps {
  place: PlaceInfoProps;
  time: StringTimeProps;
}

export const useRealtimeVoteMutation = (options?: MutationOptions<RealTimeVoteProps>) =>
  useMutation<void, AxiosError, RealTimeVoteProps>((param) => {
    const { start, end } = param.time;
    const time = {
      start: start.toISOString(),
      end: end.toISOString(),
    };
    return requestServer<RealTimeVoteRequestServerProps>({
      method: "post",
      url: `realtime/basicVote`,
      body: { ...param, time },
    });
  }, options);

export const useRealTimeAttendMutation = (
  options?: MutationOptions<RealTimeAttendanceProps | FormData, CollectionProps>,
) =>
  useMutation<CollectionProps, AxiosError, RealTimeAttendanceProps | FormData>(
    (param) =>
      requestServer<RealTimeAttendanceProps | FormData, CollectionProps>({
        method: "post",
        url: `realtime/attendance`,
        body: param,
      }),
    options,
  );

export const useRealTimeTimeChangeMutation = (options?: MutationOptions<DayjsTimeProps>) =>
  useMutation<void, AxiosError, DayjsTimeProps>(({ start, end }) => {
    const startHour = dayjs().hour(start.hour()).minute(start.minute());
    const endHour = dayjs().hour(end.hour()).minute(end.minute());

    return requestServer<StringTimeProps>({
      method: "patch",
      url: `realtime/time`,
      body: { start: startHour.toISOString(), end: endHour.toISOString() },
    });
  }, options);

export const useRealTimeCommentMutation = (options?: MutationOptions<string>) =>
  useMutation<void, AxiosError, string>(
    (params) =>
      requestServer<{ comment: string }>({
        method: "patch",
        url: `realtime/comment`,
        body: { comment: params },
      }),
    options,
  );
export const useRealTimeCancelMutation = (options?: MutationOptions<void>) =>
  useMutation<void, AxiosError, void>(
    () =>
      requestServer<void>({
        method: "delete",
        url: `realtime/cancel`,
      }),
    options,
  );

export const useRealTimeStatusMutation = (options?: MutationOptions<StudyStatus>) =>
  useMutation<void, AxiosError, StudyStatus>(
    (params) =>
      requestServer<{ status: StudyStatus }>({
        method: "patch",
        url: `realtime/status`,
        body: { status: params },
      }),
    options,
  );
