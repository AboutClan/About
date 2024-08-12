import { AxiosError } from "axios";
import { useMutation } from "react-query";

import { requestServer } from "../../libs/methodHelpers";
import { MutationOptions } from "../../types/hooks/reactTypes";

export type CommentParamProps<T> = T extends "post"
  ? {
      comment: string;
      commentId?: string;
    }
  : T extends "patch"
    ? {
        comment: string;
        commentId: string;
      }
    : {
        comment?: never;
        commentId: string;
      };

interface CommentRequestProps {
  id?: string;
  feedId?: string;
  comment?: string;
  commentId?: string;
}

export const useCommentMutation = <T extends "post" | "patch" | "delete">(
  method: T,
  type: "gather" | "group" | "feed" | "square",
  id: string,
  options?: MutationOptions<CommentParamProps<T>>,
) =>
  useMutation<void, AxiosError, CommentParamProps<T>>((param) => {
    const url = (type === "group" ? "groupStudy" : type) + "/comment";
    return requestServer<CommentRequestProps>({
      method,
      url,
      body: {
        ...(type === "feed" ? { feedId: id } : type === "square" ? { squareId: id } : { id }),
        comment: param?.comment,
        commentId: param?.commentId,
      },
    });
  }, options);

export type SubCommentParamProps<T> = T extends "post"
  ? {
      comment: string;
      commentId?: string;

      subCommentId?: string;
    }
  : T extends "patch"
    ? {
        comment: string;
        commentId: string;

        subCommentId: string;
      }
    : {
        comment?: never;
        commentId: string;

        subCommentId: string;
      };

interface SubCommentRequestProps {
  comment?: string;
  commentId?: string;
  subCommentId?: string;
  [key: string]: string | undefined;
}

export const useSubCommentMutation = <T extends "post" | "patch" | "delete">(
  method: T,
  type: "gather" | "group" | "square" | "feed",
  id: string,
  options?: MutationOptions<SubCommentParamProps<T>>,
) =>
  useMutation<void, AxiosError, SubCommentParamProps<T>>((param) => {
    const typeName = type === "group" ? "groupStudy" : type;

    return requestServer<SubCommentRequestProps>({
      method,
      url: typeName + "/subComment",
      body: {
        [typeName + "Id"]: id,
        comment: param?.comment,
        commentId: param?.commentId,
        ...(method !== "post" && { subCommentId: param?.subCommentId }),
      },
    });
  }, options);

interface CommentLikeMutationProps {
  commentId?: string;
  subCommentId?: string;
}

interface CommentLikeRequestProps extends CommentLikeMutationProps {
  [key: string]: string | undefined;
}

export const useCommentLikeMutation = (
  commentType: "comment" | "subComment",
  type: "gather" | "group" | "square" | "feed",
  id: string,
  options?: MutationOptions<CommentLikeMutationProps>,
) =>
  useMutation<void, AxiosError, CommentLikeMutationProps>((param) => {
    const typeName = type === "group" ? "groupStudy" : type;

    return requestServer<CommentLikeRequestProps>({
      method: "post",
      url: typeName + "/" + commentType + "/like",
      body: {
        [typeName + "Id"]: id,
        commentId: param?.commentId,
        ...(commentType === "subComment" && { subCommentId: param?.subCommentId }),
      },
    });
  }, options);
