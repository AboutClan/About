import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useSetRecoilState } from "recoil";

import UserBadge from "../../../components/atoms/badges/UserBadge";
import { CheckCircleBigIcon } from "../../../components/Icons/CircleIcons";
import { DAILY_CHECK_POP_UP } from "../../../constants/keys/localStorage";
import { useToast, useTypeToast } from "../../../hooks/custom/CustomToast";
import { usePointSystemMutation } from "../../../hooks/user/mutations";
import { useUserInfoQuery } from "../../../hooks/user/queries";
import { useDailyCheckMutation } from "../../../hooks/user/sub/dailyCheck/mutation";
import { transferShowDailyCheckState } from "../../../recoils/transferRecoils";
import { IModal } from "../../../types/components/modalTypes";
import { dayjsToStr } from "../../../utils/dateTimeUtils";
import { getRandomIdx } from "../../../utils/mathUtils";
import { IFooterOptions, ModalLayout } from "../../Modals";

function DailyCheckModal({ setIsModal }: IModal) {
  const toast = useToast();
  const typeToast = useTypeToast();
  const { data: session } = useSession();
  const isGuest = session?.user.name === "guest";

  const [isFirstPage, setIsFirstPage] = useState(true);
  const [randomValue, setRandomValue] = useState<number>();
  const [randomNum] = useState(() => getRandomIdx(DAILY_FORTUNES.length - 1));

  const setShowDailyCheck = useSetRecoilState(transferShowDailyCheckState);

  const { mutate } = usePointSystemMutation("point");

  const { data: userInfo } = useUserInfoQuery();
  const { mutate: setDailyCheck } = useDailyCheckMutation({
    onSuccess() {
      const max = Math.ceil(10 + userInfo?.score / 10);
      const value = Math.floor(Math.random() * max) + 1;
      setRandomValue(value);
      mutate({ value, message: "일일 출석체크 행운의 복권" });
      setIsFirstPage(false);
    },
    onError() {
      toast("error", "이미 오늘의 출석체크를 완료했습니다.");
      setIsModal(false);
    },
  });

  const onClickCheck = () => {
    if (!isFirstPage) {
      setIsModal(false);
      return;
    }
    localStorage.setItem(DAILY_CHECK_POP_UP, dayjsToStr(dayjs()));
    setShowDailyCheck(false);
    if (isGuest) {
      typeToast("guest");
      return;
    }

    setDailyCheck();
  };

  const footerOptions: IFooterOptions = {
    main: {
      text: isFirstPage ? "출 석" : "확 인",
      func: onClickCheck,
    },
    isFull: true,
  };

  return (
    <>
      <ModalLayout
        title={isFirstPage ? "매일매일 출석체크!" : "오늘의 운세"}
        footerOptions={footerOptions}
        setIsModal={setIsModal}
      >
        <Box>
          {isFirstPage ? (
            <>
              <Flex direction="column" align="center">
                <Flex justify="center" h="60px" align="center">
                  <CheckCircleBigIcon />
                </Flex>
                <Box textAlign="center" my={3}>
                  출석을 통해 오늘의 <b>운세</b>와 <b>행운 복권</b>을 받을 수 있어요. 멤버 등급이
                  높을수록, 복권에서 받을 수 있는 포인트가 높아집니다.
                </Box>
                <Box>
                  <Box
                    fontSize="10px"
                    borderRadius="20px"
                    bgColor="var(--gray-100)"
                    color="var(--gray-600)"
                    p="8px 12px"
                    mt={1}
                  >
                    {userInfo?.name}님의 현재 등급은{" "}
                    <b>
                      <UserBadge badgeIdx={userInfo?.badge?.badgeIdx} />
                    </b>
                    입니다.
                  </Box>
                </Box>
              </Flex>
            </>
          ) : (
            <motion.div variants={fadeInSlow} initial="hidden" animate="visible">
              <Box position="relative">
                <Box mb={5} fontSize="22px" fontWeight="bold" color="mint">
                  + {randomValue || 0 + 27}원
                </Box>
              </Box>
              <Box
                fontSize="13px"
                bg="gray.100"
                borderRadius="8px"
                border="var(--border)"
                borderColor="gray.200"
                lineHeight="24px"
                px={5}
                py={3}
                textAlign="start"
                position="relative"
              >
                {DAILY_FORTUNES[randomNum][0]},
                <br />
                {DAILY_FORTUNES[randomNum][1]}
                {/* <Box position="absolute" top="0px" left="-15px" transform="translate(0,-50%)">
                  <Avatar
                    user={{ avatar: { type: randomAvatarNum, bg: randomBgNum + 100 } }}
                    size="xs1"
                  />
                </Box> */}
              </Box>
            </motion.div>
          )}
        </Box>
      </ModalLayout>
    </>
  );
}

export default DailyCheckModal;

const fadeInSlow = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 1.5, // 더 천천히
      ease: "easeInOut",
    },
  },
};

