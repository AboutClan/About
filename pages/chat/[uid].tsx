import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";

import Avatar from "../../components/atoms/Avatar";
import ButtonWrapper from "../../components/atoms/ButtonWrapper";
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
import { getSafeAreaBottom } from "../../utils/validationUtils";
import { BanIcon, DeclareDrawer2 } from "../profile/[userId]";
interface Chat {
  message: string;
  isMine: boolean;
  createdAt: string;
}

function Uid() {
  const { uid } = useParams<{ uid: string }>() || {};
  const keypadHeight = useKeypadHeight();

  const userName = useRecoilValue(transferUserName);
  const [chats, setChats] = useState<Chat[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: userInfo } = useUserInfoQuery();
  const { data: chatInfo, isLoading } = useChatQuery(uid);
  const { mutate } = useChatMutation(uid);

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

    if (chats) {
      const timer = setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [chats]);

  const opponent = chatInfo?.opponent;
  const [isBanModal, setIsBanModal] = useState(false);
  return (
    <>
      <Header title={`${userName || opponent?.name}님과의 메세지`} rightPadding={4}>
        <ButtonWrapper onClick={() => setIsBanModal(true)}>
          <BanIcon />
        </ButtonWrapper>
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
                          <Box alignSelf="end" fontSize="10px" color="var(--gray-500)" mr="8px">
                            {getDateDiff(dayjs(chat.createdAt))}
                          </Box>
                          <Box
                            bg="var(--color-mint)"
                            color="white"
                            maxW="280px"
                            p="6px 12px"
                            borderRadius="var(--rounded-lg)"
                            borderTopRightRadius="none"
                            fontSize="12px"
                            fontWeight="light"
                          >
                            {chat.message}
                          </Box>
                        </Flex>
                      ) : opponent ? (
                        <Flex>
                          <Box>
                            <Avatar size="sm1" user={opponent} />
                          </Box>
                          <Flex ml="8px" direction="column">
                            <Box as="span" fontSize="10px" color="gray.700">
                              {opponent.name}
                            </Box>
                            <Box
                              mt={0.5}
                              w="max-content"
                              maxW="200px"
                              bg="var(--gray-100)"
                              border="var(--border)"
                              p="6px 12px"
                              borderRadius="var(--rounded-lg)"
                              borderTopLeftRadius="none"
                              fontSize="12px"
                              fontWeight="light"
                            >
                              {chat.message}
                            </Box>
                          </Flex>
                          <Box alignSelf="end" fontSize="10px" color="var(--gray-500)" ml="8px">
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
        pb={keypadHeight === 0 ? getSafeAreaBottom(0) : "0px"}
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
      {isBanModal && <DeclareDrawer2 user={userInfo} onClose={() => setIsBanModal(false)} />}
    </>
  );
}

export default Uid;
