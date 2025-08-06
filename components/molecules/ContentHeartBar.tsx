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
import { ReplyProps } from "../../pageTemplates/community/SecretSquareComments";
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

  const [isHeartLoading, setIsHeartLoading] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [modalType, setModalType] = useState<"like" | "comment">(null);
  const [heartProps, setHeartProps] = useState({ isMine: false, users: likeUsers, cnt: likeCnt });
  const [commentArr, setCommentArr] = useState<UserCommentProps[]>(comments || []);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [replyProps, setReplyProps] = useState<ReplyProps>();

  const { mutate, isLoading } = useFeedLikeMutation({
    onSuccess() {
      refetch();
    },
    onSettled() {
      setIsHeartLoading(false);
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

  const { mutate: writeComment, isLoading: isLoading2 } = useCommentMutation(
    "post",
    "feed",
    feedId,
    {
      onSuccess() {
        onCompleted();
      },
    },
  );

  const { mutate: writeSubComment, isLoading: isLoading3 } = useSubCommentMutation(
    "post",
    "feed",
    feedId,
    {
      onSuccess() {
        onCompleted();
      },
    },
  );

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
    if (isLoading || isHeartLoading) return;
    setIsHeartLoading(true);
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

  const addNewComment = (user: IUserSummary, comment: string): UserCommentProps => {
    return {
      user,
      comment,
      createdAt: dayjsToStr(dayjs()),
    };
  };

  const onSubmit = async (value: string) => {
    if (isLoading2 || isLoading3) return;
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
          fontSize="12px"
          variant="ghost"
          border="none"
          _hover={{
            bg: "none",
          }}
          leftIcon={heartProps.isMine ? <HeartFillIcon /> : <HeartIcon />}
        >
          {heartProps.cnt}
        </Button>
        <Button
          onClick={() => handleDrawerBtn("comment")}
          size="md"
          px="8px"
          border="none"
          variant="ghost"
          leftIcon={<ChatIcon />}
        >
          {commentArr.length}
        </Button>
        {heartProps.users.length ? (
          <Button
            size="sm"
            variant="ghost"
            mb="2px"
            border="none"
            onClick={() => handleDrawerBtn("like")}
          >
            <AvatarGroupsOverwrap users={heartProps.users} userLength={heartProps.cnt} maxCnt={6} />
          </Button>
        ) : null}
      </Flex>
      {modalType === "like" && (
        <RightDrawer title="좋아요" onClose={() => setModalType(null)}>
          <Flex direction="column">
            {likeUsers.map((who, idx) => (
              <Fragment key={idx}>
                <ProfileCommentCard user={who} comment={{ comment: who.comment }} />
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
                commentProps={item}
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

function HeartIcon() {
  return <svg
    xmlns="http://www.w3.org/2000/svg"
    height="20px"
    viewBox="0 -960 960 960"
    width="20px"
    fill="var(--gray-600)"
  >
    <path d="M480-147q-14 0-28.5-5T426-168l-69-63q-106-97-191.5-192.5T80-634q0-94 63-157t157-63q53 0 100 22.5t80 61.5q33-39 80-61.5T660-854q94 0 157 63t63 157q0 115-85 211T602-230l-68 62q-11 11-25.5 16t-28.5 5Zm-38-543q-29-41-62-62.5T300-774q-60 0-100 40t-40 100q0 52 37 110.5T285.5-410q51.5 55 106 103t88.5 79q34-31 88.5-79t106-103Q726-465 763-523.5T800-634q0-60-40-100t-100-40q-47 0-80 21.5T518-690q-7 10-17 15t-21 5q-11 0-21-5t-17-15Zm38 189Z" />
  </svg>
}

function HeartFillIcon() {
  return <svg
    xmlns="http://www.w3.org/2000/svg"
    height="20px"
    viewBox="0 -960 960 960"
    width="20px"
    fill="var(--color-red)"
  >
    <path d="M480-147q-14 0-28.5-5T426-168l-69-63q-106-97-191.5-192.5T80-634q0-94 63-157t157-63q53 0 100 22.5t80 61.5q33-39 80-61.5T660-854q94 0 157 63t63 157q0 115-85 211T602-230l-68 62q-11 11-25.5 16t-28.5 5Z" />
  </svg>
}

function ChatIcon() {
  return <svg
    xmlns="http://www.w3.org/2000/svg"
    height="20px"
    viewBox="0 -960 960 960"
    width="20px"
    fill="var(--gray-600)"
  >
    <path d="m240-240-92 92q-19 19-43.5 8.5T80-177v-623q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240Zm-34-80h594v-480H160v525l46-45Zm-46 0v-480 480Z" />
  </svg>
}

export default ContentHeartBar;
