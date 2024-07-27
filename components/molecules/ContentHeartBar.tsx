import { Button, Flex } from "@chakra-ui/react";
import { Fragment, useEffect, useState } from "react";

import { useFeedLikeMutation } from "../../hooks/feed/mutations";
import { useUserInfoQuery } from "../../hooks/user/queries";
import { IUserSummary } from "../../types/models/userTypes/userInfoTypes";
import RightUserDrawer from "../organisms/drawer/RightUserDrawer";
import ProfileCommentCard from "./cards/ProfileCommentCard";
import AvatarGroupsOverwrap from "./groups/AvatarGroupsOverwrap";

interface ContentHeartBarProps {
  feedId: string;
  likeUsers: IUserSummary[];
  likeCnt: number;
  refetch?: () => void;
}

function ContentHeartBar({ feedId, likeUsers, likeCnt, refetch }: ContentHeartBarProps) {
  const { data: userInfo } = useUserInfoQuery();

  const [modalType, setModalType] = useState<"like" | "comment">(null);
  const [heartProps, setHeartProps] = useState({ isMine: false, users: likeUsers, cnt: likeCnt });

  const { mutate } = useFeedLikeMutation({
    onSuccess() {
      refetch();
    },
  });

  useEffect(() => {
    if (likeUsers?.some((who) => who.uid === userInfo?.uid)) {
      setHeartProps((old) => ({ ...old, isMine: true, users: likeUsers }));
    }
    if (likeCnt) {
      setHeartProps((old) => ({ ...old, cnt: likeCnt, users: likeUsers }));
    }
  }, [likeUsers, likeCnt, userInfo?.uid]);

  const onClickHeart = () => {
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

  return (
    <>
      <Flex align="center" pl="8px" pr="16px" pb="8px">
        <Button
          onClick={onClickHeart}
          size="sm"
          px="8px"
          variant="ghost"
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
          onClick={() => setModalType("comment")}
          size="sm"
          px="8px"
          variant="ghost"
          leftIcon={<i className="fa-regular fa-message fa-xl" />}
        >
          {0}
        </Button>
        <Button size="sm" variant="ghost" mb="2px" onClick={() => setModalType("like")}>
          <AvatarGroupsOverwrap userAvatarArr={userAvatarArr} size="sm" />
        </Button>
      </Flex>
      {modalType === "like" && (
        <RightUserDrawer title="좋아요" isOpen={true} onClose={() => setModalType(null)}>
          <Flex direction="column">
            {likeUsers.map((who, idx) => (
              <Fragment key={idx}>
                <ProfileCommentCard user={who} comment={who.comment} />
              </Fragment>
            ))}
          </Flex>
        </RightUserDrawer>
      )}
      {modalType === "comment" && (
        <RightUserDrawer title="댓글" isOpen={true} onClose={() => setModalType(null)}>
          <Flex direction="column">
            {/* {commentArr?.map((item, idx) => (
              <UserComment
                key={idx}
                type="gather"
                user={item.user}
                updatedAt={item.updatedAt}
                comment={item.comment}
                pageId={gatherId}
                commentId={item._id}
                setCommentArr={setCommentArr}
                resetCache={resetCache}
              />
            ))} */}{" "}
            {/* <Box mr="8px">
              <UserCommentInput user={userInfo} onSubmit={onSubmit} />
            </Box> */}
          </Flex>
        </RightUserDrawer>
      )}
    </>
  );
}

export default ContentHeartBar;
