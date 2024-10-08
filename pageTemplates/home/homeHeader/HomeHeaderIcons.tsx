import dayjs from "dayjs";
import { useEffect, useState } from "react";
import styled from "styled-components";

import { DAILY_CHECK_POP_UP, NOTICE_ALERT } from "../../../constants/keys/localStorage";
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

  // useNoticeActiveLogQuery(null, false, {
  //   onSuccess(data) {
  //     const activeCnt = localStorage.getItem(NOTICE_ACTIVE_CNT);
  //     if (+activeCnt !== data?.length) setIsNoticeAlert(true);
  //   },
  // });

  useEffect(() => {
    if (localStorage.getItem(NOTICE_ALERT) !== String(NOTICE_ARR.length)) {
      setIsNoticeAlert(true);
    }
  }, []);

  const isAttendCheck = localStorage.getItem(DAILY_CHECK_POP_UP) === dayjsToStr(dayjs());

  return (
    <Layout className="about_header">
      {!isAttendCheck && (
        <IconWrapper onClick={() => setIconType("attendCheck")}>
          <i className="fa-light fa-badge-check" style={{ color: "var(--color-mint)" }} />
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
        <i className="fa-light fa-circle-p" onClick={() => setIconType("rule")} />
      </IconWrapper>
      {/* <IconWrapper>
        <FontAwesomeIcon
          icon={faGift}
          onClick={() => setIconType("promotion")}
        />
      </IconWrapper> */}
      <NoticeWrapper>
        <i className="fa-light fa-bell" onClick={() => setIconType("notice")} />
        {isNoticeAlert && <Alert />}
      </NoticeWrapper>
      <IconWrapper>
        <i className="fa-light fa-circle-user" onClick={() => setIconType("user")} />
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
