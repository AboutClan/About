import { Box, Button, Flex } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import AlertDot from "../../components/atoms/AlertDot";
import { NOTICE_ALERT, NOTICE_MESSAGE_ALERT } from "../../constants/keys/localStorage";
import { NoticeType } from "../../pages/notice";
import { NOTICE_ARR } from "../../storage/notice";
import { INoticeActiveLog } from "../../types/globals/interaction";
import { DispatchType } from "../../types/hooks/reactTypes";

interface INoticeNav {
  noticeType: NoticeType;
  setNoticeType: DispatchType<NoticeType>;
  activeLogs: INoticeActiveLog[];
}

function NoticeNav({ noticeType, setNoticeType, activeLogs }: INoticeNav) {
  const router = useRouter();
  const [isActiveAlert, setIsActiveAlert] = useState(false);

  useEffect(() => {
    if (noticeType === "notice") {
      localStorage.setItem(NOTICE_ALERT, NOTICE_ARR.length + "");
      if (!activeLogs?.length) return;

      const noticeMessageStorage = localStorage.getItem(NOTICE_MESSAGE_ALERT);
      if (noticeMessageStorage !== activeLogs?.[0]?.message) {
        setIsActiveAlert(true);
      }
    } else {
      localStorage.setItem(NOTICE_MESSAGE_ALERT, activeLogs?.[0]?.message);
      setIsActiveAlert(false);
    }

    // if (noticeType === "chat") {
    //   localStorage.setItem(RECENT_CHAT, recentChat ?? "");
    //   setIsAlert((prev) => ({ ...prev, chat: false }));
    // }
  }, [activeLogs, noticeType]);

  const handleNavigate = (type: NoticeType) => {
    router.replace(`/notice?type=${type}`);
    setNoticeType(type);
  };

  const tabs = [
    { key: "notice", label: "공지 알림" },
    { key: "active", label: "활동 알림" },
    // { key: "chat", label: "쪽지 알림" },
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
            {isActiveAlert && idx === 1 && (
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
