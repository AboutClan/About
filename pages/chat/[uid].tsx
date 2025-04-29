import { Box, Button, Flex, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";

import Avatar from "../../components/atoms/Avatar";
import { MainLoadingAbsolute } from "../../components/atoms/loaders/MainLoading";
import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
import UserCommentInput from "../../components/molecules/UserCommentInput";
import { useChatMutation } from "../../hooks/chat/mutations";
import { useChatQuery } from "../../hooks/chat/queries";
import { useKeypadHeight } from "../../hooks/custom/useKeypadHeight";
import { useUserInfoQuery } from "../../hooks/user/queries";
import { transferUserName } from "../../recoils/transferRecoils";
import { getDateDiff } from "../../utils/dateTimeUtils";
import { iPhoneNotchSize } from "../../utils/validationUtils";

interface Chat {
  message: string;
  isMine: boolean;
  createdAt: string;
}

function Uid() {
  const router = useRouter();
  const { uid } = useParams<{ uid: string }>() || {};
  const keypadHeight = useKeypadHeight();

  const userName = useRecoilValue(transferUserName);
  const [chats, setChats] = useState<Chat[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: userInfo } = useUserInfoQuery();
  const { data: chatInfo, isLoading } = useChatQuery(uid);
  const { mutate } = useChatMutation(uid);

  const onClickMenuItem = () => {
    router.push(`/profile/${uid}?declare=on`);
  };

  const onSubmit = async (message: string) => {
    await mutate({ message });
    setChats((old) => [...old, { message, isMine: true, createdAt: dayjs().toString() }]);
  };

  useEffect(() => {
    if (!chatInfo || !userInfo) return;

    setChats(
      chatInfo.contents.map((chat) => ({
        message: chat.content,
        createdAt: chat.createdAt,
        isMine: userInfo._id === chat.userId,
      })),
    );
  }, [chatInfo, userInfo]);

  useEffect(() => {
    // 스크롤을 맨 아래로 이동
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  const opponent = chatInfo?.opponent;

  return (
    <>
      <Header title={`${userName || "ㅇㅇ"}님과의 메세지`} rightPadding={4}>
        <Menu>
          <MenuButton variant="ghost" size="md" as={Button}>
            <i className="fa-regular fa-ellipsis fa-lg" />
          </MenuButton>
          <MenuList fontSize="14px">
            <MenuItem onClick={onClickMenuItem}>거리두기</MenuItem>
            <MenuItem onClick={onClickMenuItem}>신고하기</MenuItem>
          </MenuList>
        </Menu>
      </Header>
      <Slide isNoPadding>
        <Flex
          height="calc(100dvh - 118px)"
          overflow="scroll"
          bgColor="white"
          direction="column"
          p="16px"
        >
          <>
            {!isLoading ? (
              <>
                {chats.map((chat, idx) => {
                  return (
                    <Box key={idx} mb="16px">
                      {chat.isMine ? (
                        <Flex ml="auto" w="max-content">
                          <Box alignSelf="end" fontSize="10px" color="var(--gray-600)" mr="8px">
                            {getDateDiff(dayjs(chat.createdAt))}
                          </Box>
                          <Box
                            bg="var(--color-mint)"
                            color="white"
                            maxW="280px"
                            p="6px 12px"
                            borderRadius="var(--rounded-lg)"
                            borderTopRightRadius="none"
                          >
                            {chat.message}
                          </Box>
                        </Flex>
                      ) : opponent ? (
                        <Flex>
                          <Box>
                            <Avatar size="sm1" user={opponent} />
                          </Box>
                          <Flex ml="8px" direction="column" color="var(--gray-800)">
                            <Box as="span" fontSize="13px">
                              {opponent.name}
                            </Box>
                            <Box
                              mt="4px"
                              w="max-content"
                              maxW="200px"
                              bg="var(--gray-100)"
                              border="var(--border)"
                              p="6px 12px"
                              borderRadius="var(--rounded-lg)"
                              borderTopLeftRadius="none"
                            >
                              {chat.message}
                            </Box>
                          </Flex>
                          <Box alignSelf="end" fontSize="10px" color="var(--gray-600)" ml="8px">
                            {getDateDiff(dayjs(chat.createdAt))}
                          </Box>
                        </Flex>
                      ) : null}
                    </Box>
                  );
                })}
                <div ref={bottomRef} />
              </>
            ) : (
              <MainLoadingAbsolute size="sm" />
            )}
          </>
        </Flex>
      </Slide>
      <Box
        position="fixed"
        borderTop="var(--border)"
        bottom="0"
        flex={1}
        w="100%"
        backgroundColor="white"
        maxW="var(--max-width)"
        pb={`${keypadHeight === 0 ? iPhoneNotchSize() : 0}px`}
      >
        <Box py={4} borderBottom="var(--border)" px={5}>
          <UserCommentInput
            replyName={null}
            setReplyProps={null}
            user={userInfo}
            onSubmit={onSubmit}
            type="message"
            initialFocus
          />
        </Box>
      </Box>
    </>
  );
}

export default Uid;
