import { faBadgeCheck, faBell, faCircleP, faCircleUser } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import styled from "styled-components";

import {
  DAILY_CHECK_POP_UP,
  NOTICE_ACTIVE_CNT,
  NOTICE_ALERT,
} from "../../../constants/keys/localStorage";
import { useNoticeActiveLogQuery } from "../../../hooks/user/sub/interaction/queries";
import { NOTICE_ARR } from "../../../storage/notice";
import { AlertIcon } from "../../../styles/icons";
import { dayjsToStr } from "../../../utils/dateTimeUtils";

interface IHomeHeaderIcons {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setIconType: React.Dispatch<any>;
  isRabbitRun: boolean;
}

function HomeHeaderIcons({ setIconType }: IHomeHeaderIcons) {
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

  const isAttendCheck = localStorage.getItem(DAILY_CHECK_POP_UP) === dayjsToStr(dayjs());

  return (
    <Layout className="about_header">
      {!isAttendCheck && (
        <IconWrapper>
          <FontAwesomeIcon
            icon={faBadgeCheck}
            color="var(--color-mint)"
            onClick={() => setIconType("attendCheck")}
          />
        </IconWrapper>
      )}

      {/* <IconWrapper>
        <FontAwesomeIcon
          icon={faRabbitRunning}
          color="var(--color-red)"
          bounce={isRabbitRun}
          onClick={() => setIconType("rabbit")}
        />
      </IconWrapper> */}
      <IconWrapper>
        <FontAwesomeIcon icon={faCircleP} onClick={() => setIconType("rule")} />
      </IconWrapper>
      {/* <IconWrapper>
        <FontAwesomeIcon
          icon={faGift}
          onClick={() => setIconType("promotion")}
        />
      </IconWrapper> */}
      <NoticeWrapper>
        <FontAwesomeIcon icon={faBell} onClick={() => setIconType("notice")} />
        {isNoticeAlert && <Alert />}
      </NoticeWrapper>
      <IconWrapper>
        <FontAwesomeIcon icon={faCircleUser} onClick={() => setIconType("user")} />
      </IconWrapper>
    </Layout>
  );
}
const Layout = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
`;

const IconWrapper = styled.button`
  width: 26px;
  height: 26px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: var(--gap-3);
`;

const NoticeWrapper = styled(IconWrapper)`
  position: relative;
`;

const Alert = styled(AlertIcon)`
  position: absolute;
  right: 4px;
  top: 14px;
`;

export default HomeHeaderIcons;
