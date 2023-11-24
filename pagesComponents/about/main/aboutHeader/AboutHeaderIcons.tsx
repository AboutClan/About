import {
  faBadgeCheck,
  faBalanceScale,
  faBell,
  faGift,
  faUser,
} from "@fortawesome/pro-regular-svg-icons";
import { faRabbitRunning } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  DAILY_CHECK_POP_UP,
  NOTICE_ACTIVE_CNT,
  NOTICE_ALERT,
} from "../../../../constants/keys/localStorage";
import { dayjsToStr } from "../../../../helpers/dateHelpers";
import { useNoticeActiveLogQuery } from "../../../../hooks/user/sub/interaction/queries";
import { NOTICE_ARR } from "../../../../storage/notice";
import { AlertIcon } from "../../../../styles/icons";
import { AboutHeaderIconType } from "./AboutHeader";

interface IAboutHeaderIcons {
  setIconType: React.Dispatch<AboutHeaderIconType>;
  isRabbitRun: boolean;
}

function AboutHeaderIcons({ setIconType, isRabbitRun }: IAboutHeaderIcons) {
  const [isNoticeAlert, setIsNoticeAlert] = useState(false);

  useNoticeActiveLogQuery({
    onSuccess(data) {
      const activeCnt = localStorage.getItem(NOTICE_ACTIVE_CNT);
      if (+activeCnt !== data?.length) setIsNoticeAlert(true);
    },
  });

  useEffect(() => {
    if (localStorage.getItem(NOTICE_ALERT) !== String(NOTICE_ARR.length)) {
      setIsNoticeAlert(true);
    }
  }, []);

  const isAttendCheck =
    localStorage.getItem(DAILY_CHECK_POP_UP) === dayjsToStr(dayjs());

  return (
    <Layout>
      {!isAttendCheck && (
        <IconWrapper>
          <FontAwesomeIcon
            icon={faBadgeCheck}
            size="lg"
            color="var(--color-mint)"
            onClick={() => setIconType("attendCheck")}
            bounce
          />
        </IconWrapper>
      )}
      {/** rabbit */}
      <IconWrapper>
        <FontAwesomeIcon
          icon={faRabbitRunning}
          size="lg"
          color="var(--color-red)"
          bounce={isRabbitRun}
          onClick={() => setIconType("rabbit")}
        />
      </IconWrapper>
      <IconWrapper>
        <FontAwesomeIcon
          icon={faBalanceScale}
          size="lg"
          onClick={() => setIconType("rule")}
        />
      </IconWrapper>
      <IconWrapper>
        <FontAwesomeIcon
          icon={faGift}
          size="lg"
          onClick={() => setIconType("promotion")}
        />
      </IconWrapper>
      <NoticeWrapper>
        <FontAwesomeIcon
          icon={faBell}
          size="xl"
          onClick={() => setIconType("notice")}
        />
        {isNoticeAlert && <Alert />}
      </NoticeWrapper>
      <IconWrapper>
        <FontAwesomeIcon
          icon={faUser}
          size="xl"
          onClick={() => setIconType("user")}
        />
      </IconWrapper>
    </Layout>
  );
}
const IconWrapper = styled.button`
  padding: 0 10px;
  height: 100%;
  display: flex;
  align-items: center;
`;
const Layout = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
`;
const NoticeWrapper = styled(IconWrapper)`
  position: relative;
`;
const Alert = styled(AlertIcon)`
  position: absolute;
  right: 11px;
  top: 14px;
`;

export default AboutHeaderIcons;
