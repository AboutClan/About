import { Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import BottomCommentInput from "../../components/atoms/BottomCommentInput";
import Slide from "../../components/layouts/PageSlide";
import UserCommentBlock from "../../components/molecules/UserCommentBlock";
import { SECRET_USER_SUMMARY } from "../../constants/serviceConstants/userConstants";
import {
  SubCommentParamProps,
  useCommentMutation,
  useSubCommentMutation,
} from "../../hooks/common/mutations";
import { useUserInfoQuery } from "../../hooks/user/queries";
import { getCommentArr } from "../../libs/comment/commentLib";
import { UserCommentProps } from "../../types/components/propTypes";
import { AvatarProps, UserSimpleInfoProps } from "../../types/models/userTypes/userInfoTypes";
import { dayjsToStr } from "../../utils/dateTimeUtils";
interface SecretSquareCommentsProps {
  author: string | UserSimpleInfoProps;
  comments: UserCommentProps[];
  refetch: () => void;
  avatar: AvatarProps;
}

export interface ReplyProps extends Omit<SubCommentParamProps, "comment"> {
  replyName: string;
  parentId?: string;
}

function SecretSquareComments({ author, comments, refetch, avatar }: SecretSquareCommentsProps) {
  const router = useRouter();
  const { data: userInfo } = useUserInfoQuery();

  const squareId = router.query.id as string;

  const [commentArr, setCommentArr] = useState<UserCommentProps[]>(comments || []);
  const [replyProps, setReplyProps] = useState<ReplyProps>();

  const isMine = author === userInfo?._id;
  const findMyUserId = commentArr?.find((c) => c.user._id === userInfo?._id)?.user?._id;
  let myName;
  console.log(12, findMyUserId);
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

  const addNewComment = (user: UserSimpleInfoProps, comment: string): UserCommentProps => {
    return {
      user: { _id: user._id },
      comment,
      createdAt: dayjsToStr(dayjs()),
    };
  };
  const removeAnonymousPrefix = (text: string) => {
    return text.replace(/^@익명\s*\d+\s*/, "");
  };
  const onSubmit = async (value: string) => {
    console.log(1, myName, replyProps?.replyName);
    let value2 = value;
    if (replyProps) {
      if (myName === replyProps.replyName) {
        const pureText = removeAnonymousPrefix(value);
        value2 = pureText;
      }

      writeSubComment({ comment: value2, commentId: replyProps.parentId });
      setCommentArr(getCommentArr(value2, replyProps.commentId, commentArr, userInfo));
      return;
    }
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
      const userId = user._id;
      if (!uniqueUsers[userId]) {
        if (userId === author) {
          uniqueUsers[userId] = -1;
        } else {
          if (findMyUserId === userId) {
            myName = `익명 ${uniqueIdCounter}`;
          }

          uniqueUsers[userId] = uniqueIdCounter;
          uniqueIdCounter++;
        }
      }
    });
  console.log(15, myName);
  return (
    <>
      <Slide isNoPadding>
        <Flex direction="column" pt="8px" pb="20px" bg="white">
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
                    avatar: uniqueUsers[item.user._id] === -1 ? avatar : { type: 2, bg: 0 },
                    name:
                      uniqueUsers[item.user._id] === -1
                        ? "글쓴이"
                        : `익명 ${uniqueUsers[item.user._id] || ""}`,
                    _id: item.user._id,
                  },
                  subComments: (commentProps.subComments || []).map((sub) => ({
                    ...sub,
                    user: {
                      ...SECRET_USER_SUMMARY,
                      avatar: uniqueUsers[sub.user._id] === -1 ? avatar : { type: 2, bg: 0 },
                      name:
                        uniqueUsers[sub.user._id] === -1
                          ? "글쓴이"
                          : `익명 ${uniqueUsers[sub.user._id] || ""}`,
                      _id: sub.user._id,
                    },
                  })),
                }}
                setCommentArr={setCommentArr}
                setReplyProps={setReplyProps}
              />
            );
          })}
        </Flex>
      </Slide>
      <BottomCommentInput
        onSubmit={onSubmit}
        type="comment"
        replyName={replyProps?.replyName}
        setReplyProps={setReplyProps}
        user={isMine ? { _id: author, avatar } : SECRET_USER_SUMMARY}
        myName={myName}
      />
    </>
  );
}

export default SecretSquareComments;
