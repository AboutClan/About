import { Box, chakra, Flex, Text } from "@chakra-ui/react";
import { isValidMotionProp, motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";

const MotionDiv = chakra(motion.div, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || prop === "children",
});

const clampDigit = (n: number) => Math.min(9, Math.max(0, n));

function DigitColumn({ digit, delay = 0 }: { digit: number; delay?: number }) {
  const reduceMotion = useReducedMotion();

  // 디자인 고정값
  const digitWidth = 48;
  const digitHeight = 64;
  const fontSize = "48px";
  const extraSpins = 3; // 휘리리릭 정도

  // 0~9를 여러 번 반복 (스핀용)
  const numbers = useMemo(() => {
    const cycles = Math.max(1, extraSpins + 1); // 마지막 1 cycle은 정착용
    const arr: number[] = [];
    for (let c = 0; c < cycles; c++) {
      for (let n = 0; n <= 9; n++) arr.push(n);
    }
    return arr;
  }, []);

  const safeDigit = clampDigit(digit);
  const targetIndex = extraSpins * 10 + safeDigit;
  const targetY = -targetIndex * digitHeight;

  // 시작 위치: 랜덤으로 위쪽 어딘가
  const [startY] = useState(() => {
    const randomIndex = Math.floor(Math.random() * 10);
    return -randomIndex * digitHeight;
  });

  return (
    <Box
      w={`${digitWidth}px`}
      h={`${digitHeight}px`}
      bg="#00c2b3"
      boxShadow="0 10px 24px rgba(0, 194, 179, 0.35), 0 2px 6px rgba(0,0,0,0.08)"
      borderRadius="8px"
      overflow="hidden"
      position="relative"
    >
      <MotionDiv
        initial={{ y: startY }}
        animate={{
          y: reduceMotion ? targetY : targetY,
          transition: reduceMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 140, damping: 18, delay },
        }}
        style={{ willChange: "transform" }}
      >
        {numbers.map((n, idx) => (
          <Flex
            key={`${n}-${idx}`}
            align="center"
            justify="center"
            h={`${digitHeight}px`}
            w={`${digitWidth}px`}
          >
            <Text
              fontSize={fontSize}
              fontWeight="800"
              color="white"
              lineHeight="1"
              userSelect="none"
              transform="translateY(4px)"
            >
              {n}
            </Text>
          </Flex>
        ))}
      </MotionDiv>

      {/* 위/아래 그라데이션(달력/릴 느낌) */}
      <Box
        position="absolute"
        inset="0"
        pointerEvents="none"
        bgGradient="linear(to-b, rgba(255,255,255,0.55), rgba(255,255,255,0) 28%, rgba(255,255,255,0) 72%, rgba(255,255,255,0.55))"
      />
    </Box>
  );
}

export default function RegisterGatherCount() {
  // ✅ 고정 숫자: 1 2 7 (3개)
  const digits = [1, 2, 7];

  return (
    <Flex
      flexDir="column"
      align="center"
      bg="gray.800"
      pt={4}
      pb={5}
      //   w="max-content"
      px={5}
      //   borderRadius="24px"
    >
      <Box color="white" mb={3} fontWeight={600} fontSize="16px">
        최근 한달간 진행된 모임
      </Box>
      <Flex gap="12px" align="center">
        {digits.map((d, i) => (
          <DigitColumn key={`${d}-${i}`} digit={d} delay={i * 0.08} />
        ))}
      </Flex>
    </Flex>
  );
}
