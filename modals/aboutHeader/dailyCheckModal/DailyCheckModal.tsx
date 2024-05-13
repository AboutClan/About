import {
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from "@chakra-ui/react";
import { faCheckCircle } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";

import { Badge } from "../../../components/atoms/badges/Badges";
import { DAILY_CHECK_POP_UP } from "../../../constants/keys/localStorage";
import { DAILY_CHECK_WIN_LIST } from "../../../constants/serviceConstants/dailyCheckConstatns";
import { POINT_SYSTEM_PLUS } from "../../../constants/serviceConstants/pointSystemConstants";
import { DAILY_CHECK_WIN_ITEM } from "../../../constants/settingValue/dailyCheck";
import { useToast, useTypeToast } from "../../../hooks/custom/CustomToast";
import { usePointSystemMutation } from "../../../hooks/user/mutations";
import { useAlphabetMutation } from "../../../hooks/user/sub/collection/mutations";
import { useDailyCheckMutation } from "../../../hooks/user/sub/dailyCheck/mutation";
import { useUserRequestMutation } from "../../../hooks/user/sub/request/mutations";
import { getRandomAlphabet } from "../../../libs/userEventLibs/collection";
import {
  transferAlphabetState,
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

  const setDailyCheckWin = useSetRecoilState(transferDailyCheckWinState);
  const setShowDailyCheck = useSetRecoilState(transferShowDailyCheckState);
  const setAlphabet = useSetRecoilState(transferAlphabetState);

  const { mutate: getAlphabet } = useAlphabetMutation("get");
  const { mutate: setDailyCheck } = useDailyCheckMutation({
    onSuccess() {
      handleDailyCheck();
    },
    onError() {
      toast("error", "이미 오늘의 출석체크를 완료했습니다.");
    },
  });
  const { mutate: getPoint } = usePointSystemMutation("point");
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
          setAlphabet(alphabet);
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
    getPoint(POINT_SYSTEM_PLUS.DAILY_ATTEND);
    toast("success", "출석체크 완료 !");
  };

  const footerOptions: IFooterOptions = {
    main: {
      text: "출석",
      func: onClickCheck,
    },
    isFull: true,
  };

  return (
    <ModalLayout title="매일매일 출석체크!" footerOptions={footerOptions} setIsModal={setIsModal}>
      <PresentMessage>
        매일 출석체크로 <b>5 point</b>를 얻을 수 있고, 운이 좋으면
        <b> 랜덤 이벤트 선물</b>도 받을 수 있어요!
      </PresentMessage>
      <Container>
        <Detail>
          <Badge text="+ 5 POINT" colorScheme="redTheme" />
          <Badge text="+랜덤 선물" colorScheme="redTheme" />
        </Detail>
        <CheckWrapper>
          <FontAwesomeIcon icon={faCheckCircle} color="var(--color-mint)" size="4x" />
        </CheckWrapper>
        <Detail>
          <PresentListPopOver />
          <PresentPercentPopOver />
        </Detail>
      </Container>
    </ModalLayout>
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
          {DAILY_CHECK_WIN_ITEM.map((item, idx) => (
            <span key={idx}>
              {item.item}
              {idx !== DAILY_CHECK_WIN_ITEM.length - 1 && ", "}
            </span>
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
          {DAILY_CHECK_WIN_ITEM.map((item, idx) => (
            <PercentItem key={idx}>
              <span>{item.item}</span>
              <span>({item.percent}%)</span>
              {idx !== DAILY_CHECK_WIN_ITEM.length - 1 && ", "}
            </PercentItem>
          ))}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

const Container = styled.div`
  margin-top: var(--gap-2);
  flex: 1;

  display: flex;
  justify-content: space-between;
  align-items: center;

  > div:first-child {
    padding: var(--gap-1) 0;
  }
`;

const Detail = styled.div`
  height: 70%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  flex: 0.35;
  > * {
    margin-bottom: 4px;
  }
  /* > span {
    width: 65px;
    text-align: end;
    color: var(--gray-2);
    display: block;
    padding: 2px 0;
    font-weight: 600;
    font-size: 11px;
  } */
`;

const SubTitle = styled.span`
  color: var(--gray-700);
  font-weight: 400;
  font-size: 12px;
`;
const PresentMessage = styled.div`
  font-size: 15px;
  margin-bottom: var(--gap-4);
  > b {
    color: var(--color-mint);
  }
`;

const PercentItem = styled.span``;

const CheckWrapper = styled.div``;

export default DailyCheckModal;
