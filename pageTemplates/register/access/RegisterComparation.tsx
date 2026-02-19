import { Badge, Box, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import Image from "next/image";

function UnderlinedLines({ lines, size }: { lines: string[]; size: "md" | "lg" }) {
  return (
    <Stack spacing={2} mt={3}>
      {lines.map((line, idx) => (
        <Box key={idx} pos="relative">
          <Text
            fontSize={
              size === "lg" && idx === lines.length - 1
                ? "14px"
                : idx === lines.length - 1 || size === "lg"
                ? "13px"
                : "12px"
            }
            textAlign="center"
            // borderBottom="2px solid"
            // borderColor="gray.200"
            color={
              size === "lg" && idx === lines.length - 1
                ? "gray.700"
                : idx === lines.length - 1 || size === "lg"
                ? "gray.600"
                : "gray.500"
            }
            lineHeight={
              size === "lg" && idx === lines.length - 1
                ? "20px"
                : idx === lines.length - 1 || size === "lg"
                ? "18px"
                : "16px"
            }
            pb={2}
            fontWeight={lines.length - 1 === idx ? "600" : "400"}
          >
            {line}
          </Text>
          <Box position="absolute" bottom="0" left="15%" right="15%" height="1px" bg="gray.200" />
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
          <Flex justify="center">
            <Box mr={2} w="44px" h="44px" borderRadius="8px" overflow="hidden">
              <Image
                width={44}
                height={44}
                alt="에브리타임"
                src="https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%95%84%EC%9D%B4%EC%BD%98/%EC%97%90%EB%B8%8C%EB%A6%AC%ED%83%80%EC%9E%84.png"
              />
            </Box>
            <Box mr={2} w="44px" h="44px" borderRadius="8px" overflow="hidden">
              <Image
                width={44}
                height={44}
                alt="캠퍼스픽"
                src="https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%95%84%EC%9D%B4%EC%BD%98/%EC%BA%A0%ED%8D%BC%EC%8A%A4%ED%94%BD.png"
              />
            </Box>
          </Flex>
          <Box mt={3} fontWeight={600} fontSize="16px" color="gray.800" mb={0}>
            일반 동아리
          </Box>

          <UnderlinedLines
            lines={[
              "평균 회비 30,000원",
              "활동 기간 존재",
              "한번에 하나의 주제",
              "번거로운 가입 과정",
              "동아리 일정에 종속",
              "수십명의 멤버",
              "관리/운영 기능 없음",
              "내 관심사와 일정을 모두 충족할 수 없고, 여러 동아리를 중복 가입해야 함",
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
          <Box
            mx="auto"
            border="var(--border)"
            w="52px"
            h="52px"
            borderRadius="8px"
            overflow="hidden"
          >
            <Image
              width={52}
              height={52}
              alt="어바웃"
              src="https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%95%84%EC%9D%B4%EC%BD%98/About+%EC%95%84%EC%9D%B4%EC%BD%98.jpg"
            />
          </Box>
          <Box mt={3} fontWeight={600} fontSize="16px" color="gray.800" mb={0}>
            어바웃
          </Box>

          <UnderlinedLines
            lines={[
              "단 1회, 회비 20,000원",
              "20대 모든 기간 동안 활동",
              "100개 이상의 모임",
              "원터치 소모임 가입",
              "내가 원할 때 참여 가능",
              "5,000명 이상의  멤버",
              "앱을 통한 간편한 관리/운영",
              "한번의 가입으로, 20대 동안, 내가 원하는 주제를, 원하는 때에 참여할 수 있음",
            ]}
            size="lg"
          />
        </Flex>
      </Flex>
    </Box>
  );
}
