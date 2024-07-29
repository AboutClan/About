import { AxiosError } from "axios";
import { useMutation } from "react-query";

import { requestServer } from "../../libs/methodHelpers";
import { MutationOptions } from "../../types/hooks/reactTypes";

export const useFeedMutation = (options?: MutationOptions<FormData>) =>
  useMutation<void, AxiosError, FormData>(
    (param) =>
      requestServer<FormData>({
        method: "post",
        url: "feed",
        body: param,
      }),
    options,
  );

export const useFeedLikeMutation = (options?: MutationOptions<string>) =>
  useMutation<void, AxiosError, string>(
    (id) =>
      requestServer<{ id: string }>({
        method: "post",
        url: "feed/like",
        body: { id },
      }),
    options,
  );

interface FeedCommentProps {
  comment: string;
}

interface FeedCommentRequest extends FeedCommentProps {
  feedId: string;
}

export const useFeedCommentMutation = (
  feedId: string,
  options?: MutationOptions<FeedCommentProps>,
) =>
  useMutation<void, AxiosError, FeedCommentProps>(
    ({ comment }) =>
      requestServer<FeedCommentRequest>({
        method: "post",
        url: "feed/comment",
        body: { comment, feedId },
      }),
    options,
  );
