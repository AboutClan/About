import { Box } from "@chakra-ui/react";
import { useSession } from "next-auth/react";

import { ReplyProps } from "../../pageTemplates/square/SecretSquare/SecretSquareComments";
import { UserCommentProps } from "../../types/components/propTypes";
import { DispatchType } from "../../types/hooks/reactTypes";
import UserCommentBlock from "./UserCommentBlock";

interface CommentSectionProps {
  commentArr: UserCommentProps[];
  setCommentArr: DispatchType<UserCommentProps[]>;
  id: string;
  hasAuthority?: boolean;
  setReplyProps: DispatchType<ReplyProps>;
}

function CommentSection({
  setCommentArr,
  commentArr,
  id,
  hasAuthority,
  setReplyProps,
}: CommentSectionProps) {
  const { data: session } = useSession();
  

  return (
    <>
      <Box
        px={5}
        color="gray.600"
        fontSize="13px"
        lineHeight="20px"
        pb={3}
        borderBottom="var(--border)"
      >
        댓글 <b>{commentArr?.length}개</b>
      </Box>
      {commentArr.map((comment, idx) => (
        <UserCommentBlock
          key={idx}
          type="group"
          id={id}
          commentProps={comment}
          hasAuthority={session?.user.uid !== comment.user.uid && hasAuthority}
          setReplyProps={setReplyProps}
          setCommentArr={setCommentArr}
        />
      ))}
    </>
  );
}

export default CommentSection;
