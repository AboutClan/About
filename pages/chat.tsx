import { useRouter } from "next/router";
import { useEffect } from "react";
import styled from "styled-components";
import { MainLoadingAbsolute } from "../components/atoms/loaders/MainLoading";

import Header from "../components/layouts/Header";
import Slide from "../components/layouts/PageSlide";
import InfoModalButton from "../components/modalButtons/InfoModalButton";
import { RECENT_CHAT } from "../constants/keys/localStorage";
import { useMyChatsQuery, useRecentChatQuery } from "../hooks/chat/queries";
import { useCheckGuest } from "../hooks/custom/UserHooks";
import NoticeChat from "../pageTemplates/notice/NoticeChat";

export type NoticeType = "notice" | "active";

function ChatPage() {
  const isGuest = useCheckGuest();
  const router = useRouter();
  const type = router.query.type as NoticeType;

  const { data: chats } = useMyChatsQuery();
  console.log(1, chats);
  const { data: recentChat } = useRecentChatQuery();

  useEffect(() => {
    localStorage.setItem(RECENT_CHAT, recentChat);
  }, [recentChat]);

  return (
    <>
      <Slide isFixed={true}>
        <Header title="채팅" isSlide={false}>
          <InfoModalButton type="chat" />
        </Header>
      </Slide>
      <Slide isNoPadding>
        <Container>{chats ? <NoticeChat chats={chats} /> : <MainLoadingAbsolute />}</Container>
      </Slide>
    </>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 56px);
`;

export default ChatPage;
