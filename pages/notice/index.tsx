import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import styled from "styled-components";

import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
import { useMyChatsQuery, useRecentChatQuery } from "../../hooks/chat/queries";
import { useNoticeActiveLogQuery } from "../../hooks/user/sub/interaction/queries";
import NoticeActive from "../../pageTemplates/notice/NoticeActive";
import NoticeChat from "../../pageTemplates/notice/NoticeChat";
import NoticeItem from "../../pageTemplates/notice/NoticeItem";
import NoticeNav from "../../pageTemplates/notice/NoticeNav";

export type NoticeType = "notice" | "active" | "chat";

function Notice() {
  const { data: session } = useSession();
  const isGuest = session ? session?.user.name === "guest" : undefined;
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type") as NoticeType;

  const [noticeType, setNoticeType] = useState<NoticeType>("notice");
  const { data: activeLogs } = useNoticeActiveLogQuery(undefined, false, {
    enabled: isGuest === false,
  });
  const { data: chats } = useMyChatsQuery({ enabled: isGuest === false });
  console.log(24, chats);
  const { data: recentChat } = useRecentChatQuery({ enabled: isGuest === false });

  useEffect(() => {
    if (!type) router.replace(`/notice?type=notice`);
    setNoticeType(type);
  }, [type]);

  return (
    <>
      <Slide isFixed={true}>
        <Header title="알림" isSlide={false} />
        <NoticeNav
          noticeType={noticeType}
          setNoticeType={setNoticeType}
          activeAlertCnt={activeLogs?.length}
          recentChatId={recentChat}
        />
      </Slide>
      <Slide isNoPadding>
        <Container>
          {noticeType === "notice" ? (
            <NoticeItem />
          ) : noticeType === "active" ? (
            <NoticeActive activeLogs={activeLogs} />
          ) : (
            <NoticeChat chats={chats} />
          )}
        </Container>
      </Slide>
    </>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 56px;
  background-color: white;
`;

export default Notice;