const DAILY_FORTUNES: string[][] = [
  ["괜히 마음이 뜨지 않는다면", "지금은 멈춰도 되는 순간이에요"],
  ["하고 싶은 말이 떠오르지 않는다면", "그건 생각이 깊다는 증거일지도 몰라요"],
  ["눈에 보이는 게 전부는 아니니까", "지나친 장면에도 의미가 남아있을 수 있어요"],
  ["계획대로 안 풀리는 하루여도", "다른 방향이 틀린 건 아니에요"],
  ["말하지 않았다고 해서", "느끼지 못한 건 아닐 거예요"],
  ["괜히 누군가 떠오른다면", "그만큼 마음에 남아있던 사람이에요"],
  ["조금씩 지치는 느낌이 들면", "무리하고 있다는 신호일 수 있어요"],
  ["가볍게 넘긴 일이 자꾸 떠오른다면", "그만큼 마음이 움직였던 거예요"],
  ["다른 사람과 비교가 될 때면", "이미 충분히 잘하고 있다는 뜻이에요"],
  ["어느 쪽이든 불안하다면", "아직 결정할 때가 아니라는 뜻일 수도 있어요"],
  ["평소보다 말이 적어졌다면", "생각이 많다는 의미일 수도 있어요"],
  ["누군가의 말이 괜히 오래 남는다면", "지금 그 말이 필요했던 거예요"],
  ["같은 길인데 낯설게 느껴진다면", "내가 달라졌다는 증거일지도 몰라요"],
  ["아무 일도 없던 하루가", "의외로 가장 기억에 남을 수 있어요"],
  ["괜찮은 척 하는 게 익숙해졌다면", "조금은 내려놔도 괜찮아요"],
  ["지금은 아무도 신경 쓰지 않더라도", "나중엔 분명 누군가 기억할 거예요"],
  ["오늘 하루가 너무 빨리 지나갔다면", "그만큼 몰입한 시간이 있었던 거예요"],
  ["작은 고민이 자꾸 발목을 잡는다면", "무시하지 말고 잠깐 들여다보세요"],
  ["눈치를 보는 내가 싫을 수도 있지만", "그건 주변을 배려하고 있다는 거예요"],
  ["피하고 싶던 일이 눈앞에 왔다면", "지금이 마주할 타이밍일 수 있어요"],
  ["불안한 건 실패가 두려워서가 아니라", "잘하고 싶은 마음이 크기 때문이에요"],
  ["혼자 있는 시간이 어색하지 않다면", "스스로와 잘 지내고 있는 거예요"],
  ["오늘따라 말이 잘 안 통한다면", "잠깐 거리를 두는 것도 방법이에요"],
  ["의외의 말 한마디가", "내일의 선택을 바꿔놓을 수도 있어요"],
  ["별생각 없이 고른 게", "오히려 가장 잘 어울릴 수도 있어요"],
  ["갑자기 예전 생각이 났다면", "그 시절의 내가 지금을 도와주는 거예요"],
  ["누군가의 무심한 말에 상처받았다면", "그건 네가 예민해서가 아니에요"],
  ["좋아했던 걸 다시 시작하고 싶다면", "지금이 좋은 시기일 수 있어요"],
  ["아무 말 없이 옆에 있어주는 사람이", "진짜 내 편일 수도 있어요"],
  ["실수한 것 같아도", "그걸로 완전히 틀어지진 않을 거예요"],
  ["하루가 괜히 길게 느껴진다면", "생각보다 많은 걸 마주한 거예요"],
  ["하고 싶은 말이 많아질수록", "조금씩 정리가 필요할 수 있어요"],
  ["조용한 순간이 많아졌다면", "내 안에서 무언가 바뀌고 있는 거예요"],
  ["지금 망설이고 있는 그 일", "한 번쯤은 도전해도 괜찮아요"],
  ["오늘따라 내가 이상하게 느껴진다면", "그만큼 어제와는 다른 나일 거예요"],
  ["누군가를 부러워하기 시작했다면", "내가 뭘 원하는지 알게 된 거예요"],
  ["자꾸 핑계를 찾고 있다면", "아직 준비가 안 됐다는 뜻일 수 있어요"],
  ["누군가와 멀어졌다는 느낌이 들면", "서로에게 여유가 없었던 걸지도 몰라요"],
  ["생각보다 피곤한 하루였다면", "그만큼 많이 움직였다는 뜻이에요"],
  ["지금 별일 없어 보여도", "분명히 흐름은 바뀌고 있어요"],
  ["무의식 중에 했던 선택이", "의외로 좋은 방향일 수 있어요"],
  ["마음을 쓰는 게 버겁게 느껴진다면", "지금은 나를 먼저 챙겨야 할 때예요"],
  ["오늘 하루가 그냥 그랬다면", "내일은 다르게 느껴질 거예요"],
  ["감정을 설명하기 어렵다면", "그만큼 복잡한 마음일 수 있어요"],
  ["타인의 시선이 신경 쓰인다면", "그만큼 나도 나를 의식하고 있는 거예요"],
  ["무심코 지나친 말이 자꾸 떠오른다면", "그 안에 중요한 힌트가 있어요"],
  ["아무 일 없는 것 같은 하루에도", "분명히 자라는 무언가가 있어요"],
  ["요즘 내가 나 같지 않다면", "조금 더 자란 나일 수 있어요"],
  ["오늘의 선택이 틀렸다고 느껴져도", "그걸 알게 된 것만으로도 충분해요"],
];
