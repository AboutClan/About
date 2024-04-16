import { AxiosError } from "axios";
import { Dayjs } from "dayjs";
import { useMutation } from "react-query";

import { requestServer } from "../../libs/methodHelpers";
import { MutationOptions } from "../../types/hooks/reactTypes";
import {
  IStudyVote,
  IStudyVotePlaces,
  IStudyVoteTime,
} from "../../types/models/studyTypes/studyInterActions";
import { dayjsToStr } from "../../utils/dateTimeUtils";

type StudyParticipationParam<T> = T extends "post"
  ? IStudyVote
  : T extends "patch"
    ? IStudyVoteTime
    : void;

export const useStudyParticipationMutation = <
  T extends "post" | "patch" | "delete",
>(
  voteDate: Dayjs,
  method: T,
  options?: MutationOptions<StudyParticipationParam<T>>
) =>
  useMutation<void, AxiosError, StudyParticipationParam<T>>((param) => {
    const voteInfo = param;
    if (method !== "delete") {
      const updatedVoteInfo = voteInfo as IStudyVote | IStudyVoteTime;
      const { start, end } = updatedVoteInfo;
      updatedVoteInfo.start = voteDate
        .hour(start.hour())
        .minute(start.minute());
      updatedVoteInfo.end = voteDate.hour(end.hour()).minute(end.minute());
    }
    return requestServer<StudyParticipationParam<T>>({
      method,
      url: `vote/${dayjsToStr(voteDate)}`,
      body: voteInfo,
    });
  }, options);

interface IStudyQuickVoteParam {
  start: Dayjs;
  end: Dayjs;
}

export const useStudyQuickVoteMutation = (
  date: Dayjs,
  options?: MutationOptions<IStudyQuickVoteParam>
) =>
  useMutation<void, AxiosError, IStudyQuickVoteParam>(
    ({ start, end }) =>
      requestServer<IStudyQuickVoteParam>({
        method: "post",
        url: `vote/${dayjsToStr(date)}/quick`,
        body: { start, end },
      }),
    options
  );

export const useStudyOpenFreeMutation = (
  date: string,
  options?: MutationOptions<string>
) =>
  useMutation<void, AxiosError, string>(
    (placeId) =>
      requestServer<{ placeId: string }>({
        method: "patch",
        url: `vote/${date}/free`,
        body: { placeId },
      }),
    options
  );

export const useStudyAttendCheckMutation = (
  date: Dayjs,
  options?: MutationOptions<string>
) =>
  useMutation<void, AxiosError, string>(
    (memo) =>
      requestServer<{ memo: string }>({
        method: "patch",
        url: `vote/${dayjsToStr(date)}/arrived`,
        body: { memo },
      }),
    options
  );

export const useStudyAbsentMutation = (
  date: Dayjs,
  options?: MutationOptions<string>
) =>
  useMutation<void, AxiosError, string>(
    (message) =>
      requestServer<{ message: string }>({
        method: "post",
        url: `vote/${dayjsToStr(date)}/absence`,
        body: { message },
      }),
    options
  );

export const useStudyResultDecideMutation = (
  date: string,
  options?: MutationOptions<void>
) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useMutation<any, AxiosError, void>(
    () =>
      requestServer<void>({
        method: "patch",
        url: `admin/vote/${date}/status/confirm`,
      }),
    options
  );

export const useStudyPreferenceMutation = (
  options?: MutationOptions<IStudyVotePlaces>
) =>
  useMutation<void, AxiosError, IStudyVotePlaces>(
    (votePlaces) =>
      requestServer<IStudyVotePlaces>({
        method: "post",
        url: `user/preference`,
        body: votePlaces,
      }),
    options
  );
