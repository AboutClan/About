import { Box } from "@chakra-ui/react";
import { useState } from "react";
import { useUserInfoQuery } from "../../hooks/user/queries";
import { UserCommentProps } from "../../types/components/propTypes";
import { DispatchType } from "../../types/hooks/reactTypes";
import UserComment from "./UserComment";
import UserCommentInput from "./UserCommentInput";

interface UserCommentBlockProps {
  type: "gather" | "group";
  id: string;
  commentProps: UserCommentProps;
  setCommentArr: DispatchType<UserCommentProps[]>;
  writeSubComment: ({ comment, id }: { comment: string; id: string }) => void;
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
    writeSubComment({ comment: text, id });
    setCommentArr((old) =>
      old.map((obj) =>
        obj._id === id
          ? { ...obj, subComments: [...obj?.subComments, { comment: text, user: userInfo }] }
          : obj,
      ),
    );
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
      />
      {commentProps?.subComments?.map((sub, idx2) => (
        <Box key={idx2} ml="20px">
          <UserComment
            isReComment
            type={type}
            setIsReCommentInput={setIsReCommentInput}
            user={sub.user}
            updatedAt={sub.updatedAt}
            comment={sub.comment}
            pageId={id}
            commentId={sub._id}
            setCommentArr={setCommentArr}
          />
        </Box>
      ))}
      {isReCommentInput && (
        <Box ml="20px" mt="12px">
          <UserCommentInput user={userInfo} onSubmit={onSubmitReComment} initialFocus />
        </Box>
      )}
    </>
  );
}

export default UserCommentBlock;
