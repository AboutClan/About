import {
  Box,
  Button,
  Flex,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";

import { CheckCircleBigIcon } from "../../../components/Icons/CircleIcons";
import { DAILY_CHECK_POP_UP } from "../../../constants/keys/localStorage";
import { DAILY_CHECK_WIN_LIST } from "../../../constants/serviceConstants/dailyCheckConstatns";
import { POINT_SYSTEM_PLUS } from "../../../constants/serviceConstants/pointSystemConstants";
import { useToast, useTypeToast } from "../../../hooks/custom/CustomToast";
import { usePointSystemMutation } from "../../../hooks/user/mutations";
import { useAlphabetMutation } from "../../../hooks/user/sub/collection/mutations";
import { useDailyCheckMutation } from "../../../hooks/user/sub/dailyCheck/mutation";
import { useUserRequestMutation } from "../../../hooks/user/sub/request/mutations";
import { getRandomAlphabet } from "../../../libs/userEventLibs/collection";
import {
  transferCollectionState,
  transferDailyCheckWinState,
  transferShowDailyCheckState,
} from "../../../recoils/transferRecoils";
import { IModal } from "../../../types/components/modalTypes";
import { IUserRequest } from "../../../types/models/userTypes/userRequestTypes";
import { dayjsToStr } from "../../../utils/dateTimeUtils";
import { getDistributionArr } from "../../../utils/mathUtils";
import { IFooterOptions, ModalLayout } from "../../Modals";
const DISTRIBUTION_SIZE = 10000;

function DailyCheckModal({ setIsModal }: IModal) {
  const toast = useToast();
  const typeToast = useTypeToast();
  const { data: session } = useSession();
  const isGuest = session?.user.name === "guest";

  const [isDetailModal, setIsDetailModal] = useState(false);

  const setDailyCheckWin = useSetRecoilState(transferDailyCheckWinState);
  const setShowDailyCheck = useSetRecoilState(transferShowDailyCheckState);
  const setAlphabet = useSetRecoilState(transferCollectionState);

  const { mutate: getAlphabet } = useAlphabetMutation("get");
  const { mutate: setDailyCheck } = useDailyCheckMutation({
    onSuccess() {
      handleDailyCheck();
    },
    onError() {
      toast("error", "이미 오늘의 출석체크를 완료했습니다.");
    },
  });

  const { mutate: getScore } = usePointSystemMutation("score");
  const { mutate: sendRequest } = useUserRequestMutation();

  const winDistribution = getDistributionArr(DAILY_CHECK_WIN_LIST, DISTRIBUTION_SIZE);

  const onClickCheck = () => {
    localStorage.setItem(DAILY_CHECK_POP_UP, dayjsToStr(dayjs()));
    setShowDailyCheck(false);
    if (isGuest) {
      typeToast("guest");
      return;
    }
    setDailyCheck();
    setIsModal(false);
  };

  const handleDailyCheck = () => {
    const randomNum = Math.round(Math.random() * 10000);
    const gift = winDistribution[randomNum];
    if (gift !== null) {
      if (gift.item === "알파벳") {
        const alphabet = getRandomAlphabet(20);
        if (alphabet) {
          getAlphabet({ alphabet });
          setAlphabet({ alphabet });
        }
      } else {
        setDailyCheckWin(gift);
      }
      const data: IUserRequest = {
        writer: session?.user.name,
        category: "출석",
        content: gift.item,
      };
      sendRequest(data);
    }
    getScore(POINT_SYSTEM_PLUS.DAILY_ATTEND);
    toast("success", "출석 완료 !");
  };

  const footerOptions: IFooterOptions = {
    main: {
      text: "출 석",
      func: onClickCheck,
    },
    isFull: true,
  };

  return (
    <>
      <ModalLayout title="매일매일 출석체크!" footerOptions={footerOptions} setIsModal={setIsModal}>
        <Flex direction="column" align="center">
          <Flex justify="center" h="60px" mb={2} align="center">
            <CheckCircleBigIcon />
          </Flex>
          <Box textAlign="center">
            매일 출석체크로 <b style={{ color: "var(--color-mint)" }}>2 Score</b>을 얻을 수 있고,
            <br />
            확률적으로 <b style={{ color: "var(--color-mint)" }}>랜덤 이벤트 선물</b>도 받을 수
            있어요 !
          </Box>
          <Box mt={2}>
            <Button
              onClick={() => setIsDetailModal(true)}
              size="sm"
              borderRadius="20px"
              bgColor="var(--gray-100)"
              color="var(--gray-600)"
            >
              상품 목록 및 확률 정보
            </Button>
          </Box>
        </Flex>
      </ModalLayout>
      {isDetailModal && (
        <ModalLayout
          title="출석체크 확률표"
          footerOptions={{ main: { text: "확 인" } }}
          setIsModal={setIsDetailModal}
        >
          <Flex w="100%">
            <Flex flex={1} direction="column" borderRight="var(--border)">
              <Box fontWeight={600} mb={1}>
                당첨 목록
              </Box>
              {DAILY_CHECK_WIN_LIST.map((item, idx) => (
                <span key={idx}>{item.item}</span>
              ))}
            </Flex>
            <Flex flex={1} direction="column">
              <Box fontWeight={600} mb={1}>
                당첨 확률
              </Box>
              {DAILY_CHECK_WIN_LIST.map((item, idx) => (
                <span key={idx}>{item.percent}%</span>
              ))}
            </Flex>
          </Flex>
        </ModalLayout>
      )}
    </>
  );
}

function PresentListPopOver() {
  return (
    <Popover placement="top-start">
      <PopoverTrigger>
        <Button fontSize="11px" size="xs" colorScheme="yellowTheme">
          선물 목록
        </Button>
      </PopoverTrigger>
      <PopoverContent bg="var(--gray-100)">
        <PopoverHeader fontWeight="semibold">
          선물 목록 <SubTitle>(16 종류)</SubTitle>
        </PopoverHeader>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody fontSize="12px">
          {DAILY_CHECK_WIN_LIST.map((item, idx) => (
            <PercentItem key={idx}>
              <span>{item.item}</span>
              <span>({item.percent}%)</span>
              {idx !== DAILY_CHECK_WIN_LIST.length - 1 && ", "}
            </PercentItem>
          ))}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

function PresentPercentPopOver() {
  return (
    <Popover placement="top-start">
      <PopoverTrigger>
        <Button size="xs" fontSize="11px" colorScheme="yellowTheme">
          당첨 확률
        </Button>
      </PopoverTrigger>
      <PopoverContent bg="var(--gray-100)">
        <PopoverHeader fontWeight="semibold">
          당첨 확률<SubTitle>(총 7.06%)</SubTitle>
        </PopoverHeader>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody fontSize="12px">
          {DAILY_CHECK_WIN_LIST.map((item, idx) => (
            <PercentItem key={idx}>
              <span>{item.item}</span>
              <span>({item.percent}%)</span>
              {idx !== DAILY_CHECK_WIN_LIST.length - 1 && ", "}
            </PercentItem>
          ))}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

const SubTitle = styled.span`
  color: var(--gray-600);
  font-weight: 400;
  font-size: 12px;
`;

const PercentItem = styled.span``;

export default DailyCheckModal;
