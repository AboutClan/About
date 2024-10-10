import { AxiosError } from "axios";
import { useMutation } from "react-query";
import { requestServer } from "../../libs/methodHelpers";
import { MutationOptions } from "../../types/hooks/reactTypes";
import { CollectionProps } from "../../types/models/collections";
import {
  RealTimeBasicAttendanceProps,
  RealTimeBasicVoteProps,
} from "../../types/models/studyTypes/studyDetails";

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
export const useRealTimeDirectAttendMutation = (
  options?: MutationOptions<RealTimeBasicAttendanceProps | FormData, CollectionProps>,
) =>
  useMutation<CollectionProps, AxiosError, RealTimeBasicAttendanceProps | FormData>(
    (param) =>
      requestServer<RealTimeBasicAttendanceProps | FormData, CollectionProps>({
        method: "post",
        url: `realtime/directAttendance`,
        body: param,
      }),
    options,
  );
