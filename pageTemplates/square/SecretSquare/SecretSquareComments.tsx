import { Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import BottomCommentInput from "../../../components/atoms/BottomCommentInput";
import Slide from "../../../components/layouts/PageSlide";
import UserCommentBlock from "../../../components/molecules/UserCommentBlock";
import { SECRET_USER_SUMMARY } from "../../../constants/serviceConstants/userConstants";
import {
  SubCommentParamProps,
  useCommentMutation,
  useSubCommentMutation,
} from "../../../hooks/common/mutations";
import { useUserInfoQuery } from "../../../hooks/user/queries";
import { UserCommentProps } from "../../../types/components/propTypes";
import { IUserSummary } from "../../../types/models/userTypes/userInfoTypes";
import { dayjsToStr } from "../../../utils/dateTimeUtils";

interface SecretSquareCommentsProps {
  author: string;
  comments: UserCommentProps[];
  refetch: () => void;
}

export interface ReplyProps extends SubCommentParamProps {
  replyName: string;
}

function SecretSquareComments({ author, comments, refetch }: SecretSquareCommentsProps) {
  const router = useRouter();
  const { data: userInfo } = useUserInfoQuery();

  const squareId = router.query.id as string;

  const [commentArr, setCommentArr] = useState<UserCommentProps[]>(comments || []);
  const [replyProps, setReplyProps] = useState<ReplyProps>();
  console.log(24, replyProps);
  useEffect(() => {
    setCommentArr(comments);
  }, [comments]);

  const { mutate: writeComment } = useCommentMutation("post", "square", squareId, {
    onSuccess() {
      refetch();
    },
  });

  const { mutate: writeSubComment } = useSubCommentMutation("post", "square", squareId, {
    onSuccess() {
      refetch();
    },
  });

  const addNewComment = (user: IUserSummary, comment: string): UserCommentProps => {
    return {
      user: user._id as unknown as IUserSummary,
      comment,
      createdAt: dayjsToStr(dayjs()),
    };
  };

  const onSubmit = async (value: string) => {
    await writeComment({ comment: value });
    setCommentArr((old) => [...old, addNewComment(userInfo, value)]);
  };

  const uniqueUsers = {};
  let uniqueIdCounter = 1;
  commentArr
    ?.flatMap((item) => [
      item.user,
      ...(Array.isArray(item.subComments) ? item.subComments.map((sub) => sub.user) : []),
    ])
    .forEach((user) => {
      const userId = user as unknown as string;
      if (!uniqueUsers[userId]) {
        if (userId === author) {
          uniqueUsers[userId] = -1;
        } else {
          uniqueUsers[userId] = uniqueIdCounter;
          uniqueIdCounter++;
        }
      }
    });

  return (
    <>
      <Slide isNoPadding>
        <Flex direction="column" pt="8px" pb="20px">
          {commentArr?.map((item, idx) => {
            const commentProps = commentArr?.find((comment) => comment._id === item._id);
            return (
              <UserCommentBlock
                key={idx}
                type="square"
                id={squareId}
                commentProps={{
                  ...commentProps,
                  user: {
                    ...SECRET_USER_SUMMARY,
                    name:
                      uniqueUsers[item.user as unknown as string] === -1
                        ? "익명(글쓴이)"
                        : `익명 ${uniqueUsers[item.user as unknown as string] || ""}`,
                    _id: item.user as unknown as string,
                  },
                  subComments: (commentProps.subComments || []).map((sub) => ({
                    ...sub,
                    user: {
                      ...SECRET_USER_SUMMARY,
                      name:
                        uniqueUsers[sub.user as unknown as string] === -1
                          ? "익명(글쓴이)"
                          : `익명 ${uniqueUsers[sub.user as unknown as string] || ""}`,
                      _id: sub.user as unknown as string,
                    },
                  })),
                }}
                setCommentArr={setCommentArr}
                // writeSubComment={writeSubComment}
                setReplyProps={setReplyProps}
              />
            );
          })}
        </Flex>
      </Slide>
      <BottomCommentInput onSubmit={onSubmit} type="comment" replyName={replyProps?.replyName} />
    </>
  );
}

export default SecretSquareComments;
