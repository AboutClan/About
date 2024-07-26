import { Button, Flex } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { useFeedLikeMutation } from "../../hooks/feed/mutations";
import { IUserSummary } from "../../types/models/userTypes/userInfoTypes";
import RightUserDrawer from "../organisms/drawer/RightUserDrawer";
import AvatarGroupsOverwrap from "./groups/AvatarGroupsOverwrap";

interface ContentHeartBarProps {
  feedId: string;
  likeUsers: IUserSummary[];
  likeCnt: number;
}

function ContentHeartBar({ feedId, likeUsers, likeCnt }: ContentHeartBarProps) {
  const { data: session } = useSession();

  const [modalType, setModalType] = useState<"like" | "comment">(null);
  const [heartProps, setHeartProps] = useState({ isMine: false, cnt: likeCnt });

  const { mutate } = useFeedLikeMutation();

  useEffect(() => {
    if (likeUsers?.some((who) => who.uid === session?.user.uid)) {
      setHeartProps((old) => ({ ...old, isMine: true }));
    }
    if (likeCnt) {
      setHeartProps((old) => ({ ...old, cnt: likeCnt }));
    }
  }, [likeUsers, likeCnt, session?.user]);

  const onClickHeart = () => {
    setHeartProps((old) => ({ isMine: !old.isMine, cnt: old.isMine ? old.cnt - 1 : old.cnt + 1 }));
    mutate(feedId);
  };

  const userAvatarArr = likeUsers?.map((who) => ({ avatar: who?.avatar, image: who.profileImage }));

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
        <RightUserDrawer
          title={modalType === "like" ? "좋아요" : "댓글"}
          users={likeUsers}
          isOpen={true}
          onClose={() => setModalType(null)}
        />
      )}
    </>
  );
}

export default ContentHeartBar;
