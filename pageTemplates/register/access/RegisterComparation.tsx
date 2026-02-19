import { Badge, Box, Flex, Heading, Stack, Text } from "@chakra-ui/react";

function UnderlinedLines({ lines, size }: { lines: string[]; size: "md" | "lg" }) {
  return (
    <Stack spacing={2} mt={3}>
      {lines.map((line, idx) => (
        <Box key={idx} pos="relative" mb={0.5}>
          <Text
            fontSize={
              size === "lg" ? "13px" : "13px"
              // size === "lg" && idx === lines.length - 1
              //   ? "14px"
              //   : idx === lines.length - 1 || size === "lg"
              //   ? "13px"
              //   : "13px"
            }
            textAlign="center"
            // borderBottom="2px solid"
            // borderColor="gray.200"
            color={
              size === "lg"
                ? idx === lines.length - 1
                  ? "gray.700"
                  : "gray.700"
                : idx === lines.length - 1
                ? "gray.500"
                : "gray.500"
            }
            lineHeight={size === "lg" ? "20px" : "18px"}
            pb={1.5}
            fontWeight={lines.length - 1 === idx ? "600" : "400"}
          >
            {line}
          </Text>
          <Box position="absolute" bottom="0" left="10%" right="10%" height="1px" bg="gray.200" />
        </Box>
      ))}
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
          어바웃은 한번의 가입으로 <b>20대 모든 순간</b>을 함께해요.
        </Text>
      </Stack>

      <Flex justify="center" align="center" gap={3} mx="auto">
        <Flex
          flexDir="column"
          w="calc((100vw - 52px)*0.45)"
          bg="gray.100"
          border="var(--border)"
          borderRadius="12px"
          px={2}
          py={4}
        >
          <Box fontWeight={600} fontSize="18px" color="gray.800" mb={0.5}>
            일반 동아리
          </Box>

          <UnderlinedLines
            lines={[
              "평균 회비 30,000원",
              "활동 기간 제한",
              "하나의 관심사만 반영",
              "번거로운 가입 절차",
              "동아리 일정에 종속",
              "불편한 참여/관리 구조",
              "관심 주제와 참여 기회가 제한되어, 여러 동아리를 중복 가입해야 함",
            ]}
            size="md"
          />
        </Flex>

        {/* 오른쪽 (강조) */}
        <Flex
          flexDir="column"
          w="calc((100vw - 52px)*0.55)"
          borderRadius="12px"
          px={2}
          py={4}
          border="1px solid"
          borderColor="mint"
          boxShadow="xl"
          bg="rgba(0, 194, 179, 0.05)"
          // transform="translateY(-12px)"
        >
          <Box fontWeight={600} fontSize="20px" color="mint" mb={0.5}>
            어바웃
          </Box>

          <UnderlinedLines
            lines={[
              "최초 가입비 20,000원",
              "20대 전체 기간 동안 활동",
              "100개 이상의 다양한 모임",
              "원터치 소모임 가입",
              "내가 원할 때 참여 가능",
              "앱을 통한 간편한 참여/관리",
              "한번의 가입으로 20대 전체 기간 동안, 내가 원하는 주제를 원하는 때 참여할 수 있음",
            ]}
            size="lg"
          />
        </Flex>
      </Flex>
    </Box>
  );
}
