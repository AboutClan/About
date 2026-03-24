import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import Link from "next/link";
import { useSetRecoilState } from "recoil";

import Avatar from "../../components/atoms/Avatar";
import { transferUserName } from "../../recoils/transferRecoils";
import { MyChatsProps } from "../../types/models/chat";
import { dayjsToFormat } from "../../utils/dateTimeUtils";

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
          <Link href={`/chat/${user._id}`} key={idx} onClick={() => setTransferUserName(user.name)}>
            <Flex px={5} py={3} justify="space-between" align="center" borderBottom="var(--border)">
              <Flex flex={1}>
                <Avatar user={user} size="md1" isLink={false} />
                <Flex ml={4} direction="column" justify="space-around">
                  <Box fontSize="13px" fontWeight={600}>
                    {user.name}
                  </Box>
                  <Box
                    color="var(--gray-500)"
                    sx={{
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: "1",
                      overflow: "hidden",
                    }}
                    fontSize="13px"
                  >
                    {chat.content.content}
                  </Box>
                </Flex>
              </Flex>
              <Box fontSize="12px" color="var(--gray-400)" ml={5}>
                {dayjsToFormat(dayjs(chat.content.createdAt), "M월 D일")}
              </Box>
            </Flex>
          </Link>
        );
      })}
    </>
  );
}

export default NoticeChat;
