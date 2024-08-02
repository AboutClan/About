import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useParams } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import Header from "../../../components/layouts/Header";
import ProfileCommentCard from "../../../components/molecules/cards/ProfileCommentCard";
import UserComment from "../../../components/molecules/UserComment";
import UserCommentInput from "../../../components/molecules/UserCommentInput";
import { useFeedCommentMutation } from "../../../hooks/feed/mutations";
import { transferLikeOrCommentState } from "../../../recoils/transferRecoils";
import { UserCommentProps } from "../../../types/components/propTypes";
import { IUserSummary } from "../../../types/models/userTypes/userInfoTypes";
import { dayjsToStr } from "../../../utils/dateTimeUtils";

function Type() {
  const { type } = useParams<{ type: "like" | "comment" }>() || {};

  const transferLikeOrComment = useRecoilValue(transferLikeOrCommentState);
  const [commentArr, setCommentArr] = useState<UserCommentProps[]>(
    type === "comment" ? (transferLikeOrComment as UserCommentProps[]) : null,
  );

  const { mutate: writeComment } = useFeedCommentMutation(feedId);

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
    refetch();
  };

  return (
    <>
      <Header title={type === "like" ? "좋아요" : "댓글"} />
      <Flex direction="column">
        {type === "like" ? (
          (transferLikeOrComment as IUserSummary[]).map((who, idx) => (
            <Fragment key={idx}>
              <ProfileCommentCard user={who} comment={who.comment} />
            </Fragment>
          ))
        ) : (
          <>
            <Flex direction="column" px="16px" mt="8px">
              {(transferLikeOrComment as UserCommentProps[]).map((item, idx) => (
                <UserComment
                  key={idx}
                  type="gather"
                  user={item.user}
                  updatedAt={item.updatedAt}
                  comment={item.comment}
                  pageId={feedId}
                  commentId="item._id"
                  setCommentArr={setCommentArr}
                  resetCache={resetCache}
                />
              ))}
            </Flex>{" "}
            <Box
              position="fixed"
              bottom="0"
              flex={1}
              w="100%"
              p="16px"
              borderTop="var(--border-main)"
              maxW="var(--max-width)"
            >
              <UserCommentInput user={userInfo} onSubmit={onSubmit} />
            </Box>
          </>
        )}
      </Flex>
    </>
  );
}

export default Type;
