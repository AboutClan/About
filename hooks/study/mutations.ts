import { AxiosError } from "axios";
import dayjs, { Dayjs } from "dayjs";
import { useMutation } from "react-query";
import { useSetRecoilState } from "recoil";

import { requestServer } from "../../libs/methodHelpers";
import { transferStudyVoteDateState } from "../../recoils/transferRecoils";
import { PointValueProps } from "../../types/common";
import { MutationOptions } from "../../types/hooks/reactTypes";
import { CollectionProps } from "../../types/models/collections";
import { PlaceRegisterProps, PlaceReviewProps } from "../../types/models/studyTypes/entityTypes";
import { IStudyVoteTime, StudyVoteProps } from "../../types/models/studyTypes/studyInterActions";
import { DayjsTimeProps, StringTimeProps } from "../../types/utils/timeAndDate";
import { dayjsToStr } from "../../utils/dateTimeUtils";
import { usePointToast } from "../custom/CustomToast";

type StudyVoteParam<T> = T extends "post"
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
  const pointToast = usePointToast();
  const setTransferStudyVoteDate = useSetRecoilState(transferStudyVoteDateState);

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
