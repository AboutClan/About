import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";

import MainLogo from "../../../assets/MainLogo";
import Slide from "../../../components/layouts/PageSlide";
import IconButtonNav, { IIconButtonNavBtn } from "../../../components/molecules/navs/IconButtonNav";
import {
  DAILY_CHECK_POP_UP,
  NOTICE_ACTIVE_CNT,
  NOTICE_ALERT,
} from "../../../constants/keys/localStorage";
import { useTypeToast } from "../../../hooks/custom/CustomToast";
import { useNoticeActiveLogQuery } from "../../../hooks/user/sub/interaction/queries";
import DailyCheckModal from "../../../modals/aboutHeader/dailyCheckModal/DailyCheckModal";
import PointSystemsModal from "../../../modals/aboutHeader/pointSystemsModal/PointSystemsModal";
import LastWeekAttendPopUp from "../../../modals/pop-up/LastWeekAttendPopUp";
import { slideDirectionState } from "../../../recoils/navigationRecoils";
import { renderHomeHeaderState } from "../../../recoils/renderRecoils";
import { transferShowDailyCheckState } from "../../../recoils/transferRecoils";
import { NOTICE_ARR } from "../../../storage/notice";
import { dayjsToStr } from "../../../utils/dateTimeUtils";

export type HomeHeaderModalType = "rule" | "dailyCheck" | "pointGuide" | null;

function HomeHeader() {
  const searchParams = useSearchParams();
  const newSearchparams = new URLSearchParams(searchParams);
  const router = useRouter();
  const typeToast = useTypeToast();
  const { data: session } = useSession();
  const isGuest = session?.user.name === "guest";
  const [modalType, setModalType] = useState<HomeHeaderModalType>(null);
  const showDailyCheck = useRecoilValue(transferShowDailyCheckState);
  const renderHomeHeader = useRecoilValue(renderHomeHeaderState);
  const setSlideDirection = useSetRecoilState(slideDirectionState);

  const todayDailyCheck = localStorage.getItem(DAILY_CHECK_POP_UP) === dayjsToStr(dayjs());

  const [isNoticeAlert, setIsNoticeAlert] = useState(false);

  const { data } = useNoticeActiveLogQuery();

  useEffect(() => {
    if (!data) return;
    const activeCnt = localStorage.getItem(NOTICE_ACTIVE_CNT);
    const noticeCnt = localStorage.getItem(NOTICE_ALERT);

    if (+activeCnt !== data?.length || NOTICE_ARR.length !== +noticeCnt) {
      setIsNoticeAlert(true);
    }
  }, [data]);

  const generateIconBtnArr = () => {
    const arr = [
      {
        icon: <i className="fa-light fa-calendar-star" />,
        func: isGuest ? () => typeToast("guest") : () => setModalType("pointGuide"),
      },
      {
        icon: <i className="fa-light fa-circle-book-open" />,
        func: () => setModalType("rule"),
      },
      {
        icon: (
          <>
            <i className="fa-light fa-bell" />
            {isNoticeAlert && <Alert />}
          </>
        ),
        link: "/notice",
        func: () => setSlideDirection("right"),
      },
      {
        icon: <i className="fa-light fa-user-circle" />,
        link: !isGuest ? "/user" : null,
        func: isGuest
          ? () => router.replace(`/home?${newSearchparams.toString()}&logout=on`)
          : () => setSlideDirection("right"),
      },
    ];

    if (todayDailyCheck === false && showDailyCheck) {
      arr.unshift({
        icon: <i className="fa-light fa-badge-check" style={{ color: "var(--color-mint)" }} />,
        func: () => setModalType("dailyCheck"),
      });
    }

    return arr;
  };

  const [iconBtnArr, setIconBtnArr] = useState<IIconButtonNavBtn[]>(generateIconBtnArr);

  useEffect(() => {
    setIconBtnArr(generateIconBtnArr());
  }, [showDailyCheck, isGuest, isNoticeAlert]);

  return (
    <>
      {renderHomeHeader && (
        <Slide isFixed={true}>
          <Layout>
            <MainLogo />
            <Box className="about_header" fontSize="21px" color="var(--gray-700)">
              <IconButtonNav iconList={iconBtnArr} />
            </Box>
          </Layout>
        </Slide>
      )}
      {modalType === "pointGuide" && <LastWeekAttendPopUp setIsModal={() => setModalType(null)} />}
      {modalType === "dailyCheck" && <DailyCheckModal setIsModal={() => setModalType(null)} />}
      {modalType === "rule" && <PointSystemsModal setIsModal={() => setModalType(null)} />}
    </>
  );
}

const Layout = styled.header`
  height: var(--header-h);
  font-size: 20px;
  background-color: white;
  padding: 0 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  max-width: var(--max-width);
  margin: 0 auto;

  > div:first-child {
    display: flex;
    align-items: center;
  }
`;

const Alert = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--color-red);
  position: absolute;
  right: 14px;
  bottom: 24px;
`;

export default HomeHeader;
