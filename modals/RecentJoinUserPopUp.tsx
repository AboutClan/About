import { Box, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import Avatar from "../components/atoms/Avatar";
import HeartIcon from "../components/Icons/HeartIcon";
import { useToast } from "../hooks/custom/CustomToast";
import { useUserInfoQuery } from "../hooks/user/queries";
import { useInteractionMutation } from "../hooks/user/sub/interaction/mutations";
import { IModal } from "../types/components/modalTypes";
import { IUserSummary } from "../types/models/userTypes/userInfoTypes";
import { ModalLayout } from "./Modals";

interface RecentJoinUserPopUpProps extends IModal {
  users: IUserSummary[];
}

function RecentJoinUserPopUp({ users, setIsModal }: RecentJoinUserPopUpProps) {
  const toast = useToast();
  const { data: userInfo } = useUserInfoQuery();

  const { mutate: requestFriend } = useInteractionMutation("friend", "post", {
    onSuccess() {
      toast("success", "친구추가 요청을 전송했습니다.");
    },
  });

  const [friend, setFriend] = useState<string[]>([]);

  useEffect(() => {
    if (!userInfo) return;
    setFriend(userInfo.friend);
  }, [userInfo]);

  const handleAddFriend = (toUid: string) => {
    setFriend((old) => [...old, toUid]);
    requestFriend({
      toUid,
      message: `${userInfo.name}님의 친구추가 요청`,
    });
  };

  return (
    <ModalLayout footerOptions={{}} title="후기 보내기" setIsModal={setIsModal}>
      <Box fontSize="16px" mb="12px">
        최근에 함께했던 인원이에요~!
        <br /> 좋아요를 받은 인원은 포인트가 적립됩니다!
      </Box>
      <Flex
        direction="column"
        h="215px"
        overflowY="auto"
        sx={{
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {users.map((user, idx) => (
          <Flex
            key={idx}
            justify="space-between"
            align="center"
            borderTop={idx === 0 ? "var(--border-main)" : "none"}
            borderBottom="var(--border-main)"
            py="8px"
            pr="12px"
            pl="4px"
          >
            <Flex align="center">
              <Avatar userId={user._id } uid={user.uid} avatar={user.avatar} image={user.profileImage} size="md" />
              <Box ml="12px" fontSize="16px">
                {user.name}
              </Box>
              {!friend.includes(user.uid) && (
                <Box ml="8px" color="var(--gray-600)" onClick={() => handleAddFriend(user.uid)}>
                  <i className="fa-regular fa-user-plus fa-sm" />
                </Box>
              )}
            </Flex>
            <Flex>
              <HeartIcon toUid={user.uid} />
            </Flex>
          </Flex>
        ))}
      </Flex>
    </ModalLayout>
  );
}

export default RecentJoinUserPopUp;
