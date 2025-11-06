import { Box, Button, Flex } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import AlertDot from "../../components/atoms/AlertDot";
import { NOTICE_ACTIVE_CNT, RECENT_CHAT } from "../../constants/keys/localStorage";
import { NoticeType } from "../../pages/notice";
import { DispatchType } from "../../types/hooks/reactTypes";

interface INoticeNav {
  noticeType: NoticeType;
  setNoticeType: DispatchType<NoticeType>;
  activeAlertCnt: number;
  recentChat: string;
}

function NoticeNav({ noticeType, setNoticeType, activeAlertCnt, recentChat }: INoticeNav) {
  const router = useRouter();
  const [isAlert, setIsAlert] = useState({
    notice: false,
    active: false,
    chat: false,
  });

  useEffect(() => {
    if (activeAlertCnt === undefined) return;

    const prevActiveCnt = Number(localStorage.getItem(NOTICE_ACTIVE_CNT) ?? 0);
    const chatDiff = localStorage.getItem(RECENT_CHAT) !== recentChat;

    setIsAlert((prev) => ({
      ...prev,
      active: prevActiveCnt < activeAlertCnt,
      chat: recentChat && chatDiff ? true : prev.chat,
    }));

    if (noticeType === "active") {
      localStorage.setItem(NOTICE_ACTIVE_CNT, String(activeAlertCnt ?? 0));
      setIsAlert((prev) => ({ ...prev, active: false }));
    }
    if (noticeType === "chat") {
      localStorage.setItem(RECENT_CHAT, recentChat ?? "");
      setIsAlert((prev) => ({ ...prev, chat: false }));
    }
  }, [activeAlertCnt, noticeType, recentChat]);

  const handleNavigate = (type: NoticeType) => {
    router.replace(`/notice?type=${type}`);
    setNoticeType(type);
  };

  const tabs = [
    { key: "notice", label: "공지 알림" },
    { key: "active", label: "활동 알림" },
    { key: "chat", label: "쪽지 알림" },
  ] as const;

  return (
    <Flex maxW="var(--max-width)" mx="auto" borderBottom="var(--border)">
      {tabs.map((tab, idx) => {
        const selected = noticeType === tab.key;
        return (
          <Button
            borderRadius="0"
            key={tab.key}
            position="relative"
            flex={1}
            variant="unstyled"
            fontSize="14px"
            fontWeight={selected ? 700 : 500}
            py={3}
            bg={selected ? "white" : "var(--gray-100)"}
            border="var(--border-main)"
            borderLeft={idx === 1 ? "var(--border-main)" : "none"}
            borderRight={idx === 1 ? "var(--border-main)" : "none"}
            borderBottom={selected ? "2px solid var(--color-mint)" : "var(--border-main)"}
            onClick={() => handleNavigate(tab.key)}
          >
            {tab.label}
            {isAlert[tab.key] && (
              <Box position="absolute" right={2} bottom={2}>
                <AlertDot />
              </Box>
            )}
          </Button>
        );
      })}
    </Flex>
  );
}

export default NoticeNav;
