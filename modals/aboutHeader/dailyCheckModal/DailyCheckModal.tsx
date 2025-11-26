import { Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

import { AboutIcon } from "../../../components/atoms/AboutIcons";
import { StarIcon } from "../../../components/Icons/StarIcons";
import InfoBoxCol from "../../../components/molecules/InfoBoxCol";
import { DAILY_CHECK_POP_UP } from "../../../constants/keys/localStorage";
import { useToast, useTypeToast } from "../../../hooks/custom/CustomToast";
import { useHasMemership, useUserInfo } from "../../../hooks/custom/UserHooks";
import { usePointSystemMutation } from "../../../hooks/user/mutations";
import { useCollectionAlphabetQuery } from "../../../hooks/user/sub/collection/queries";
import { useDailyCheckMutation } from "../../../hooks/user/sub/dailyCheck/mutation";
import { IModal } from "../../../types/components/modalTypes";
import { dayjsToStr } from "../../../utils/dateTimeUtils";
import { IFooterOptions, ModalLayout } from "../../Modals";

function DailyCheckModal({ setIsModal }: IModal) {
  const toast = useToast();
  const typeToast = useTypeToast();
  const userInfo = useUserInfo();
  const isGuest = userInfo?.role === "guest";

  const [isFirstPage, setIsFirstPage] = useState(true);
  const [stampCnt, setStampCnt] = useState(0);
  const [alphabet, setAlphatbet] = useState(null);
  const [isGuideModal, setIsGuideModal] = useState(false);

  const {
    data: collections,
    isLoading,
    refetch,
  } = useCollectionAlphabetQuery({
    enabled: !isGuest,
    onError() {},
  });
  const { mutate } = usePointSystemMutation("point");

  const hasMembership = useHasMemership("dailyCheck");

  useEffect(() => {
    if (!collections) return;
    setStampCnt(collections.stamps);
  }, [collections]);

  const { mutate: setDailyCheck, isLoading: isLoading2 } = useDailyCheckMutation({
    onSuccess(data) {
      setIsFirstPage(false);
      if (data?.alphabet) {
        setAlphatbet(data.alphabet);
      } else {
        if (hasMembership) {
          const randomPoint = Math.floor(Math.random() * 20) + 10;
          mutate({
            value: randomPoint,
            message: "데일리 출석체크 (멤버십 추가 보상)",
            sub: "dailyCheck",
          });
          toast("success", `출석 완료! 멤버십으로 ${randomPoint}P 더 챙겼어요!`);
        } else {
          toast("success", "출석 완료!");
        }
        setStampCnt(data.stamps);
      }
      refetch();
    },
    onError() {
      toast("error", "이미 오늘의 출석체크를 완료했습니다.");
      // setIsModal(false);
    },
  });

  const dailyCheck = localStorage.getItem(DAILY_CHECK_POP_UP) === dayjsToStr(dayjs());

  const onClickCheck = () => {
    localStorage.setItem(DAILY_CHECK_POP_UP, dayjsToStr(dayjs()));

    if (isGuest) {
      typeToast("guest");
      return;
    }

    setDailyCheck();
  };

  const footerOptions: IFooterOptions = {
    main: {
      text: !isFirstPage ? "확 인" : dailyCheck ? "오늘의 출석 완료" : "출 석",
      func: isFirstPage ? onClickCheck : () => setIsModal(false),
      isLoading: isLoading2,
      isDisabled: isFirstPage && !!dailyCheck,
    },
    isFull: true,
  };

  return (
    <>
      <ModalLayout
        title={isFirstPage ? "출석 체크" : alphabet ? "알파벳 획득!" : "출석 완료!"}
        footerOptions={footerOptions}
        setIsModal={setIsModal}
      >
        <Box minH={isFirstPage ? "140px" : "62px"}>
          {!isLoading &&
            (alphabet ? (
              <Flex justify="center" w="full">
                <AboutIcon alphabet={alphabet} size="lg" isActive />
              </Flex>
            ) : (
              <Box w="100%">
                <Flex w="100%" justify="space-between" px={3}>
                  {new Array(5).fill(0).map((_, idx) => (
                    <Flex
                      justify="center"
                      align="center"
                      key={idx}
                      w={10}
                      h={10}
                      opacity={idx <= stampCnt - 1 ? 1 : 0.2}
                      borderRadius="50%"
                      bg={idx <= stampCnt - 1 ? "var(--color-mint)" : "var(--color-gray)"}
                    >
                      <StarIcon />
                    </Flex>
                  ))}
                </Flex>
                <Box mt={5} lineHeight="20px">
                  <b>스탬프</b>를 다 모으면 <b>알파벳</b> 획득!
                  <br />
                  알파벳은 다양한 상품으로 교환할 수 있어요!
                </Box>
                <Button
                  mt={3}
                  px={3}
                  h="28px"
                  py={2}
                  fontWeight={600}
                  fontSize="10px"
                  borderRadius="20px"
                  border="var(--border)"
                  bg="gray.100"
                  color="gray.600"
                  onClick={() => setIsGuideModal(true)}
                >
                  알파벳 교환 상품 목록
                </Button>
              </Box>
            ))}
        </Box>
      </ModalLayout>
      {isGuideModal && <AlphabetChangeGuideModal setIsModal={setIsGuideModal} />}
    </>
  );
}

export default DailyCheckModal;

export function AlphabetChangeGuideModal({ setIsModal }: IModal) {
  return (
    <ModalLayout
      title="상품 교환 보상"
      footerOptions={{
        main: {
          func: () => setIsModal(false),
        },
      }}
      setIsModal={null}
      isCloseButton={false}
    >
      <InfoBoxCol
        infoBoxPropsArr={[
          { category: "1회차 상품 교환", text: "2,000 Point" },
          { category: "2회차 상품 교환", text: "커피 기프티콘" },
          { category: "3회차 상품 교환", text: "3,000 Point" },
          { category: "4회차 상품 교환", text: "올리브영 5,000원권" },
          { category: "5회차 상품 교환", text: "배달의 민족 10,000원권" },
        ]}
      />
    </ModalLayout>
  );
}

// const fadeInSlow = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: {
//       duration: 1.5, // 더 천천히
//       ease: "easeInOut",
//     },
//   },
// };

// const DAILY_FORTUNES: string[][] = [
//   ["괜히 마음이 뜨지 않는다면", "지금은 멈춰도 되는 순간이에요"],
//   ["하고 싶은 말이 떠오르지 않는다면", "그건 생각이 깊다는 증거일지도 몰라요"],
//   ["눈에 보이는 게 전부는 아니니까", "지나친 장면에도 의미가 남아있을 수 있어요"],
//   ["계획대로 안 풀리는 하루여도", "다른 방향이 틀린 건 아니에요"],
//   ["말하지 않았다고 해서", "느끼지 못한 건 아닐 거예요"],
//   ["괜히 누군가 떠오른다면", "그만큼 마음에 남아있던 사람이에요"],
//   ["조금씩 지치는 느낌이 들면", "무리하고 있다는 신호일 수 있어요"],
//   ["가볍게 넘긴 일이 자꾸 떠오른다면", "그만큼 마음이 움직였던 거예요"],
//   ["다른 사람과 비교가 될 때면", "이미 충분히 잘하고 있다는 뜻이에요"],
//   ["어느 쪽이든 불안하다면", "아직 결정할 때가 아니라는 뜻일 수도 있어요"],
//   ["평소보다 말이 적어졌다면", "생각이 많다는 의미일 수도 있어요"],
//   ["누군가의 말이 괜히 오래 남는다면", "지금 그 말이 필요했던 거예요"],
//   ["같은 길인데 낯설게 느껴진다면", "내가 달라졌다는 증거일지도 몰라요"],
//   ["아무 일도 없던 하루가", "의외로 가장 기억에 남을 수 있어요"],
//   ["괜찮은 척 하는 게 익숙해졌다면", "조금은 내려놔도 괜찮아요"],
//   ["지금은 아무도 신경 쓰지 않더라도", "나중엔 분명 누군가 기억할 거예요"],
//   ["오늘 하루가 너무 빨리 지나갔다면", "그만큼 몰입한 시간이 있었던 거예요"],
//   ["작은 고민이 자꾸 발목을 잡는다면", "무시하지 말고 잠깐 들여다보세요"],
//   ["눈치를 보는 내가 싫을 수도 있지만", "그건 주변을 배려하고 있다는 거예요"],
//   ["피하고 싶던 일이 눈앞에 왔다면", "지금이 마주할 타이밍일 수 있어요"],
//   ["불안한 건 실패가 두려워서가 아니라", "잘하고 싶은 마음이 크기 때문이에요"],
//   ["혼자 있는 시간이 어색하지 않다면", "스스로와 잘 지내고 있는 거예요"],
//   ["오늘따라 말이 잘 안 통한다면", "잠깐 거리를 두는 것도 방법이에요"],
//   ["의외의 말 한마디가", "내일의 선택을 바꿔놓을 수도 있어요"],
//   ["별생각 없이 고른 게", "오히려 가장 잘 어울릴 수도 있어요"],
//   ["갑자기 예전 생각이 났다면", "그 시절의 내가 지금을 도와주는 거예요"],
//   ["누군가의 무심한 말에 상처받았다면", "그건 네가 예민해서가 아니에요"],
//   ["좋아했던 걸 다시 시작하고 싶다면", "지금이 좋은 시기일 수 있어요"],
//   ["아무 말 없이 옆에 있어주는 사람이", "진짜 내 편일 수도 있어요"],
//   ["실수한 것 같아도", "그걸로 완전히 틀어지진 않을 거예요"],
//   ["하루가 괜히 길게 느껴진다면", "생각보다 많은 걸 마주한 거예요"],
//   ["하고 싶은 말이 많아질수록", "조금씩 정리가 필요할 수 있어요"],
//   ["조용한 순간이 많아졌다면", "내 안에서 무언가 바뀌고 있는 거예요"],
//   ["지금 망설이고 있는 그 일", "한 번쯤은 도전해도 괜찮아요"],
//   ["오늘따라 내가 이상하게 느껴진다면", "그만큼 어제와는 다른 나일 거예요"],
//   ["누군가를 부러워하기 시작했다면", "내가 뭘 원하는지 알게 된 거예요"],
//   ["자꾸 핑계를 찾고 있다면", "아직 준비가 안 됐다는 뜻일 수 있어요"],
//   ["누군가와 멀어졌다는 느낌이 들면", "서로에게 여유가 없었던 걸지도 몰라요"],
//   ["생각보다 피곤한 하루였다면", "그만큼 많이 움직였다는 뜻이에요"],
//   ["지금 별일 없어 보여도", "분명히 흐름은 바뀌고 있어요"],
//   ["무의식 중에 했던 선택이", "의외로 좋은 방향일 수 있어요"],
//   ["마음을 쓰는 게 버겁게 느껴진다면", "지금은 나를 먼저 챙겨야 할 때예요"],
//   ["오늘 하루가 그냥 그랬다면", "내일은 다르게 느껴질 거예요"],
//   ["감정을 설명하기 어렵다면", "그만큼 복잡한 마음일 수 있어요"],
//   ["타인의 시선이 신경 쓰인다면", "그만큼 나도 나를 의식하고 있는 거예요"],
//   ["무심코 지나친 말이 자꾸 떠오른다면", "그 안에 중요한 힌트가 있어요"],
//   ["아무 일 없는 것 같은 하루에도", "분명히 자라는 무언가가 있어요"],
//   ["요즘 내가 나 같지 않다면", "조금 더 자란 나일 수 있어요"],
//   ["오늘의 선택이 틀렸다고 느껴져도", "그걸 알게 된 것만으로도 충분해요"],
// ];
