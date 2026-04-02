import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  chakra,
  Collapse,
  Container,
  Flex,
  shouldForwardProp,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { isValidMotionProp, motion, useAnimation, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

import Header from "../components/layouts/Header";
import Slide from "../components/layouts/PageSlide";
import InfoModalButton from "../components/modalButtons/InfoModalButton";
import WinnerTextSlider from "../components/molecules/WinnerTextSlider";
import { COLOR_TABLE } from "../constants/colorConstants";
import { usePrizeQuery } from "../constants/prize/queries";
import { useToast } from "../hooks/custom/CustomToast";
import { useUserInfo } from "../hooks/custom/UserHooks";
import { usePrizeMutation } from "../hooks/sub/store/mutation";
import { usePointSystemMutation, useUserRandomTicketMutation } from "../hooks/user/mutations";
import { ModalLayout } from "../modals/Modals";
import { shuffleArray } from "../utils/convertUtils/convertDatas";

const MotionDiv = chakra(motion.div, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || shouldForwardProp(prop),
});
type WheelItem = { label: string; weight: number };

// ✅ 확률(가중치)은 코드에 박기
const ITEMS: WheelItem[] = [
  { label: "100 pt", weight: 400 },
  { label: "200 pt", weight: 100 },
  { label: "500 pt", weight: 20 },
  { label: "1,000 pt", weight: 10 },
  { label: "2,000 pt", weight: 5 },
  { label: "메가커피 상품권", weight: 5 },
  { label: "올리브영 상품권", weight: 2 },
  { label: "배민 상품권", weight: 1 },
];

function weightedPickIndex(items: WheelItem[]) {
  const eligible = items.map((it, idx) => ({ it, idx })).filter((x) => x.it.weight > 0);
  const sum = eligible.reduce((a, x) => a + x.it.weight, 0);
  let r = Math.random() * (sum || 1);
  for (const x of eligible) {
    r -= x.it.weight;
    if (r <= 0) return x.idx;
  }

  return eligible.length ? eligible[eligible.length - 1].idx : -1;
}

function buildWheelGradient(n: number, colors: string[]) {
  const slice = 360 / n;
  const parts: string[] = [];
  for (let i = 0; i < n; i++) {
    parts.push(`${colors[i % colors.length]} ${i * slice}deg ${(i + 1) * slice}deg`);
  }
  return `conic-gradient(${parts.join(",")})`;
}

function pct(n: number) {
  return `${(Math.round(n * 10) / 10).toFixed(1)}%`;
}

