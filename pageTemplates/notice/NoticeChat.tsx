import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import Link from "next/link";
import { useSetRecoilState } from "recoil";

import Avatar from "../../components/atoms/Avatar";
import { transferUserName } from "../../recoils/transferRecoils";
import { MyChatsProps } from "../../types/models/chat";
import { getDateDiff } from "../../utils/dateTimeUtils";

interface NoticeChatProps {
  chats: MyChatsProps[];
}

function NoticeChat({ chats }: NoticeChatProps) {
  const setTransferUserName = useSetRecoilState(transferUserName);

  return (
    <>
      {chats?.map((chat, idx) => {
        const user = chat.user;
        return (
          <Link
            href={`/chat/${user._id}`}
            key={idx}
            onClick={() => setTransferUserName(chat.user.name)}
          >
            <Flex p="16px" justify="space-between" align="center" borderBottom="var(--border)">
              <Flex flex={1}>
                <Avatar
                  userId={user._id}
                  size="md"
                  uid={user.uid}
                  avatar={user.avatar}
                  image={user.profileImage}
                  isLink={false}
                />
                <Flex ml="12px" direction="column">
                  <Box fontSize="13px" fontWeight={600}>
                    {user.name}
                  </Box>
                  <Box
                    mt="auto"
                    color="var(--gray-600)"
                    sx={{
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: "1",
                      overflow: "hidden",
                    }}
                  >
                    {chat.content.content}
                  </Box>
                </Flex>
              </Flex>
              <Box fontSize="12px" color="var(--gray-600)" ml="12px">
                {getDateDiff(dayjs(chat.content.createdAt))}
              </Box>
            </Flex>
          </Link>
        );
      })}
    </>
  );
}

export default NoticeChat;
