import { UserCommentProps } from "../../types/components/propTypes";
import { UserSimpleInfoProps } from "../../types/models/userTypes/userInfoTypes";

export const getCommentArr = (
  text: string,
  id: string,
  commentArr: UserCommentProps[],
  userInfo: UserSimpleInfoProps,
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
