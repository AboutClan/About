import { AxiosError } from "axios";
import { Dayjs } from "dayjs";
import { useMutation } from "react-query";
import { dayjsToStr } from "../../helpers/dateHelpers";
import { requestServer } from "../../helpers/methodHelpers";
import { MutationOptions } from "../../types/reactTypes";
import { IStudyParticipate } from "../../types/study/study";

import {
  IStudyPlaces,
  IStudyTime,
  IStudyVote,
} from "../../types2/studyTypes/studyVoteTypes";

type StudyParticipationParam<T> = T extends "post"
  ? IStudyVote
  : T extends "patch"
  ? IStudyTime
  : void;

export const useStudyParticipationMutation = <
  T extends "post" | "patch" | "delete"
>(
  voteDate: Dayjs,
  method: T,
  options?: MutationOptions<StudyParticipationParam<T>>
) =>
  useMutation<void, AxiosError, StudyParticipationParam<T>>((param) => {
    const voteInfo = param;
    if (method !== "delete") {
      const updatedVoteInfo = voteInfo as IStudyParticipate | IStudyTime;
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
  useMutation<any, AxiosError, void>(
    () =>
      requestServer<void>({
        method: "patch",
        url: `admin/vote/${date}/status/confirm`,
      }),
    options
  );

export const useStudyPreferenceMutation = (
  options?: MutationOptions<IStudyPlaces>
) =>
  useMutation<void, AxiosError, IStudyPlaces>(
    (votePlaces) =>
      requestServer<IStudyPlaces>({
        method: "post",
        url: `user/preference`,
        body: votePlaces,
      }),
    options
  );
