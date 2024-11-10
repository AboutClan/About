import { Box } from "@chakra-ui/react";

import { UserCommentProps } from "../../types/components/propTypes";
import UserCommentBlock from "./UserCommentBlock";

interface CommentSectionProps {
  commentArr: UserCommentProps[];
  id: string;
}

function CommentSection({ commentArr, id }: CommentSectionProps) {
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
        댓글 <b>22개</b>
      </Box>
      {commentArr.map((comment, idx) => (
        <UserCommentBlock
          key={idx}
          type="group"
          id={id}
          commentProps={comment}
          // setCommentArr={setCommentArr}
          // writeSubComment={writeSubComment}
        />
      ))}
      <Box position="fixed" bottom="0"></Box>
    </>
  );
}

export default CommentSection;
