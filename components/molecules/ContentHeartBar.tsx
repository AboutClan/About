import { Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Fragment, useEffect, useState } from "react";

import { useCommentMutation, useSubCommentMutation } from "../../hooks/common/mutations";
import { useTypeToast } from "../../hooks/custom/CustomToast";
import { useFeedLikeMutation } from "../../hooks/feed/mutations";
import { useUserInfoQuery } from "../../hooks/user/queries";
import { getCommentArr } from "../../libs/comment/commentLib";
import { ReplyProps } from "../../pageTemplates/square/SecretSquare/SecretSquareComments";
import { UserCommentProps } from "../../types/components/propTypes";
import { FeedComment } from "../../types/models/feed";
import { IUserSummary } from "../../types/models/userTypes/userInfoTypes";
import { dayjsToStr } from "../../utils/dateTimeUtils";
import RightDrawer from "../organisms/drawer/RightDrawer";
import ProfileCommentCard from "./cards/ProfileCommentCard";
import AvatarGroupsOverwrap from "./groups/AvatarGroupsOverwrap";
import UserCommentBlock from "./UserCommentBlock";
import UserCommentInput from "./UserCommentInput";

interface ContentHeartBarProps {
  feedId: string;
  likeUsers: IUserSummary[];
  likeCnt: number;
  comments: FeedComment[];

  refetch?: () => void;
}

