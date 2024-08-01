import { Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

import WritingNavigation from "../../../components/atoms/WritingNavigation";
import UserComment from "../../../components/molecules/UserComment";
import UserCommentInput from "../../../components/molecules/UserCommentInput";
import { useFeedsQuery } from "../../../hooks/feed/queries";
import { useUserInfoQuery } from "../../../hooks/user/queries";
import { UserCommentProps } from "../../../types/components/propTypes";
import { IUserSummary } from "../../../types/models/userTypes/userInfoTypes";
import { dayjsToStr } from "../../../utils/dateTimeUtils";

interface SecretSquareCommentsProps {}

function SecretSquareComments({}: SecretSquareCommentsProps) {
  const { data: userInfo } = useUserInfoQuery();
  const { data } = useFeedsQuery("group", 110, null, null);
  const comments = data?.[0]?.comments;

  const [commentArr, setCommentArr] = useState<UserCommentProps[]>(comments);
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
    // await writeComment({ comment: value });
    setCommentArr((old) => [...old, addNewComment(userInfo, value)]);
  };

  return (
    <>
      <Flex direction="column" pt="8px">
        {comments?.map((user, idx) => (
          <UserComment
            key={idx}
            isSecret
            type="gather"
            user={user.user}
            updatedAt={user.updatedAt}
            comment={user.comment}
            pageId=""
            commentId="item._id"
            setCommentArr={setCommentArr}
            resetCache={() => {}}
          />
        ))}
      </Flex>
      <WritingNavigation>
        <UserCommentInput isSecret user={userInfo} onSubmit={onSubmit} />
      </WritingNavigation>
    </>
  );
}

export default SecretSquareComments;
