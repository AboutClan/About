import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Slide from "../../../components/layouts/PageSlide";

import UserCommentBlock from "../../../components/molecules/UserCommentBlock";
import UserCommentInput from "../../../components/molecules/UserCommentInput";
import { SECRET_USER_SUMMARY } from "../../../constants/serviceConstants/userConstants";
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
 
  const [commentArr, setCommentArr] = useState<UserCommentProps[]>(comments || []);
  useEffect(() => {
    setCommentArr(comments);
  }, [comments]);

  const { mutate: writeComment } = useCommentMutation("post", "square", squareId, {
    onSuccess() {},
  });
  const { mutate: writeSubComment } = useSubCommentMutation("post", "square", squareId, {
    onSuccess() {},
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
    .map((item) => item.user)
    .forEach((user) => {
      if (!uniqueUsers[user as unknown as string]) {
        uniqueUsers[user as unknown as string] = uniqueIdCounter;
        uniqueIdCounter++;
      }
    });

  return (
    <>
      <Slide>
        <Flex direction="column" pt="8px" px="16px" pb="20px">
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
                    name: `익명 ${uniqueUsers[item.user as unknown as string]}`,
                    _id: item.user as unknown as string,
                  },
                  subComments: (commentProps.subComments || []).map((sub) => ({
                    ...sub,
                    user: {
                      ...SECRET_USER_SUMMARY,
                      name: `익명 ${uniqueUsers[sub.user as unknown as string]}`,
                      _id: sub.user as unknown as string,
                    },
                  })),
                }}
                setCommentArr={setCommentArr}
                writeSubComment={writeSubComment}
              />
            );
          })}
        </Flex>
      </Slide>
      <Box
        h="60px"
        position="fixed"
        borderTop="var(--border-main)"
        bottom="0"
        flex={1}
        w="100%"
        backgroundColor="white"
        p="16px"
        maxW="var(--max-width)"
      >
        <UserCommentInput user={userInfo} onSubmit={onSubmit} type="message" initialFocus />
      </Box>
    </>
  );
}

export default SecretSquareComments;