export default function TicketWheelRoulette() {
  // const router = useRouter();
  const toast = useToast();
  const reduceMotion = useReducedMotion();
  const wheelControls = useAnimation();
  const { isOpen: isProbOpen, onToggle: onProbToggle } = useDisclosure();
  const [isWinModal, setIsWinModal] = useState(false);

  const [winText, setWinText] = useState<string>("");
  const userInfo = useUserInfo();

  const [spinning, setSpinning] = useState(false);
  const [ticketCount, setTicketCount] = useState(userInfo?.randomTicket);

  useEffect(() => {
    setTicketCount(userInfo?.randomTicket);
  }, [userInfo]);
  const OFFSET_REF = useRef(0);

  function normalizeDeg(deg: number) {
    return ((deg % 360) + 360) % 360;
  }

  // 포인터(12시)가 가리키는 인덱스를 계산
  function indexUnderPointer(rotationDeg: number, slice: number, n: number, offset: number) {
    // wheel이 rotationDeg만큼 시계 방향으로 돌면,
    // 포인터(12시) 아래에 오는 섹션의 "중앙 각"은 (360 - rotationDeg + offset) 기준으로 잡히는게 직관적
    const a = normalizeDeg(POINTER_DEG - rotationDeg + offset);

    // 섹션 중앙 기준으로 인덱스 계산
    // 0번 섹션 중앙이 slice/2에 위치한다고 가정
    const idx = Math.floor(normalizeDeg(a - slice / 2) / slice);
    return ((idx % n) + n) % n;
  }
  const size = 360;
  const items = ITEMS;
  const n = items.length;
  const slice = 360 / n;

  const ringBorder = useColorModeValue("blackAlpha.200", "whiteAlpha.200");
  const panelBg = useColorModeValue("white", "blackAlpha.300");
  const subtleText = useColorModeValue("blackAlpha.700", "whiteAlpha.700");

  const colors = useMemo(
    () => COLOR_TABLE,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [useColorModeValue],
  );
  const POINTER_DEG = -90;
  const wheelGradient = useMemo(() => buildWheelGradient(n, colors), [n, colors]);

  const totalWeight = useMemo(
    () => items.reduce((s, it) => s + Math.max(0, it.weight), 0),
    [items],
  );
  const probs = useMemo(() => {
    const denom = totalWeight || 1;
    return items.map((it) => (it.weight > 0 ? (it.weight / denom) * 100 : 0));
  }, [items, totalWeight]);

  const { mutate: updatePoint } = usePointSystemMutation("point");
  const { mutate: writePrize } = usePrizeMutation({
    onError() {
      toast("error", "오류가 발생했어요! 해당 화면을 캡처핸 뒤, 관리자에게 문의해 주세요!");
    },
  });

  const { mutate: updateUserTicket } = useUserRandomTicketMutation();

  const rotationRef = useRef(0);

  const spin = async () => {
    if (spinning) return;

    if (ticketCount <= 0) {
      toast("warning", "티켓이 부족해요!");
      return;
    }

    const pickedIndex = weightedPickIndex(items);
    if (pickedIndex < 0) return toast("warning", "존재하지 않는 항목");

    setTicketCount((old) => old - 1);
    updateUserTicket({ userId: userInfo._id, number: -1 });

    setSpinning(true);

    const extraTurns = 3 + Math.floor(Math.random() * 3);

    const targetCenter = pickedIndex * slice + slice / 2 + OFFSET_REF.current;

    const current = normalizeDeg(rotationRef.current);
    const desired = normalizeDeg(POINTER_DEG - targetCenter);
    const delta = normalizeDeg(desired - current);

    const nextRotation = rotationRef.current + extraTurns * 360 + delta;

    // 화면에 적용할 값
    const animateTo = reduceMotion ? normalizeDeg(nextRotation) : nextRotation;

    // ✅ ref는 항상 누적(nextRotation) 유지
    rotationRef.current = nextRotation;

    await wheelControls.start({
      rotate: animateTo,
      transition: { duration: reduceMotion ? 0.2 : 3.2, ease: [0.12, 0, 0.18, 1] },
    });
    const rot = normalizeDeg(rotationRef.current);

    const actualIdx = indexUnderPointer(rot, slice, n, OFFSET_REF.current);
    // ✅ 최단 방향 차이로 보정
    const raw = pickedIndex - actualIdx;
    const wrapped = ((raw % n) + n) % n;
    const signed = wrapped > n / 2 ? wrapped - n : wrapped;

    OFFSET_REF.current = normalizeDeg(OFFSET_REF.current + signed * slice);

    const picked = items[pickedIndex].label;

    if (picked.includes("pt")) {
      const point = picked
        .replace(/,/g, "") // 콤마 제거
        .replace(/\s*pt/i, "") // "pt" 제거 (대소문자 무관)
        .trim();
      updatePoint({ message: "이벤트 룰렛 당첨 상품", value: +point, sub: "event" });
    } else {
      writePrize({ userId: userInfo._id, gift: picked });
    }

    setWinText(picked);
    setIsWinModal(true);

    setSpinning(false);
  };

  const [textArr, setTextArr] = useState<
    {
      name: string;
      gift: string;
    }[]
  >();

  const { data: prizeData } = usePrizeQuery(0, "store");

  useEffect(() => {
    if (!prizeData) return;

    setTextArr(
      shuffleArray(prizeData)
        ?.filter((props) => props.description.split(" "))
        ?.slice(0, 5)
        ?.map((props) => ({
          name: props.winner.name,
          gift: props.gift,
        })),
    );
  }, [prizeData]);

  return (
    <>
      <Header title="랜덤 이벤트 룰렛" url="/home">
        <InfoModalButton type="roullete" />
      </Header>
      <Slide>
        <Container py={0} px={0} minH="100vh" display="flex" flexDir="column" alignItems="center">
          <Flex w="100%" justify="space-between" align="center" borderBottom="var(--border)">
            <Box py={4} mx={2}>
              <Box fontSize="11px">{userInfo?.name}님의 보유 뽑기권</Box>
              <Box fontSize="20px" fontWeight="semibold">
                {ticketCount} 장
              </Box>
            </Box>
            <Button
              colorScheme="mint"
              size="md"
              onClick={() => {
                toast(
                  "info",
                  "받을 수 있는 뽑기권이 없습니다. 어바웃 활동을 통해 티켓을 받을 수 있어요!",
                );
              }}
            >
              뽑기권 받기
            </Button>
          </Flex>
          <Box mb={8} w="full">
            <WinnerTextSlider textArr={textArr} />
          </Box>
          <Center>
            <Box position="relative" w={`${340}px`} h={`${340}px`}>
              {/* Outer ambient glow */}
              <Box
                position="absolute"
                inset="-18px"
                borderRadius="full"
                bgGradient={useColorModeValue(
                  "radial(rgba(0,0,0,0.10) 0%, rgba(0,0,0,0) 60%)",
                  "radial(rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 60%)",
                )}
                filter="blur(10px)"
                pointerEvents="none"
              />

              {/* Pointer */}
              {/* Pointer */}
              {/* Pointer */}
              <Box
                position="absolute"
                top="8px"
                left="50%"
                transform="translateX(-50%)"
                zIndex={40}
                pointerEvents="none"
              >
                {/* 원형 캡 (위에 위치) */}
                <Box
                  position="absolute"
                  top="-14px"
                  left="50%"
                  transform="translateX(-50%)"
                  w="14px"
                  h="14px"
                  borderRadius="full"
                  bg="black"
                  boxShadow="0 4px 10px rgba(0,0,0,0.25)"
                  zIndex={2}
                />

                {/* 삼각형 (아래 방향 ↓) */}
                <Box
                  w="0"
                  h="0"
                  borderLeft="14px solid transparent"
                  borderRight="14px solid transparent"
                  borderTop="28px solid"
                  borderTopColor="black"
                />
              </Box>

              {/* Double ring frame */}

              {/* Wheel */}
              <MotionDiv
                animate={wheelControls}
                // initial={{ rotate: 0 }}
                // style={{ rotate: 0 }}
                position="absolute"
                inset="1px"
                borderRadius="full"
                overflow="hidden"
                bg={wheelGradient}
              >
                {/* glass highlight */}
                <Box
                  position="absolute"
                  inset="0"
                  bgGradient="linear(to-br, rgba(255,255,255,0.70), rgba(255,255,255,0) 48%)"
                  pointerEvents="none"
                />
                {/* inner vignette */}
                <Box
                  position="absolute"
                  inset="0"
                  bgGradient="radial(rgba(0,0,0,0) 55%, rgba(0,0,0,0.10) 100%)"
                  pointerEvents="none"
                />

                {/* separators */}
                {Array.from({ length: n }).map((_, i) => (
                  <Box
                    key={i}
                    position="absolute"
                    top="50%"
                    left="50%"
                    w="2px"
                    h="52%"
                    transform={`rotate(${i * slice}deg) translateY(-100%)`}
                    transformOrigin="bottom center"
                    bg="white"
                    opacity={0.7}
                  />
                ))}

                <Box>
                  {items.map((it, i) => {
                    const angleDeg = i * slice + slice / 2; // 섹션 중앙 각도
                    const angleRad = (angleDeg * Math.PI) / 180;

                    // ✅ 실제 wheel 반지름 기준으로 계산 (wheel inset 고려)
                    const wheelInset = 1; // MotionDiv inset 값이랑 동일하게!
                    const wheelSize = 340 - wheelInset * 2; // 338
                    const r = wheelSize / 2 - 58; // 169 - 58 = 111

                    const x = Math.cos(angleRad) * r * 1.08;
                    const y = Math.sin(angleRad) * r;

                    return (
                      <Box
                        key={`${it.label}-${i}`}
                        position="absolute"
                        top="50%"
                        left="50%"
                        transform={`translate(${x}px, ${y}px) translate(-50%, -50%)`}
                        transformOrigin="center"
                      >
                        <Box
                          px={2}
                          py={2}
                          borderRadius="full"
                          bg="white"
                          backdropFilter="blur(10px)"
                          boxShadow="0 8px 18px rgba(0,0,0,0.12)"
                          borderWidth="1px"
                          borderColor="gray.800"
                          overflow="hidden"
                          textAlign="center"
                          w="80px"
                        >
                          <Text
                            fontSize="10px"
                            fontWeight="800"
                            letterSpacing="-0.2px"
                            noOfLines={1}
                          >
                            {it.label}
                          </Text>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </MotionDiv>

              {/* Center cap + button */}
              <Center position="absolute" inset="0" zIndex={30}>
                <Box
                  w={`${Math.round(size * 0.36)}px`}
                  h={`${Math.round(size * 0.36)}px`}
                  borderRadius="full"
                  bg={panelBg}
                  borderWidth="1px"
                  borderColor={ringBorder}
                  boxShadow="xl"
                  position="relative"
                >
                  <Box
                    position="absolute"
                    inset="12px"
                    borderRadius="full"
                    bgGradient="radial(white 0%, rgba(255,255,255,0) 70%)"
                    pointerEvents="none"
                  />
                  <Center position="absolute" inset="0">
                    <Button
                      colorScheme="black"
                      onClick={spin}
                      isLoading={spinning}
                      loadingText="뽑는 중..."
                      borderRadius="full"
                      fontWeight="bold"
                      color="white"
                      isDisabled={ticketCount <= 0}
                      _hover={{
                        bgGradient: "linear(to-b, mint.500, mint.600)",
                        boxShadow: "0 10px 24px rgba(0, 180, 150, 0.45)",
                        transform: "translateY(-2px)",
                      }}
                      _active={{
                        bgGradient: "linear(to-b, mint.600, mint.700)",
                        transform: "translateY(0px)",
                        boxShadow: "0 4px 12px rgba(0, 180, 150, 0.35)",
                      }}
                    >
                      룰렛 돌리기
                    </Button>
                  </Center>
                </Box>
              </Center>

              {/* small caption */}
            </Box>
          </Center>

          {/* Toggle: 당첨 확률 확인 */}
          <Button
            onClick={onProbToggle}
            variant="ghost"
            borderRadius="xl"
            rightIcon={isProbOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
            color="gray.500"
            mt={2}
          >
            당첨 확률 확인
          </Button>

          <Collapse in={isProbOpen} animateOpacity>
            <Box
              borderWidth="1px"
              borderColor={ringBorder}
              borderRadius="2xl"
              bg={panelBg}
              boxShadow="md"
              overflow="hidden"
            >
              <Box px={4} py={3} borderBottomWidth="1px" borderColor={ringBorder}>
                <Text fontSize="12px" color={subtleText}>
                  확률은 가중치 합 대비 비율로 계산됩니다.
                </Text>
              </Box>

              <Box p={3}>
                <Table size="sm" variant="simple">
                  <Thead>
                    <Tr>
                      <Th>항목</Th>
                      <Th isNumeric>가중치</Th>
                      <Th isNumeric>확률</Th>
                    </Tr>
                  </Thead>
                  <Tbody color="gray.600">
                    {items.map((it, idx) => (
                      <Tr key={`${it.label}-${idx}`}>
                        <Td fontSize="12px" color="gray.800">
                          {it.label === "올리브영 상품권"
                            ? "올리브영 5,000원"
                            : it.label === "배민 상품권"
                            ? "배달의민족 10,000원"
                            : it.label}
                        </Td>
                        <Td isNumeric fontSize="12px">
                          {it.weight}
                        </Td>
                        <Td fontSize="12px" isNumeric>
                          {pct(probs[idx])}
                        </Td>
                      </Tr>
                    ))}
                    <Tr>
                      <Td fontWeight="800" fontSize="12px">
                        합계
                      </Td>
                      <Td isNumeric fontWeight="800" fontSize="12px">
                        {totalWeight}
                      </Td>
                      <Td isNumeric fontWeight="800" fontSize="12px">
                        100.0%
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              </Box>
            </Box>
          </Collapse>
        </Container>
      </Slide>
      {isWinModal && (
        <ModalLayout
          title="🎉 당첨 🎉"
          setIsModal={setIsWinModal}
          isCloseButton={false}
          footerOptions={{}}
        >
          <Center>
            <Box
              px={5}
              py={4}
              borderRadius="2xl"
              // bg={useColorModeValue("blackAlpha.50", "whiteAlpha.100")}
              // borderWidth="1px"
              // borderColor={useColorModeValue("blackAlpha.100", "whiteAlpha.200")}
              textAlign="center"
              w="100%"
            >
              <Text fontSize="lg" fontWeight="900">
                {winText}
              </Text>
              <Text fontSize="sm" color={subtleText} mt={2}>
                {winText.includes("pt")
                  ? "포인트가 즉시 적립되었어요!"
                  : "상품은 한 달 이내에 별도 연락드려요!"}
              </Text>
            </Box>
          </Center>
        </ModalLayout>
      )}
    </>
  );
}