function ContentHeartBar({ feedId, likeUsers, likeCnt, comments, refetch }: ContentHeartBarProps) {
  const typeToast = useTypeToast();
  const { data: session } = useSession();
  const { data: userInfo } = useUserInfoQuery();
  const isGuest = session ? session.user.name === "guest" : undefined;

  const searchParams = useSearchParams();
  const drawerType = searchParams.get("drawer");

  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [modalType, setModalType] = useState<"like" | "comment">(null);
  const [heartProps, setHeartProps] = useState({ isMine: false, users: likeUsers, cnt: likeCnt });
  const [commentArr, setCommentArr] = useState<UserCommentProps[]>(comments || []);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [replyProps, setReplyProps] = useState<ReplyProps>();

  const { mutate } = useFeedLikeMutation({
    onSuccess() {
      refetch();
    },
  });

  useEffect(() => {
    const viewportHeight = window.visualViewport.height;
    const fullHeight = window.innerHeight;
    const handleResize = () => {
      if (window.visualViewport.height < window.innerHeight) {
        setIsKeyboardVisible(true);
        setKeyboardHeight(fullHeight - viewportHeight);
      } else {
        setIsKeyboardVisible(false);
        setKeyboardHeight(0);
      }
    };

    window.visualViewport.addEventListener("resize", handleResize);

    return () => {
      window.visualViewport.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setCommentArr(comments);
  }, [comments]);

  const { mutate: writeComment } = useCommentMutation("post", "feed", feedId, {
    onSuccess() {
      onCompleted();
    },
  });

  const { mutate: writeSubComment } = useSubCommentMutation("post", "feed", feedId, {
    onSuccess() {
      onCompleted();
    },
  });

  const onCompleted = () => {
    refetch();
  };

  useEffect(() => {
    if (likeUsers?.some((who) => who.uid === userInfo?.uid)) {
      setHeartProps((old) => ({ ...old, isMine: true, users: likeUsers }));
    }
    if (likeCnt) {
      setHeartProps((old) => ({ ...old, cnt: likeCnt, users: likeUsers }));
    }
  }, [likeUsers, likeCnt, userInfo?.uid]);

  useEffect(() => {
    if (!drawerType) {
      setModalType(null);
    }
  }, [drawerType]);

  const onClickHeart = () => {
    if (isGuest) {
      typeToast("guest");
      return;
    }
    setHeartProps((old) => {
      if (old.isMine) {
        return {
          isMine: false,
          cnt: old.cnt - 1,
          users: old.users.filter((who) => who.uid !== userInfo?.uid),
        };
      } else {
        return {
          isMine: true,
          cnt: old.cnt + 1,
          users: [userInfo, ...old.users],
        };
      }
    });

    mutate(feedId);
  };

  const userAvatarArr = heartProps?.users?.map((who) => ({
    avatar: who?.avatar,
    image: who.profileImage,
  }));

  const addNewComment = (user: IUserSummary, comment: string): UserCommentProps => {
    return {
      user,
      comment,
      createdAt: dayjsToStr(dayjs()),
    };
  };

  const onSubmit = async (value: string) => {
    if (replyProps) {
      writeSubComment({ comment: value, commentId: replyProps.commentId });
      setCommentArr(getCommentArr(value, replyProps.commentId, commentArr, userInfo));
      return;
    }

    await writeComment({ comment: value });
    setCommentArr((old) => [...old, addNewComment(userInfo, value)]);
  };

  const handleDrawerBtn = (type: "comment" | "like") => {
    if (isGuest) {
      typeToast("guest");
      return;
    }

    if (type === "comment") {
      setModalType("comment");
    }
    if (type === "like") {
      setModalType("like");
    }
    // urlSearchParams.append("drawer", type);
    // router.push(`/gather?${urlSearchParams.toString()}`);
  };

  return (
    <>
      <Flex align="center" px={3}>
        <Button
          onClick={onClickHeart}
          size="md"
          px="8px"
          variant="ghost"
          border="none"
          _hover={{
            bg: "none",
          }}
          leftIcon={
            heartProps.isMine ? (
              <i className="fa-solid fa-heart fa-xl" style={{ color: "var(--color-red)" }} />
            ) : (
              <i className="fa-regular fa-heart fa-xl" />
            )
          }
        >
          {heartProps.cnt}
        </Button>
        <Button
          onClick={() => handleDrawerBtn("comment")}
          size="md"
          px="8px"
          border="none"
          variant="ghost"
          leftIcon={<i className="fa-regular fa-message fa-xl" />}
        >
          {commentArr.length}
        </Button>
        {userAvatarArr.length ? (
          <Button
            size="sm"
            variant="ghost"
            mb="2px"
            border="none"
            onClick={() => handleDrawerBtn("like")}
          >
            <AvatarGroupsOverwrap
              userAvatarArr={userAvatarArr}
              userLength={heartProps.cnt}
              maxCnt={6}
              size="md"
            />
          </Button>
        ) : null}
      </Flex>
      {modalType === "like" && (
        <RightDrawer title="좋아요" onClose={() => setModalType(null)}>
          <Flex direction="column">
            {likeUsers.map((who, idx) => (
              <Fragment key={idx}>
                <ProfileCommentCard user={who} comment={{ text: who.comment }} />
              </Fragment>
            ))}
          </Flex>
        </RightDrawer>
      )}
      {modalType === "comment" && (
        <RightDrawer px={false} title="댓글" onClose={() => setModalType(null)}>
          <Flex
            direction="column"
            mt={isKeyboardVisible ? `${keyboardHeight + 8}px` : "8px"}
            zIndex={1}
          >
            {commentArr.map((item, idx) => (
              <UserCommentBlock
                key={idx}
                type="feed"
                id={feedId}
                commentProps={commentArr?.find((comment) => comment._id === item._id)}
                setCommentArr={setCommentArr}
                setReplyProps={setReplyProps}
                hasAuthority={(item.user as IUserSummary).uid !== userInfo?.uid}
              />
            ))}
          </Flex>
          <Box
            position="fixed"
            bottom="0"
            left="0"
            p={5}
            w="full"
            borderTop="var(--border-main)"
            maxW="var(--max-width)"
            mx="auto"
          >
            <UserCommentInput
              user={userInfo}
              onSubmit={onSubmit}
              replyName={replyProps?.replyName}
              setReplyProps={setReplyProps}
            />
          </Box>
        </RightDrawer>
      )}
    </>
  );
}

export default ContentHeartBar;
