import { AxiosError } from "axios";
import dayjs from "dayjs";
import { useMutation } from "react-query";

import { requestServer } from "../../libs/methodHelpers";
import { MutationOptions } from "../../types/hooks/reactTypes";
import { CollectionProps } from "../../types/models/collections";
import {
  RealTimeBasicAttendanceProps,
  RealTimeBasicVoteProps,
  StudyStatus,
} from "../../types/models/studyTypes/studyDetails";
import { IStudyVoteTime } from "../../types/models/studyTypes/studyInterActions";

export const useRealtimeVoteMutation = (options?: MutationOptions<RealTimeBasicVoteProps>) =>
  useMutation<void, AxiosError, RealTimeBasicVoteProps>(
    (param) =>
      requestServer<RealTimeBasicVoteProps>({
        method: "post",
        url: `realtime/basicVote`,
        body: param,
      }),
    options,
  );
export const useRealTimeAttendMutation = (
  options?: MutationOptions<RealTimeBasicAttendanceProps | FormData, CollectionProps>,
) =>
  useMutation<CollectionProps, AxiosError, RealTimeBasicAttendanceProps | FormData>(
    (param) =>
      requestServer<RealTimeBasicAttendanceProps | FormData, CollectionProps>({
        method: "post",
        url: `realtime/attendance`,
        body: param,
      }),
    options,
  );

export const useRealTimeTimeChangeMutation = (options?: MutationOptions<IStudyVoteTime>) =>
  useMutation<void, AxiosError, IStudyVoteTime>(({ start, end }) => {
    const startHour = dayjs().hour(start.hour()).minute(start.minute());
    const endHour = dayjs().hour(end.hour()).minute(end.minute());

    return requestServer<IStudyVoteTime>({
      method: "patch",
      url: `realtime/time`,
      body: { start: startHour, end: endHour },
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
