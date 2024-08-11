import { Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import WritingNavigation from "../../../components/atoms/WritingNavigation";
import UserCommentBlock from "../../../components/molecules/UserCommentBlock";
import UserCommentInput from "../../../components/molecules/UserCommentInput";
import { useCommentMutation, useSubCommentMutation } from "../../../hooks/common/mutations";
import { useFeedsQuery } from "../../../hooks/feed/queries";
import { useUserInfoQuery } from "../../../hooks/user/queries";
import { UserCommentProps } from "../../../types/components/propTypes";
import { IUserSummary } from "../../../types/models/userTypes/userInfoTypes";
import { dayjsToStr } from "../../../utils/dateTimeUtils";

interface SecretSquareCommentsProps {
  comments: UserCommentProps[];
}

function SecretSquareComments({ comments }: SecretSquareCommentsProps) {
  const router = useRouter();
  const { data: userInfo } = useUserInfoQuery();
  const { data } = useFeedsQuery("group", 110, null, null);
  const squareId = router.query.id as string;

  const [commentArr, setCommentArr] = useState<UserCommentProps[]>(comments);
  useEffect(() => {
    setCommentArr(comments);
  }, [comments]);

  const { mutate: writeComment } = useCommentMutation("post", "gather", squareId, {
    onSuccess() {},
  });
  const { mutate: writeSubComment } = useSubCommentMutation("post", "gather", squareId, {
    onSuccess() {},
  });

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
          <UserCommentBlock
            key={idx}
            type="feed"
            id={""}
            commentProps={commentArr?.find((comment) => comment._id === item._id)}
            setCommentArr={setCommentArr}
            writeSubComment={writeSubComment}
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
