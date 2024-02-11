import { useEffect, useState } from "react";
import styled from "styled-components";
import { NewAlertIcon } from "../../components/common/Icon/AlertIcon";
import { NOTICE_ACTIVE_CNT } from "../../constants/keys/localStorage";
import { AlertIcon } from "../../styles/icons";
import { DispatchBoolean } from "../../types/reactTypes";

interface INoticeNav {
  isNotice: boolean;
  setIsNotice: DispatchBoolean;
  activeAlertCnt: number;
}

function NoticeNav({ isNotice, setIsNotice, activeAlertCnt }: INoticeNav) {
  const [isActiveAlert, setIsActiveAlert] = useState(false);

  useEffect(() => {
    if (!activeAlertCnt) return;
    if (!isNotice) {
      localStorage.setItem(NOTICE_ACTIVE_CNT, `${activeAlertCnt}`);
      setIsActiveAlert(false);
    }
    if (+localStorage.getItem(NOTICE_ACTIVE_CNT) < activeAlertCnt)
      setIsActiveAlert(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeAlertCnt, isNotice]);

  return (
    <Layout>
      <Button isSelected={isNotice} onClick={() => setIsNotice(true)}>
        공지 알림
      </Button>
      <Button isSelected={!isNotice} onClick={() => setIsNotice(false)}>
        활동 알림
        {isActiveAlert && (
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
`;

const Button = styled.button<{ isSelected: boolean }>`
  position: relative;
  width: 50%;
  text-align: center;
  font-weight: 600;
  font-size: 16px;
  padding: var(--padding-sub) 0;
  font-weight: ${(props) => (props.isSelected ? "700" : "500")};
  border-bottom: ${(props) =>
    props.isSelected && "3px solid var(--color-mint)"};
  background-color: ${(props) =>
    props.isSelected ? "white" : "var(--font-h8)"};
`;
const IconWrapper = styled.div`
  position: absolute;
  right: 40px;
  bottom: 8px;
`;

const Alert = styled(AlertIcon)`
  position: absolute;
  top: 0;
  right: 30%;
  width: 6px;
  height: 6px;
`;

export default NoticeNav;