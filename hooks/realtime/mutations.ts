import { AxiosError } from "axios";
import { useMutation } from "react-query";
import { requestServer } from "../../libs/methodHelpers";
import { MutationOptions } from "../../types/hooks/reactTypes";
import { RealtimeBasicVoteProps } from "../../types/models/studyTypes/studyDetails";

export const useRealtimeVoteMutation = (options?: MutationOptions<RealtimeBasicVoteProps>) =>
  useMutation<void, AxiosError, RealtimeBasicVoteProps>(
    (param) =>
      requestServer<RealtimeBasicVoteProps>({
        method: "post",
        url: `realtime/basicVote`,
        body: param,
      }),
    options,
  );
