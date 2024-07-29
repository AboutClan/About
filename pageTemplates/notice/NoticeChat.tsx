import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import Link from "next/link";

import Avatar from "../../components/atoms/Avatar";
import { MyChatsProps } from "../../types/models/chat";
import { getDateDiff } from "../../utils/dateTimeUtils";

interface NoticeChatProps {
  chats: MyChatsProps[];
}

function NoticeChat({ chats }: NoticeChatProps) {
  return (
    <>
      {chats?.map((chat, idx) => {
        const user = chat.user;
        const recentMessage = chat.contents[chat.contents.length - 1];
        return (
          <Link href={`/chat/${user.uid}`} key={idx}>
            <Flex p="16px" justify="space-between" align="center" borderBottom="var(--border)">
              <Flex>
                <Avatar size="md" uid={user.uid} avatar={user.avatar} image={user.profileImage} />
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
                    {recentMessage.content}
                  </Box>
                </Flex>
              </Flex>
              <Box fontSize="12px" color="var(--gray-600)">
                {getDateDiff(dayjs(recentMessage.createdAt))}
              </Box>
            </Flex>
          </Link>
        );
      })}
    </>
  );
}

export default NoticeChat;
