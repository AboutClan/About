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
  id: string;
  comment?: string;
  commentId?: string;
}

export const useCommentMutation = <T extends "post" | "patch" | "delete">(
  method: T,
  type: "gather" | "group",
  id: string,
  options?: MutationOptions<CommentParamProps<T>>,
) =>
  useMutation<void, AxiosError, CommentParamProps<T>>((param) => {
    const url = (type === "group" ? "groupStudy" : type) + "/comment";
    return requestServer<CommentRequestProps>({
      method,
      url,
      body: {
        id,
        comment: param?.comment,
        commentId: param?.commentId,
      },
    });
  }, options);
