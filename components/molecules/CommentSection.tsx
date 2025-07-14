import { Box, Flex } from "@chakra-ui/react";
import { useSession } from "next-auth/react";

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
  hasAuthority,
  setReplyProps,
  hasMyReview,
}: CommentSectionProps) {
  const { data: session } = useSession();

  return (
    <>
      <Flex px={5} pb={4}>
        <Box color="gray.800" fontSize="18px" lineHeight="28px" fontWeight="bold">
          참여자 실제 리뷰
        </Box>
        {!hasMyReview && (
          <Box ml={3} mb={0.5} alignSelf="flex-end" fontSize="11px" color="mint">
            ※ 리뷰 작성 시 500 Point 지급
          </Box>
        )}
      </Flex>
      <Box>
        {commentArr.map((comment, idx) => (
          <UserCommentBlock
            key={idx}
            type="group"
            id={id}
            commentProps={comment}
            hasAuthority={session?.user.uid !== comment.user.uid && hasAuthority}
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
