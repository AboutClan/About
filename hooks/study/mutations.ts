import { AxiosError } from "axios";
import dayjs, { Dayjs } from "dayjs";
import { useMutation } from "react-query";

import { requestServer } from "../../libs/methodHelpers";
import { PointInfoProps, PointValueProps } from "../../types/common";
import { MutationOptions } from "../../types/hooks/reactTypes";
import { PlaceRegisterProps, PlaceReviewProps } from "../../types/models/studyTypes/entityTypes";
import { IStudyVoteTime, StudyVoteProps } from "../../types/models/studyTypes/studyInterActions";
import { DayjsTimeProps, StringTimeProps } from "../../types/utils/timeAndDate";
import { dayjsToStr } from "../../utils/dateTimeUtils";

type StudyVoteParam<T> = T extends "`p`ost"
  ? StudyVoteProps
  : T extends "patch"
  ? DayjsTimeProps
  : void;

export const useStudyVoteArrMutation = (
  dates: string[],
  options?: MutationOptions<StudyVoteProps>,
) =>
  useMutation<void, AxiosError, StudyVoteProps>((voteInfo) => {
    const { start, end } = voteInfo;
    return requestServer<{
      start: string;
      end: string;
      latitude: number;
      longitude: number;
      dates: string[];
    }>({
      method: "post",
      url: `vote2/${dates?.[0]}/dateArr`,
      body: { ...voteInfo, start: start.toISOString(), end: end.toISOString(), dates },
    });
  }, options);

export const useStudyVoteMutation = <T extends "post" | "patch" | "delete">(
  voteDate: Dayjs,
  method: T,
  options?: MutationOptions<StudyVoteParam<T>, PointValueProps | void>,
) => {
  return useMutation<PointValueProps | void, AxiosError, StudyVoteParam<T>>(
    (param) => {
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
      return requestServer<StudyVoteParam<T>, PointValueProps | void>({
        method,
        url: `vote2/${dayjsToStr(voteDate)}`,
        body: { ...voteInfo },
      });
    },
    {
      ...options,
    },
  );
};

interface StudyInviteProps extends StudyVoteProps {
  userId: string;
}

export const useStudyInviteMutation = (
  date: string,
  options?: MutationOptions<StudyInviteProps, PointValueProps | void>,
) => {
  return useMutation<PointValueProps | void, AxiosError, StudyInviteProps>(
    (param) => {
      const voteInfo = param;

      const updatedVoteInfo = voteInfo;
      const { start, end } = updatedVoteInfo;
      const startStr = dayjs(date).hour(start.hour()).minute(start.minute()).toISOString();
      const endStr = dayjs(date).hour(end.hour()).minute(end.minute()).toISOString();
      return requestServer<StudyInviteProps>({
        method: "post",
        url: `vote2/${date}/invite`,
        body: { ...voteInfo, start: startStr as unknown as Dayjs, end: endStr as unknown as Dayjs },
      });
    },
    {
      ...options,
    },
  );
};

export const useStudyResultTimeChangeMutation = (
  voteDate: Dayjs,
  options?: MutationOptions<DayjsTimeProps>,
) => {
  return useMutation<void, AxiosError, DayjsTimeProps>((voteInfo) => {
    const { start, end } = voteInfo;
    return requestServer<StringTimeProps>({
      method: "patch",
      url: `vote2/${dayjsToStr(voteDate)}/result`,
      body: { start: start.toISOString(), end: end.toISOString() },
    });
  }, options);
};

export const useStudyParticipateMutation = (
  voteDate: Dayjs,
  options?: MutationOptions<{ start: Dayjs; end: Dayjs; placeId: string }>,
) =>
  useMutation<void, AxiosError, { start: Dayjs; end: Dayjs; placeId: string }>((voteInfo) => {
    const { start, end } = voteInfo;
    return requestServer<{ start: string; end: string; placeId: string }>({
      method: "post",
      url: `vote2/${dayjsToStr(voteDate)}/participate`,
      body: { ...voteInfo, start: start.toISOString(), end: end.toISOString() },
    });
  }, options);

export const useStudyAttendCheckMutation = (
  options?: MutationOptions<{ memo: string; end: string } | FormData, PointInfoProps>,
) =>
  useMutation<PointInfoProps, AxiosError, { memo: string; end: string } | FormData>(
    (param) =>
      requestServer<{ memo: string; end: string } | FormData, PointInfoProps>({
        method: "post",
        url: `vote2/${dayjsToStr(dayjs())}/arrive`,
        body: param,
      }),
    options,
  );
export const useStudyAttendChangeMutation = (options?: MutationOptions<{ memo: string }, void>) =>
  useMutation<void, AxiosError, { memo: string }>(
    (param) =>
      requestServer<{ memo: string }, void>({
        method: "patch",
        url: `vote2/${dayjsToStr(dayjs())}/arriveMemo`,
        body: param,
      }),
    options,
  );

export const useStudyAbsenceMutation = (
  date: string,
  options?: MutationOptions<{ message: string }>,
) =>
  useMutation<void, AxiosError, { message: string }>(
    ({ message }) =>
      requestServer<{ message: string }>({
        method: "post",
        url: `vote2/${date}/absence`,
        body: { message },
      }),
    options,
  );

export const useStudyAdditionMutation = (
  options?: MutationOptions<PlaceRegisterProps, PointValueProps>,
) =>
  useMutation<PointValueProps, AxiosError, PlaceRegisterProps>(
    (placeInfo) =>
      requestServer<PlaceRegisterProps, PointValueProps>({
        method: "post",
        url: `place`,
        body: placeInfo,
      }),
    options,
  );

interface PlaceReviewRequestProps extends Omit<PlaceReviewProps, "user"> {
  placeId: string;
}

// export const usePlaceLocationMutation = (
//   options?: MutationOptions<{ placeId: string; location: any }>,
// ) =>
//   useMutation<void, AxiosError, { placeId: string; location: any }>(
//     (review) =>
//       requestServer<{ placeId: string; location: any }>({
//         method: "patch",
//         url: `place/location`,
//         body: review,
//       }),
//     options,
//   );

export const usePlaceReviewMutation = (options?: MutationOptions<PlaceReviewRequestProps>) =>
  useMutation<void, AxiosError, PlaceReviewRequestProps>(
    (review) =>
      requestServer<PlaceReviewRequestProps>({
        method: "post",
        url: `place/review`,
        body: review,
      }),
    options,
  );
export const usePlaceTestMutation = (options?: MutationOptions<void>) =>
  useMutation<void, AxiosError, void>(
    () =>
      requestServer<void>({
        method: "post",
        url: `place/test`,
        body: null,
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
        method: "post",
        url: `vote2/${date}/comment`,
        body: { comment: params },
      }),
    options,
  );
