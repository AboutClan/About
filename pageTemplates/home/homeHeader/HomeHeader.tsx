import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
import {
  DAILY_CHECK_POP_UP,
  NOTICE_ALERT,
  RECENT_CHAT,
} from "../../../constants/keys/localStorage";
import { useMyChatsQuery } from "../../../hooks/chat/queries";
import { useTypeToast } from "../../../hooks/custom/CustomToast";
import DailyCheckModal from "../../../modals/aboutHeader/dailyCheckModal/DailyCheckModal";
import { renderHomeHeaderState } from "../../../recoils/renderRecoils";
import { NOTICE_ARR } from "../../../storage/notice";
import { dayjsToStr } from "../../../utils/dateTimeUtils";

export type HomeHeaderModalType = "rule" | "dailyCheck" | "pointGuide" | null;

function HomeHeader() {
  const router = useRouter();
  const typeToast = useTypeToast();
  const { data: session } = useSession();
  const isGuest = session ? session.user.name === "guest" : false;
  const [isModal, setIsModal] = useState(false);
  const renderHomeHeader = useRecoilValue(renderHomeHeaderState);

  const todayDailyCheck = localStorage.getItem(DAILY_CHECK_POP_UP) === dayjsToStr(dayjs());

  const [isNoticeAlert, setIsNoticeAlert] = useState(false);

  // const { data } = useNoticeActiveLogQuery(undefined, false);

  // const { data: recentChat } = useRecentChatQuery({ enabled: isGuest === false });

  const { data: chats } = useMyChatsQuery({ enabled: isGuest === false });

  useEffect(() => {
    // if (!data) return;
    // const recentOne = data[0]?.message;

    const noticeCnt = localStorage.getItem(NOTICE_ALERT);
    const recentChatStorage = localStorage.getItem(RECENT_CHAT);
    const chatArr = chats?.sort((a, b) =>
      dayjs(a.content.createdAt).isBefore(dayjs(b.content.createdAt)) ? 1 : -1,
    );
    const recentChat = chatArr?.[0]?.content?.content;
    if (recentChat && recentChat !== recentChatStorage) {
      setIsNoticeAlert(true);
    }

    if (!noticeCnt || NOTICE_ARR.length + "" !== noticeCnt) {
      setIsNoticeAlert(true);
    }
  }, [chats]);

  return (
    <>
      <Slide isFixed={true}>
        {renderHomeHeader && (
          <Layout>
            <AboutLogo />
            <Flex align="center">
              <Box mr={2} position="relative">
                <CalendarCheckModalButton
                  handleClick={isGuest ? () => typeToast("guest") : () => setIsModal(true)}
                />
                <Box
                  position="absolute"
                  right="4px"
                  bottom="4px"
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
                  right="6px"
                  top="4px"
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

      {isModal && <DailyCheckModal setIsModal={setIsModal} />}
    </>
  );
}

const Layout = styled.header`
  height: var(--header-h);
  font-size: 20px;
  background-color: white;

  padding-left: 20px;
  padding-right: 16px;
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
