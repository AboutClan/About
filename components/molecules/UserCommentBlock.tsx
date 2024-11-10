import { Box } from "@chakra-ui/react";
import { useState } from "react";

import { useUserInfoQuery } from "../../hooks/user/queries";
import { ReplyProps } from "../../pageTemplates/square/SecretSquare/SecretSquareComments";
import { UserCommentProps } from "../../types/components/propTypes";
import { DispatchType } from "../../types/hooks/reactTypes";
import UserComment from "./UserComment";

interface UserCommentBlockProps {
  type: "gather" | "group" | "feed" | "square";
  id: string;
  commentProps: UserCommentProps;
  setCommentArr?: DispatchType<UserCommentProps[]>;
  // writeSubComment?: ({ comment, commentId }: { comment: string; commentId: string }) => void;
  setReplyProps: DispatchType<ReplyProps>;
}

function UserCommentBlock({ type, id, commentProps, setReplyProps }: UserCommentBlockProps) {
  const { data: userInfo } = useUserInfoQuery();

  const [isReCommentInput, setIsReCommentInput] = useState(false);

  // const onSubmitReComment = (text: string) => {
  //   writeSubComment({ comment: text, commentId: commentProps._id });

  //   setCommentArr((old) =>
  //     old.map((obj) => {
  //       return obj._id === commentProps._id
  //         ? {
  //             ...obj,
  //             subComments: Array.isArray(obj.subComments)
  //               ? [...obj.subComments, { comment: text, user: userInfo }]
  //               : [],
  //           }
  //         : obj;
  //     }),
  //   );
  //   setIsReCommentInput(false);
  // };

  return (
    <>
      <UserComment
        type={type}
        user={commentProps.user}
        updatedAt={commentProps.updatedAt}
        comment={commentProps.comment}
        pageId={id}
        commentId={commentProps._id}
        // setCommentArr={setCommentArr}
        setReplyProps={setReplyProps}
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
            setReplyProps={setReplyProps}
            user={sub.user}
            updatedAt={sub.updatedAt}
            comment={sub.comment}
            pageId={id}
            commentId={sub._id}
            // setCommentArr={setCommentArr}
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
