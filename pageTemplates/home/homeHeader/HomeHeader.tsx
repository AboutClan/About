import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";

import AlertCirclePoint from "../../../components/atoms/AlertCirclePoint";
import {
  BellModalButton,
  CalendarCheckModalButton,
} from "../../../components/atoms/buttons/ModalButtons";
import Slide from "../../../components/layouts/PageSlide";
import { AboutLogo } from "../../../components/services/AboutLogo";
import { DAILY_CHECK_POP_UP, NOTICE_ALERT } from "../../../constants/keys/localStorage";
import { useTypeToast } from "../../../hooks/custom/CustomToast";
import DailyCheckModal from "../../../modals/aboutHeader/dailyCheckModal/DailyCheckModal";
import PointSystemsModal from "../../../modals/aboutHeader/pointSystemsModal/PointSystemsModal";
import LastWeekAttendPopUp from "../../../modals/pop-up/LastWeekAttendPopUp";
import { renderHomeHeaderState } from "../../../recoils/renderRecoils";
import { NOTICE_ARR } from "../../../storage/notice";
import { dayjsToStr } from "../../../utils/dateTimeUtils";

export type HomeHeaderModalType = "rule" | "dailyCheck" | "pointGuide" | null;

function HomeHeader() {
  const router = useRouter();
  const typeToast = useTypeToast();
  const { data: session } = useSession();
  const isGuest = session ? session.user.name === "guest" : false;
  const [modalType, setModalType] = useState<HomeHeaderModalType>(null);

  const renderHomeHeader = useRecoilValue(renderHomeHeaderState);

  const todayDailyCheck = localStorage.getItem(DAILY_CHECK_POP_UP) === dayjsToStr(dayjs());

  const [isNoticeAlert, setIsNoticeAlert] = useState(false);

  // const { data } = useNoticeActiveLogQuery(undefined, false);

  // const { data: recentChat } = useRecentChatQuery({ enabled: isGuest === false });

  useEffect(() => {
    // if (!data) return;
    // const recentOne = data[0]?.message;

    const noticeCnt = localStorage.getItem(NOTICE_ALERT);
    console.log(1234, noticeCnt, NOTICE_ARR.length);
    if (!noticeCnt || NOTICE_ARR.length + "" !== noticeCnt) {
      setIsNoticeAlert(true);
    }
  }, []);

  return (
    <>
      <Slide isFixed={true}>
        {renderHomeHeader && (
          <Layout>
            <AboutLogo />
            <Flex align="center">
              <Box mr={1} position="relative">
                <CalendarCheckModalButton
                  handleClick={
                    isGuest ? () => typeToast("guest") : () => setModalType("dailyCheck")
                  }
                />
                <Box
                  position="absolute"
                  right="3px"
                  bottom="3px"
                  p="1px"
                  bgColor="white"
                  borderRadius="50%"
                >
                  <AlertCirclePoint isActive={!todayDailyCheck} />
                </Box>
              </Box>

              <Box position="relative">
                <BellModalButton handleClick={() => router.push("/notice")} />
                <Box
                  position="absolute"
                  right="4px"
                  top="3px"
                  p="1px"
                  bgColor="white"
                  borderRadius="50%"
                >
                  <AlertCirclePoint isActive={isNoticeAlert} />
                </Box>
              </Box>
            </Flex>
          </Layout>
        )}
      </Slide>
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
  border-bottom: 1px solid var(--gray-100);
  max-width: var(--max-width);
  margin: 0 auto;

  > div:first-child {
    display: flex;
    align-items: center;
  }
`;

export default HomeHeader;
