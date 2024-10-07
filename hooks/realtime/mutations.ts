import { AxiosError } from "axios";
import { useMutation } from "react-query";
import { requestServer } from "../../libs/methodHelpers";
import { MutationOptions } from "../../types/hooks/reactTypes";
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
export const useRealtimeAttendMutation = (
  options?: MutationOptions<RealTimeBasicAttendanceProps>,
) =>
  useMutation<void, AxiosError, RealTimeBasicAttendanceProps>(
    (param) =>
      requestServer<RealTimeBasicAttendanceProps>({
        method: "post",
        url: `realtime/attendance`,
        body: param,
      }),
    options,
  );
