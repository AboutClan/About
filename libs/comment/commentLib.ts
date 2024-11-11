import { UserCommentProps } from "../../types/components/propTypes";
import { IUserSummary } from "../../types/models/userTypes/userInfoTypes";

export const getCommentArr = (
  text: string,
  id: string,
  commentArr: UserCommentProps[],
  userInfo: IUserSummary,
) => {
  return commentArr.map((obj) => {
    return obj._id === id
      ? {
          ...obj,
          subComments: Array.isArray(obj.subComments)
            ? [...obj.subComments, { comment: text, user: userInfo }]
            : [],
        }
      : obj;
  });
};
