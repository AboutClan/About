import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useRouter } from "next/dist/client/router";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";

import UserCommentBlock from "../../../components/molecules/UserCommentBlock";
import UserCommentInput from "../../../components/molecules/UserCommentInput";
import { GATHER_CONTENT } from "../../../constants/keys/queryKeys";
import { useCommentMutation, useSubCommentMutation } from "../../../hooks/common/mutations";
import { useUserInfoQuery } from "../../../hooks/user/queries";
import { getCommentArr } from "../../../libs/comment/commentLib";
import { transferGatherDataState } from "../../../recoils/transferRecoils";
import { UserCommentProps } from "../../../types/components/propTypes";
import { IUserSummary } from "../../../types/models/userTypes/userInfoTypes";
import { dayjsToStr } from "../../../utils/dateTimeUtils";
import { ReplyProps } from "../../community/SecretSquareComments";

interface IGatherComments {
  comments: UserCommentProps[];
}

function GatherComments({ comments }: IGatherComments) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: session } = useSession();
  const isGuest = session?.user.name === "guest";
  const gatherId = router.query.id as string;

  const setTransferGather = useSetRecoilState(transferGatherDataState);
  const [commentArr, setCommentArr] = useState<UserCommentProps[]>(comments);
  const [replyProps, setReplyProps] = useState<ReplyProps>();

  const { data: userInfo } = useUserInfoQuery();

  const { mutate: writeComment } = useCommentMutation("post", "gather", gatherId, {
    onSuccess() {
      onCompleted();
    },
  });
  const { mutate: writeSubComment } = useSubCommentMutation("post", "gather", gatherId, {
    onSuccess() {
      onCompleted();
    },
  });

  const onCompleted = () => {
    setTransferGather(null);
    queryClient.invalidateQueries([GATHER_CONTENT, gatherId]);
  };

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
      setCommentArr(getCommentArr(value, replyProps.commentId, commentArr, userInfo));
      writeSubComment({ comment: value, commentId: replyProps.commentId });
      return;
    }
    await writeComment({ comment: value });
    setCommentArr((old) => [...old, addNewComment(userInfo, value)]);
  };

  return (
    <>
      <Box m={5} fontWeight="semibold" fontSize="16px">
        <span>하고 싶은 말이 있다면 댓글을 남겨보세요!</span>
        <Comment>
          {!isGuest && userInfo && (
            <Box mr="8px" mt="20px" mb="12px">
              <UserCommentInput
                user={userInfo}
                replyName={replyProps?.replyName}
                setReplyProps={setReplyProps}
                onSubmit={onSubmit}
              />
            </Box>
          )}
          <section>
            {commentArr?.map((item, idx) => (
              <UserCommentBlock
                key={idx}
                type="gather"
                id={gatherId}
                commentProps={commentArr?.find((comment) => comment._id === item._id)}
                setCommentArr={setCommentArr}
                setReplyProps={setReplyProps}
                hasAuthority={!isGuest}
              />
            ))}
          </section>
        </Comment>
      </Box>
    </>
  );
}

const Comment = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 13px;
`;

export default GatherComments;
