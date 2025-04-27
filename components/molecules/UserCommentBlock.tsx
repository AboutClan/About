import { Box } from "@chakra-ui/react";

import { ReplyProps } from "../../pageTemplates/community/SecretSquareComments";
import { UserCommentProps } from "../../types/components/propTypes";
import { DispatchType } from "../../types/hooks/reactTypes";
import UserComment from "./UserComment";

interface UserCommentBlockProps {
  type: "gather" | "group" | "feed" | "square";
  id: string;
  commentProps: UserCommentProps;
  setCommentArr?: DispatchType<UserCommentProps[]>;

  setReplyProps: DispatchType<ReplyProps>;
  hasAuthority: boolean;
}

function UserCommentBlock({
  type,
  id,
  commentProps,
  setReplyProps,
  hasAuthority = true,
  setCommentArr,
}: UserCommentBlockProps) {
  return (
    <>
      <UserComment
        type={type}
        isReComment={false}
        hasAuthority={hasAuthority}
        user={commentProps.user}
        updatedAt={commentProps.updatedAt}
        comment={commentProps.comment}
        pageId={id}
        commentId={commentProps._id}
        setCommentArr={setCommentArr}
        setReplyProps={setReplyProps}
        isSecret={type === "square"}
        likeList={commentProps.likeList}
        isAuthor={commentProps.user.name === "익명(글쓴이)"}
      />
      {commentProps?.subComments?.map((sub, idx2) => (
        <Box key={idx2} ml="48px">
          <UserComment
            isReComment={true}
            type={type}
            hasAuthority={hasAuthority}
            isSecret={type === "square"}
            setReplyProps={null}
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
    </>
  );
}

export default UserCommentBlock;
