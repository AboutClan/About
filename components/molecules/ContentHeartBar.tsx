import { Button, Flex } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";

import { useFeedLikeMutation } from "../../hooks/feed/mutations";
import { useUserInfoQuery } from "../../hooks/user/queries";
import { transferCommentsState, transferLikeUsersState } from "../../recoils/transferRecoils";
import { FeedComment } from "../../types/models/feed";
import { IUserSummary } from "../../types/models/userTypes/userInfoTypes";
import AvatarGroupsOverwrap from "./groups/AvatarGroupsOverwrap";

interface ContentHeartBarProps {
  feedId: string;
  likeUsers: IUserSummary[];
  likeCnt: number;
  comments: FeedComment[];
  refetch?: () => void;
}

function ContentHeartBar({ feedId, likeUsers, likeCnt, comments, refetch }: ContentHeartBarProps) {
  const router = useRouter();

  const searchParams = useSearchParams();

  const { data: userInfo } = useUserInfoQuery();

  const [heartProps, setHeartProps] = useState({ isMine: false, users: likeUsers, cnt: likeCnt });

  const transferLikeUsers = useSetRecoilState(transferLikeUsersState);
  const transferComments = useSetRecoilState(transferCommentsState);

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

  const handleDrawerBtn = (type: "comment" | "like") => {
    if (type === "comment") {
      setTransferLikeorComment(commentArr);
    }
    if (type === "like") {
      setTransferLikeorComment(likeUsers);
    }
    router.push(`/square/${type}`);
    // urlSearchParams.append("drawer", type);
    // router.push(`/square?${urlSearchParams.toString()}`);
  };

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
          onClick={() => handleDrawerBtn("comment")}
          size="sm"
          px="8px"
          variant="ghost"
          leftIcon={<i className="fa-regular fa-message fa-xl" />}
        >
          {commentArr.length}
        </Button>
        <Button size="sm" variant="ghost" mb="2px" onClick={() => handleDrawerBtn("like")}>
          <AvatarGroupsOverwrap userAvatarArr={userAvatarArr} size="sm" />
        </Button>
      </Flex>
    </>
  );
}

export default ContentHeartBar;
