import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styled from "styled-components";

import { NewAlertIcon } from "../../components/Icons/AlertIcon";
import { NOTICE_ACTIVE_CNT, RECENT_CHAT_ID } from "../../constants/keys/localStorage";
import { NoticeType } from "../../pages/notice";
import { DispatchType } from "../../types/hooks/reactTypes";

interface INoticeNav {
  noticeType: NoticeType;
  setNoticeType: DispatchType<NoticeType>;
  activeAlertCnt: number;
  recentChatId: string;
}

function NoticeNav({ noticeType, setNoticeType, activeAlertCnt, recentChatId }: INoticeNav) {
  const router = useRouter();
  const [isActiveAlert, setIsActiveAlert] = useState(false);
  const [isChatAlert, setIsChatAlert] = useState(false);

  useEffect(() => {
    if (activeAlertCnt === undefined) return;
    if (+localStorage.getItem(NOTICE_ACTIVE_CNT) < activeAlertCnt) setIsActiveAlert(true);
    if (
      localStorage.getItem(RECENT_CHAT_ID) &&
      localStorage.getItem(RECENT_CHAT_ID) !== recentChatId
    ) {
      setIsChatAlert(true);
    }
    if (noticeType === "active") {
      localStorage.setItem(NOTICE_ACTIVE_CNT, `${activeAlertCnt}`);
      setIsActiveAlert(false);
    }
    if (noticeType === "chat") {
      localStorage.setItem(RECENT_CHAT_ID, recentChatId);
      setIsChatAlert(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeAlertCnt, noticeType]);

  const handleNavigate = (type) => {
    router.replace(`/notice?type=${type}`);
    setNoticeType(type);
  };

  return (
    <Layout>
      <Button isSelected={noticeType === "notice"} onClick={() => handleNavigate("notice")}>
        공지 알림
      </Button>
      <Button isSelected={noticeType === "active"} onClick={() => handleNavigate("active")}>
        활동 알림
        {isActiveAlert && (
          <IconWrapper>
            <NewAlertIcon size="sm" />
          </IconWrapper>
        )}
      </Button>
      <Button isSelected={noticeType === "chat"} onClick={() => handleNavigate("chat")}>
        쪽지 알림
        {isChatAlert && (
          <IconWrapper>
            <NewAlertIcon size="sm" />
          </IconWrapper>
        )}
      </Button>
    </Layout>
  );
}

const Layout = styled.div`
  display: flex;
  max-width: var(--max-width);
  margin: 0 auto;

  > button:nth-child(2) {
    border-left: var(--border);
    border-right: var(--border);
  }
`;

const Button = styled.button<{ isSelected: boolean }>`
  position: relative;
  width: 50%;
  text-align: center;
  font-weight: 600;
  font-size: 16px;
  padding: var(--gap-3) 0;
  font-weight: ${(props) => (props.isSelected ? "700" : "500")};
  border-bottom: ${(props) => props.isSelected && "3px solid var(--color-mint)"};
  background-color: ${(props) => (props.isSelected ? "white" : "var(--gray-100)")};
`;
const IconWrapper = styled.div`
  position: absolute;
  right: 16px;
  bottom: 4px;
`;

export default NoticeNav;
