import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";

import BellIcon from "../../../assets/icons/BellIcon";
import UserCircleIcon from "../../../assets/icons/UserCircleIcon";
import MainLogo from "../../../assets/MainLogo";
import Slide from "../../../components/layouts/PageSlide";
import IconButtonNav, { IIconButtonNavBtn } from "../../../components/molecules/navs/IconButtonNav";
import {
  DAILY_CHECK_POP_UP,
  NOTICE_ACTIVE_CNT,
  NOTICE_ALERT,
} from "../../../constants/keys/localStorage";
import { useNoticeActiveLogQuery } from "../../../hooks/user/sub/interaction/queries";
import DailyCheckModal from "../../../modals/aboutHeader/dailyCheckModal/DailyCheckModal";
import PointSystemsModal from "../../../modals/aboutHeader/pointSystemsModal/PointSystemsModal";
import StudyRuleModal from "../../../modals/aboutHeader/studyRuleModal/StudyRuleModal";
import { slideDirectionState } from "../../../recoils/navigationRecoils";
import { renderHomeHeaderState } from "../../../recoils/renderRecoils";
import { transferShowDailyCheckState } from "../../../recoils/transferRecoils";
import { NOTICE_ARR } from "../../../storage/notice";
import { dayjsToStr } from "../../../utils/dateTimeUtils";
// export type HomeHeaderModalType =
//   | "promotion"
//   | "rabbit"
//   | "rule"
//   | "notice"
//   | "user"
//   | "attendCheck"
//   | "attendCheckWin";

export type HomeHeaderModalType = "rule" | "dailyCheck" | "pointGuide" | null;

function HomeHeader() {
  const searchParams = useSearchParams();
  const newSearchparams = new URLSearchParams(searchParams);
  const router = useRouter();
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
      // {
      //   icon: <FontAwesomeIcon icon={faBooks} />,
      //   func: () => setModalType("rule"),
      // },
      // {
      //   icon: <FontAwesomeIcon icon={faCircleP} />,
      //   func: () => setModalType("pointGuide"),
      // },
      {
        icon: (
          <>
            <BellIcon />
            {/* {isNoticeAlert && <Alert />} */}
          </>
        ),
        link: "/notice",
        func: () => setSlideDirection("right"),
      },
      {
        icon: <UserCircleIcon />,
        link: !isGuest ? "/user" : null,
        func: isGuest
          ? () => router.replace(`/home?${newSearchparams.toString()}&logout=on`)
          : () => setSlideDirection("right"),
      },
    ];

    if (todayDailyCheck === false && showDailyCheck) {
      // arr.unshift({
      //   icon: <FontAwesomeIcon icon={faBadgeCheck} color="var(--color-mint)" />,
      //   func: () => setModalType("dailyCheck"),
      // });
    }

    return arr;
  };

  const [iconBtnArr, setIconBtnArr] = useState<IIconButtonNavBtn[]>(generateIconBtnArr);

  useEffect(() => {
    setIconBtnArr(generateIconBtnArr());
  }, [showDailyCheck, isNoticeAlert]);

  return (
    <>
      {renderHomeHeader && (
        <Slide isFixed={true}>
          <Layout>
            <MainLogo />
            <Box className="about_header" fontSize="20px">
              <IconButtonNav iconList={iconBtnArr} />
            </Box>
          </Layout>
        </Slide>
      )}
      {modalType === "pointGuide" && <PointSystemsModal setIsModal={() => setModalType(null)} />}
      {modalType === "dailyCheck" && <DailyCheckModal setIsModal={() => setModalType(null)} />}
      {modalType === "rule" && <StudyRuleModal setIsModal={() => setModalType(null)} />}
    </>
  );
}

const Layout = styled.header`
  height: var(--header-h);

  font-size: 20px;
  background-color: white;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--gray-800);
  border-bottom: var(--border);
  max-width: var(--max-width);
  margin: 0 auto;

  > div:first-child {
    display: flex;
    align-items: center;
  }
`;

export default HomeHeader;
