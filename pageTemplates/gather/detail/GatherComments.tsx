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

  const { mutate: writeComment, isLoading: isLoading1 } = useCommentMutation(
    "post",
    "gather",
    gatherId,
    {
      onSuccess() {
        onCompleted();
      },
    },
  );
  const { mutate: writeSubComment, isLoading: isLoading2 } = useSubCommentMutation(
    "post",
    "gather",
    gatherId,
    {
      onSuccess() {
        onCompleted();
      },
    },
  );

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
    if (isLoading1 || isLoading2) return;

    if (replyProps) {
      setCommentArr(getCommentArr(value, replyProps.commentId, commentArr, userInfo));
      writeSubComment({ comment: value, commentId: replyProps.parentId });
      setReplyProps(null);
      return;
    }
    await writeComment({ comment: value });
    setCommentArr((old) => [...old, addNewComment(userInfo, value)]);
  };

  return (
    <>
      <Box my={5} mt={10} fontWeight="semibold" fontSize="16px">
        <Box mx={5}>궁금한점이 있다면 댓글을 남겨보세요!</Box>
        <Comment>
          {!isGuest && userInfo && (
            <Box mr="8px" mt={5} mb={3} px={5}>
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
                commentProps={item}
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
