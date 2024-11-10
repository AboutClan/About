import dayjs from "dayjs";
import { useRouter } from "next/dist/client/router";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";

import CommentSection from "../../../components/molecules/CommentSection";
import { GROUP_STUDY } from "../../../constants/keys/queryKeys";
import { useCommentMutation, useSubCommentMutation } from "../../../hooks/common/mutations";
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
  console.log(42, commentArr);
  const { data: userInfo } = useUserInfoQuery();

  const { mutate: writeComment } = useCommentMutation("post", "group", groupId, {
    onSuccess() {
      resetCache();
    },
  });
  const { mutate: writeSubComment } = useSubCommentMutation("post", "group", groupId, {
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
    setTransferGroup(null);
    queryClient.invalidateQueries([GROUP_STUDY, groupId]);
  };

  return (
    <>
      <Layout>{commentArr && <CommentSection commentArr={commentArr} id={groupId} />}</Layout>
      
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

const Comment = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 13px;
`;

export default GroupComments;
