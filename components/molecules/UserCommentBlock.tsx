import { Box } from "@chakra-ui/react";
import { useState } from "react";

import { SECRET_USER_SUMMARY } from "../../constants/serviceConstants/userConstants";
import { useUserInfoQuery } from "../../hooks/user/queries";
import { UserCommentProps } from "../../types/components/propTypes";
import { DispatchType } from "../../types/hooks/reactTypes";
import UserComment from "./UserComment";
import UserCommentInput from "./UserCommentInput";

interface UserCommentBlockProps {
  type: "gather" | "group" | "feed" | "square";
  id: string;
  commentProps: UserCommentProps;
  setCommentArr: DispatchType<UserCommentProps[]>;
  writeSubComment: ({ comment, commentId }: { comment: string; commentId: string }) => void;
}

function UserCommentBlock({
  type,
  id,
  commentProps,
  setCommentArr,
  writeSubComment,
}: UserCommentBlockProps) {
  const { data: userInfo } = useUserInfoQuery();

  const [isReCommentInput, setIsReCommentInput] = useState(false);

  const onSubmitReComment = (text: string) => {
    writeSubComment({ comment: text, commentId: commentProps._id });

    setCommentArr((old) =>
      old.map((obj) => {
        return obj._id === commentProps._id
          ? {
              ...obj,
              subComments: Array.isArray(obj.subComments)
                ? [...obj.subComments, { comment: text, user: userInfo }]
                : [],
            }
          : obj;
      }),
    );
    setIsReCommentInput(false);
  };

  return (
    <>
      <UserComment
        type={type}
        user={commentProps.user}
        updatedAt={commentProps.updatedAt}
        comment={commentProps.comment}
        pageId={id}
        commentId={commentProps._id}
        setCommentArr={setCommentArr}
        setIsReCommentInput={setIsReCommentInput}
        isSecret={type === "square"}
        likeList={commentProps.likeList}
        isAuthor={commentProps.user.name === "익명(글쓴이)"}
      />
      {commentProps?.subComments?.map((sub, idx2) => (
        <Box key={idx2} ml="20px">
          <UserComment
            isReComment
            type={type}
            isSecret={type === "square"}
            setIsReCommentInput={setIsReCommentInput}
            user={sub.user}
            updatedAt={sub.updatedAt}
            comment={sub.comment}
            pageId={id}
            commentId={sub._id}
            setCommentArr={setCommentArr}
            parentId={commentProps._id}
            likeList={sub.likeList}
            isAuthor={sub.user.name === "익명(글쓴이)"}
          />
        </Box>
      ))}
      {isReCommentInput && (
        <Box ml="20px" my="12px">
          <UserCommentInput
            user={type === "square" ? SECRET_USER_SUMMARY : userInfo}
            onSubmit={onSubmitReComment}
            initialFocus
          />
        </Box>
      )}
    </>
  );
}

export default UserCommentBlock;
