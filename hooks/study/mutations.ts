import { AxiosError } from "axios";
import { Dayjs } from "dayjs";
import { useMutation } from "react-query";

import { requestServer } from "../../libs/methodHelpers";
import { MutationOptions } from "../../types/hooks/reactTypes";
import { CollectionProps } from "../../types/models/collections";
import { PlaceRegisterProps } from "../../types/models/studyTypes/studyDetails";
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

export const useStudyParticipationMutation = <T extends "post" | "patch" | "delete">(
  voteDate: Dayjs,
  method: T,
  options?: MutationOptions<StudyParticipationParam<T>>,
) =>
  useMutation<void, AxiosError, StudyParticipationParam<T>>((param) => {
    const voteInfo = param;
    if (method !== "delete") {
      const updatedVoteInfo = voteInfo as IStudyVote | IStudyVoteTime;
      const { start, end } = updatedVoteInfo;
      updatedVoteInfo.start = voteDate.hour(start.hour()).minute(start.minute());
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
  options?: MutationOptions<IStudyQuickVoteParam>,
) =>
  useMutation<void, AxiosError, IStudyQuickVoteParam>(
    ({ start, end }) =>
      requestServer<IStudyQuickVoteParam>({
        method: "post",
        url: `vote/${dayjsToStr(date)}/quick`,
        body: { start, end },
      }),
    options,
  );

export const useStudyOpenFreeMutation = (date: string, options?: MutationOptions<string>) =>
  useMutation<void, AxiosError, string>(
    (placeId) =>
      requestServer<{ placeId: string }>({
        method: "patch",
        url: `vote/${date}/free`,
        body: { placeId },
      }),
    options,
  );

export const useStudyAttendCheckMutation = (
  date: string,
  options?: MutationOptions<{ memo: string; endHour: Dayjs }, { data: CollectionProps }>,
) =>
  useMutation<{ data: CollectionProps }, AxiosError, { memo: string; endHour: Dayjs }>(
    ({ memo, endHour }) =>
      requestServer<{ memo: string; endHour: Dayjs }, { data: CollectionProps }>({
        method: "patch",
        url: `vote/${date}/arrived`,
        body: { memo, endHour },
      }),
    options,
  );

export const useStudyAbsentMutation = (date: Dayjs, options?: MutationOptions<string>) =>
  useMutation<void, AxiosError, string>(
    (message) =>
      requestServer<{ message: string }>({
        method: "post",
        url: `vote/${dayjsToStr(date)}/absence`,
        body: { message },
      }),
    options,
  );

export const useStudyResultDecideMutation = (date: string, options?: MutationOptions<void>) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useMutation<any, AxiosError, void>(
    () =>
      requestServer<void>({
        method: "patch",
        url: `admin/vote/${date}/status/confirm`,
      }),
    options,
  );

type StudyPreferenceParam<T> = T extends "post"
  ? IStudyVotePlaces
  : {
      id: string;
      type: "main" | "sub";
    };

export const useStudyPreferenceMutation = <T extends "post" | "patch">(
  method: T,
  options?: MutationOptions<StudyPreferenceParam<T>>,
) =>
  useMutation<void, AxiosError, StudyPreferenceParam<T>>(
    (param) =>
      requestServer<StudyPreferenceParam<T>>({
        method: method,
        url: `user/preference`,
        body: param,
      }),
    options,
  );

export const useStudyAdditionMutation = (options?: MutationOptions<PlaceRegisterProps>) =>
  useMutation<void, AxiosError, PlaceRegisterProps>(
    (placeInfo) =>
      requestServer<PlaceRegisterProps>({
        method: "post",
        url: `place`,
        body: placeInfo,
      }),
    options,
  );

interface StudyStatusParamProps {
  placeId: string;
  status: "active" | "inactive";
}

export const useStudyStatusMutation = (options?: MutationOptions<StudyStatusParamProps>) =>
  useMutation<void, AxiosError, StudyStatusParamProps>(
    (params) =>
      requestServer<StudyStatusParamProps>({
        method: "post",
        url: `place/status`,
        body: params,
      }),
    options,
  );
