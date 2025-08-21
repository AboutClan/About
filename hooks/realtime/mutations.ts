import { AxiosError } from "axios";
import dayjs from "dayjs";
import { useMutation } from "react-query";

import { requestServer } from "../../libs/methodHelpers";
import { MutationOptions } from "../../types/hooks/reactTypes";
import { CollectionProps } from "../../types/models/collections";
import {
  RealTimeAttendanceProps,
  RealTimeVoteProps,
} from "../../types/models/studyTypes/requestTypes";
import { StudyType } from "../../types/models/studyTypes/study-entity.types";
import { PlaceInfoProps } from "../../types/models/utilTypes";
import { DayjsTimeProps, StringTimeProps } from "../../types/utils/timeAndDate";

interface RealTimeVoteRequestServerProps {
  place: PlaceInfoProps;
  time: StringTimeProps;
}

export const useRealtimeVoteMutation = (
  date: string,
  options?: MutationOptions<RealTimeVoteProps>,
) =>
  useMutation<void, AxiosError, RealTimeVoteProps>((param) => {
    const { start, end } = param.time;
    const time = {
      start: start.toISOString(),
      end: end.toISOString(),
    };

    return requestServer<RealTimeVoteRequestServerProps>({
      method: "post",
      url: `realtime/${date}/basicVote`,
      body: { ...param, time },
    });
  }, options);

export const useRealTimeAttendMutation = (
  date: string,
  options?: MutationOptions<RealTimeAttendanceProps | FormData, CollectionProps>,
) =>
  useMutation<CollectionProps, AxiosError, RealTimeAttendanceProps | FormData>((param) => {
    return requestServer<RealTimeAttendanceProps | FormData, CollectionProps>({
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
        url: `realtime/comment`,
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

export const useRealTimeStatusMutation = (date: string, options?: MutationOptions<StudyType>) =>
  useMutation<void, AxiosError, StudyType>(
    (params) =>
      requestServer<{ status: StudyType }>({
        method: "patch",
        url: `realtime/status`,
        body: { status: params },
      }),
    options,
  );
