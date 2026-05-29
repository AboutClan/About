import { Badge, Box, Flex, Heading, Stack, Text } from "@chakra-ui/react";

function UnderlinedLines({ lines, size }: { lines: string[]; size: "md" | "lg" }) {
  const lastIdx = lines.length - 1;

  return (
    <Stack spacing={2} mt={3}>
      {lines.map((line, idx) => {
        const isLast = idx === lastIdx;
        const isSummary = isLast; // 마지막 항목은 긴 요약 문장

        return (
          <Box key={idx} pos="relative" mb={0.5}>
            <Text
              fontSize={isSummary ? "12px" : "13px"}
              textAlign="center"
              color={
                isSummary
                  ? size === "lg"
                    ? "gray.600"
                    : "gray.500"
                  : size === "lg"
                  ? "gray.700"
                  : "gray.500"
              }
              lineHeight={size === "lg" ? "20px" : "18px"}
              pb={isSummary ? 0 : 1.5}
              fontStyle={isSummary ? "italic" : "normal"}
              fontWeight={isSummary ? "600" : "400"}
            >
              {line.includes("<br/>")
                ? line.split("<br/>").map((part, i, arr) => (
                    <span key={i}>
                      {part}
                      {i < arr.length - 1 && <br />}
                    </span>
                  ))
                : line}
            </Text>
            {/* 마지막 항목(요약 문장)에는 구분선 없음 */}
            {!isSummary && (
              <Box
                position="absolute"
                bottom="0"
                left="10%"
                right="10%"
                height="1px"
                bg="gray.200"
              />
            )}
          </Box>
        );
      })}
    </Stack>
  );
}

export default function RegisterComparation() {
  return (
    <Box textAlign="center" mt={5}>
      {/* 상단 영역 */}
      <Stack spacing={2} mb={5}>
        <Badge alignSelf="center" px={3} py={1} borderRadius="md" bg="mint" color="white">
          01
        </Badge>

        <Heading fontSize="2xl">동아리 비교</Heading>
        <Text color="gray.500">
          어바웃은 <b>한번의 가입</b>으로 <b>20대 모든 순간</b>을 함께해요.
        </Text>
      </Stack>

      <Flex justify="center" align="center" gap={3} mx="auto">
        {/* 왼쪽 (일반 동아리) */}
        <Flex
          flexDir="column"
          w="calc((100vw - 52px)*0.45)"
          bg="gray.100"
          border="var(--border)"
          borderRadius="12px"
          px={3}
          py={4}
        >
          <Box fontWeight={600} fontSize="18px" color="gray.800" mb={0.5}>
            일반 동아리
          </Box>
          <Box h="1px" bg="gray.300" mb={0} />

          <UnderlinedLines
            lines={[
              "평균 회비 30,000원+",
              "한 학기 단위 활동",
              "하나의 관심사만 경험",
              "번거로운 가입 과정",
              "동아리 일정에 종속",
              "비효율적인 참여 구조",
              "다양한 경험과 참여 기회가 제한되고, 여러 동아리를 중복 가입해야 해요 🥲",
            ]}
            size="md"
          />
        </Flex>

        {/* 오른쪽 (어바웃 강조) */}
        <Flex
          flexDir="column"
          w="calc((100vw - 52px)*0.55)"
          borderRadius="12px"
          px={3}
          py={4}
          border="1px solid"
          borderColor="mint"
          boxShadow="xl"
          bg="rgba(0, 194, 179, 0.05)"
        >
          <Box fontWeight={600} fontSize="20px" color="mint" mb={0.5}>
            어바웃
          </Box>
          <Box h="1px" bg="rgba(0,194,179,0.3)" mb={0} />

          <UnderlinedLines
            lines={[
              "단 1회, 20,000원",
              "20대 모든 기간 활동",
              "100개 이상의 취미 모임",
              "원터치 소모임 가입",
              "내 일정에 맞춰 모임 참여",
              "앱을 통해 간편한 참여",
              "한 번의 가입으로 20대 모든 순간,<br/> 내가 원하는 모임을 원하는 순간에,<br/> 쉽게 참여할 수 있어요!",
            ]}
            size="lg"
          />
        </Flex>
      </Flex>
    </Box>
  );
}
