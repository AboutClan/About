import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useRouter } from "next/dist/client/router";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";

import UserComment from "../../../components/molecules/UserComment";
import UserCommentInput from "../../../components/molecules/UserCommentInput";
import { GROUP_STUDY } from "../../../constants/keys/queryKeys";
import { useCommentMutation } from "../../../hooks/common/mutations";
import { useUserInfoQuery } from "../../../hooks/user/queries";
import { transferGroupDataState } from "../../../recoils/transferRecoils";
import { UserCommentProps } from "../../../types/components/propTypes";
import { IUserSummary } from "../../../types/models/userTypes/userInfoTypes";
import { dayjsToStr } from "../../../utils/dateTimeUtils";

interface IGroupComments {
  comments: UserCommentProps[];
}

function GroupComments({ comments }: IGroupComments) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: session } = useSession();
  const isGuest = session?.user.name === "guest";
  const groupId = router.query.id as string;

  const setTransferGroup = useSetRecoilState(transferGroupDataState);
  const [commentArr, setCommentArr] = useState<UserCommentProps[]>(comments);

  const { data: userInfo } = useUserInfoQuery();

  const { mutate: writeComment } = useCommentMutation("post", "group", groupId, {
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

  const onSubmit = () => async (value: string) => {
    await writeComment({ comment: value });
    await setCommentArr((old) => [...old, addNewComment(userInfo, value)]);
  };

  const resetCache = () => {
    setTransferGroup(null);
    queryClient.invalidateQueries([GROUP_STUDY, groupId]);
  };

  return (
    <>
      <Layout>
        <span>할 얘기가 있다면 댓글을 남겨보세요</span>
        <Comment>
          {!isGuest && userInfo && (
            <Box mr="8px" mt="20px" mb="12px">
              <UserCommentInput user={userInfo} onSubmit={onSubmit} />
            </Box>
          )}
          <section>
            {commentArr?.map((item, idx) => (
              <UserComment
                key={idx}
                type="group"
                user={item.user}
                updatedAt={item.updatedAt}
                comment={item.comment}
                pageId={groupId}
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

export default GroupComments;
