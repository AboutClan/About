import dayjs from "dayjs";
import { useRouter } from "next/dist/client/router";
import { useEffect, useState } from "react";
import styled from "styled-components";

import BottomCommentInput from "../../../components/atoms/BottomCommentInput";
import CommentSection from "../../../components/molecules/CommentSection";
import { useCommentMutation, useSubCommentMutation } from "../../../hooks/common/mutations";
import { useToast } from "../../../hooks/custom/CustomToast";
import { useUserInfoQuery } from "../../../hooks/user/queries";
import { getCommentArr } from "../../../libs/comment/commentLib";
import { UserCommentProps } from "../../../types/components/propTypes";
import { IUserSummary } from "../../../types/models/userTypes/userInfoTypes";
import { dayjsToStr } from "../../../utils/dateTimeUtils";
import { ReplyProps } from "../../community/SecretSquareComments";
interface IGroupComments {
  comments: UserCommentProps[];
  hasAutority: boolean;
}

function GroupComments({ comments, hasAutority }: IGroupComments) {
  const toast = useToast();
  const router = useRouter();

  const groupId = router.query.id as string;

  const [commentArr, setCommentArr] = useState<UserCommentProps[]>(comments);
  const [replyProps, setReplyProps] = useState<ReplyProps>();

  const { data: userInfo } = useUserInfoQuery();

  const { mutate: writeComment } = useCommentMutation("post", "group", groupId, {
    onSuccess() {
      toast("success", "포인트가 적립되었습니다.");
    },
  });
  const { mutate: writeSubComment } = useSubCommentMutation("post", "group", groupId, {
    onSuccess() {},
  });

  const hasMyReview = comments?.some((comment) => comment?.user._id === userInfo?._id);

  useEffect(() => {
    setCommentArr(comments);
  }, [comments]);

  const addNewComment = (user: IUserSummary, comment: string): UserCommentProps => {
    return {
      user,
      comment,
      createdAt: dayjsToStr(dayjs()),
    };
  };

  const onSubmit = async (value: string) => {
    if (replyProps) {
      const text = value.split(" ")?.[1];
      writeSubComment({
        comment: text,
        commentId: replyProps.commentId,
        subCommentId: replyProps.subCommentId,
      });
      setCommentArr(getCommentArr(value, replyProps.commentId, commentArr, userInfo));
      return;
    }
    await writeComment({ comment: value });
    setCommentArr((old) => [...old, addNewComment(userInfo, value)]);
  };

  return (
    <>
      <Layout>
        {commentArr && (
          <CommentSection
            setReplyProps={setReplyProps}
            commentArr={commentArr}
            setCommentArr={setCommentArr}
            id={groupId}
            hasAuthority={hasAutority}
            hasMyReview={hasMyReview}
            
          />
        )}
      </Layout>
      {!hasMyReview && (
        <BottomCommentInput
          onSubmit={onSubmit}
          type="review"
          replyName={replyProps?.replyName}
          setReplyProps={setReplyProps}
          isFixed={false}
          user={userInfo}
          
        />
      )}
    </>
  );
}

const Layout = styled.div`
  display: flex;

  flex-direction: column;
  > span:first-child {
    font-weight: 700;
  }
`;

export default GroupComments;
