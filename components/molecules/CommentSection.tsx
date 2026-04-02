import { Box, Flex } from "@chakra-ui/react";

import { ReplyProps } from "../../pageTemplates/community/SecretSquareComments";
import { UserCommentProps } from "../../types/components/propTypes";
import { DispatchType } from "../../types/hooks/reactTypes";
import UserCommentBlock from "./UserCommentBlock";

interface CommentSectionProps {
  commentArr: UserCommentProps[];
  setCommentArr: DispatchType<UserCommentProps[]>;
  id: string;
  hasAuthority?: boolean;
  setReplyProps: DispatchType<ReplyProps>;
  hasMyReview: boolean;
}

function CommentSection({
  setCommentArr,
  commentArr,
  id,
  setReplyProps,
  hasMyReview,
}: CommentSectionProps) {
  console.log(hasMyReview);
  return (
    <>
      <Flex px={5} pb={4}>
        <Box color="gray.800" fontSize="18px" lineHeight="28px" fontWeight="bold">
          댓글 (문의)
        </Box>
        {/* {!hasMyReview && (
          <Box ml={3} mb={0.5} alignSelf="flex-end" fontSize="11px" color="mint">
            ※ 리뷰 작성 시 500 Point 지급
          </Box>
        )} */}
      </Flex>
      <Box>
        {commentArr.map((comment, idx) => (
          <UserCommentBlock
            key={idx}
            type="group"
            id={id}
            commentProps={comment}
            setReplyProps={setReplyProps}
            setCommentArr={setCommentArr}
            hasDeleteBtn={false}
          />
        ))}
      </Box>
    </>
  );
}

export default CommentSection;
