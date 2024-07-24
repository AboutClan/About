import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/dist/client/router";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";

import UserComment from "../../../components/molecules/UserComment";
import UserCommentInput from "../../../components/molecules/UserCommentInput";
import { GATHER_CONTENT } from "../../../constants/keys/queryKeys";
import { useCommentMutation } from "../../../hooks/common/mutations";
import { useUserInfoQuery } from "../../../hooks/user/queries";
import { transferGatherDataState } from "../../../recoils/transferRecoils";
import { UserCommentProps } from "../../../types/components/propTypes";
import { IUserSummary } from "../../../types/models/userTypes/userInfoTypes";
import { dayjsToStr } from "../../../utils/dateTimeUtils";

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

  const { data: userInfo } = useUserInfoQuery();

  const { mutate: writeComment } = useCommentMutation("post", "gather", gatherId, {
    onSuccess() {
      resetCache();
    },
  });

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
    await writeComment({ comment: value });
    setCommentArr((old) => [...old, addNewComment(userInfo, value)]);
  };

  const resetCache = () => {
    setTransferGather(null);
    queryClient.invalidateQueries([GATHER_CONTENT, gatherId]);
  };

  return (
    <>
      <Layout>
        <span>할 얘기가 있다면 댓글을 남겨보세요</span>
        <Comment>
          {!isGuest && userInfo && (
            <Box mr="8px">
              <UserCommentInput user={userInfo} onSubmit={onSubmit} />
            </Box>
          )}
          <section>
            {commentArr?.map((item, idx) => (
              <UserComment
                key={idx}
                type="gather"
                user={item.user}
                updatedAt={item.updatedAt}
                comment={item.comment}
                pageId={gatherId}
                commentId={item._id}
                setCommentArr={setCommentArr}
                resetCache={resetCache}
              />
            ))}
          </section>
        </Comment>
      </Layout>
    </>
  );
}

const Layout = styled.div`
  margin: var(--gap-5) var(--gap-4);
  display: flex;
  flex-direction: column;
  > span:first-child {
    font-weight: 700;
  }
`;

const Comment = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 13px;
`;

export default GatherComments;
