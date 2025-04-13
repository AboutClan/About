import { AxiosError } from "axios";
import dayjs, { Dayjs } from "dayjs";
import { useMutation } from "react-query";

import { requestServer } from "../../libs/methodHelpers";
import { MutationOptions } from "../../types/hooks/reactTypes";
import { CollectionProps } from "../../types/models/collections";
import { PlaceRegisterProps } from "../../types/models/studyTypes/entityTypes";

import {
  IStudyVotePlaces,
  IStudyVoteTime,
  StudyVoteProps,
} from "../../types/models/studyTypes/studyInterActions";
import { StringTimeProps } from "../../types/utils/timeAndDate";
import { dayjsToStr } from "../../utils/dateTimeUtils";

type StudyVoteParam<T> = T extends "post"
  ? StudyVoteProps
  : T extends "patch"
  ? StringTimeProps
  : void;

export const useStudyVoteMutation = <T extends "post" | "patch" | "delete">(
  voteDate: Dayjs,
  method: T,
  options?: MutationOptions<StudyVoteParam<T>>,
) =>
  useMutation<void, AxiosError, StudyVoteParam<T>>((param) => {
    const voteInfo = param;

    if (method !== "delete") {
      const updatedVoteInfo = voteInfo as StudyVoteProps | IStudyVoteTime;
      const { start, end } = updatedVoteInfo;
      const startStr = voteDate.hour(start.hour()).minute(start.minute()).toISOString();
      const endStr = voteDate.hour(end.hour()).minute(end.minute()).toISOString();
      return requestServer<StudyVoteParam<T>>({
        method,
        url: `vote2/${dayjsToStr(voteDate)}`,
        body: { ...voteInfo, start: startStr, end: endStr },
      });
    }
    return requestServer<StudyVoteParam<T>>({
      method,
      url: `vote2/${dayjsToStr(voteDate)}`,
      body: { ...voteInfo },
    });
  }, options);

export const useStudyParticipateMutation = (
  voteDate: Dayjs,
  options?: MutationOptions<{ start: string; end: string; placeId: string }>,
) =>
  useMutation<void, AxiosError, { start: string; end: string; placeId: string }>((voteInfo) => {
    return requestServer<{ start: string; end: string; placeId: string }>({
      method: "post",
      url: `vote2/${dayjsToStr(voteDate)}/participate`,
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
  options?: MutationOptions<{ memo: string; end: string }, CollectionProps>,
) =>
  useMutation<CollectionProps, AxiosError, { memo: string; end: string }>(
    ({ memo, end }) =>
      requestServer<{ memo: string; end: string }, CollectionProps>({
        method: "post",
        url: `vote2/${dayjsToStr(dayjs())}/arrive`,
        body: { memo, end },
      }),
    options,
  );

export const useStudyAbsenceMutation = (date: Dayjs, options?: MutationOptions<string>) =>
  useMutation<void, AxiosError, string>(
    (message) =>
      requestServer<{ message: string }>({
        method: "post",
        url: `vote2/${dayjsToStr(date)}/absence`,
        body: { message },
      }),
    options,
  );
export const useDeleteMyVoteMutation = (date: Dayjs, options?: MutationOptions<void>) =>
  useMutation<void, AxiosError, void>(
    () =>
      requestServer<void>({
        method: "delete",
        url: `vote/${dayjsToStr(date)}/mine`,
      }),
    options,
  );

export const useStudyResultDecideMutation = (date: string, options?: MutationOptions<void>) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useMutation<any, AxiosError, void>(
    () =>
      requestServer<void>({
        method: "post",
        url: `vote2/${date}/result`,
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
export const useStudyCommentMutation = (date: string, options?: MutationOptions<string>) =>
  useMutation<void, AxiosError, string>(
    (params) =>
      requestServer<{ comment: string }>({
        method: "patch",
        url: `vote/${date}/comment`,
        body: { comment: params },
      }),
    options,
  );
