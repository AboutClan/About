import { Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

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

  const handleClickDice = () => {
    router.push(`/random-roulette`);
  };

  return (
    <>
      <Slide isFixed={true}>
        {renderHomeHeader && (
          <Flex
            as="header"
            h="var(--header-h)"
            fontSize="20px"
            bg="white"
            pl="20px"
            pr="16px"
            justify="space-between"
            align="center"
            borderBottom="var(--border)"
            maxW="var(--max-width)"
            mx="auto"
          >
            <AboutLogo />
            <Flex align="center">
              <Box position="relative" mr={3.5}>
                <Button onClick={handleClickDice} variant="unstyled" w={8} h={8} display="flex">
                  <DiceIcon />
                </Button>
              </Box>
              <Box mr={2.5} position="relative">
                <CalendarCheckModalButton handleClick={() => setIsModal(true)} />
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
                <BellModalButton
                  handleClick={isGuest ? () => typeToast("guest") : () => router.push("/notice")}
                />
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
          </Flex>
        )}
      </Slide>

      {isModal && <DailyCheckModal setIsModal={setIsModal} />}
    </>
  );
}

function DiceIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 640 640"
      width={26}
      height={26}
      fill="none"
    >
      <path
        fill="var(--color-mint)"
        d="M205.4 66.3C167 56 127.5 78.8 117.3 117.2L66.5 306.7C56.2 345.1 79 384.6 117.4 394.9L306.9 445.7C345.3 456 384.8 433.2 395.1 394.8L445.9 205.3C456.2 166.9 433.4 127.4 395 117.1L205.4 66.3zM228.4 272C222.3 262.1 222.1 249.6 227.8 239.5C233.5 229.4 244.3 223.2 256 223.3C267.6 223.4 278.2 229.8 283.8 240C289.9 249.9 290.1 262.4 284.4 272.5C278.7 282.6 267.9 288.8 256.2 288.7C244.6 288.6 234 282.2 228.4 272zM143.2 284.3C153.1 278.2 165.6 278 175.7 283.7C185.8 289.4 192 300.2 191.9 311.9C191.8 323.5 185.4 334.1 175.2 339.7C165.3 345.8 152.8 346 142.7 340.3C132.6 334.6 126.4 323.8 126.5 312.1C126.6 300.5 133 289.9 143.2 284.3zM328.2 380.7C318.3 386.8 305.8 387 295.7 381.3C285.6 375.6 279.4 364.8 279.5 353.1C279.6 341.5 286 330.9 296.2 325.3C306.1 319.2 318.6 319 328.7 324.7C338.8 330.4 345 341.2 344.9 352.9C344.8 364.5 338.4 375.1 328.2 380.7zM337.2 172.3C347.1 166.2 359.6 166 369.7 171.7C379.8 177.4 386 188.2 385.9 199.9C385.8 211.5 379.4 222.1 369.2 227.7C359.3 233.8 346.8 234 336.7 228.3C326.6 222.6 320.4 211.8 320.5 200.1C320.6 188.5 327 177.9 337.2 172.3zM216.2 186.7C206.3 192.8 193.8 193 183.7 187.3C173.6 181.6 167.4 170.8 167.5 159.1C167.6 147.5 174 136.9 184.2 131.3C194.1 125.2 206.6 125 216.7 130.7C226.8 136.4 233 147.2 232.9 158.9C232.8 170.5 226.4 181.1 216.2 186.7zM482 256L441.4 407.2C424.2 471.2 358.4 509.2 294.4 492.1L256.1 481.8L256.1 512C256.1 547.3 284.8 576 320.1 576L512.1 576C547.4 576 576.1 547.3 576.1 512L576.1 320C576.1 284.7 547.4 256 512.1 256L482 256z"
      />
    </svg>
  );
}

export default HomeHeader;
