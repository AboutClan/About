import { Badge, Box, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import Image from "next/image";

function UnderlinedLines({ lines }: { lines: string[] }) {
  return (
    <Stack spacing={2} mt={3}>
      {lines.map((line, idx) => (
        <Text
          key={idx}
          fontSize="12px"
          textAlign="center"
          borderBottom="2px solid"
          borderColor="gray.200"
          pb={1}
        >
          {line}
        </Text>
      ))}
    </Stack>
  );
}

export default function SubscriptionSection() {
  return (
    <Box textAlign="center" mx={5}>
      {/* 상단 영역 */}
      <Stack spacing={3} mb={8}>
        <Badge alignSelf="center" px={3} py={1} borderRadius="md" bg="black" color="white">
          01
        </Badge>

        <Heading fontSize="2xl">공동구독 유형</Heading>
        <Text color="gray.500">
          스포티파이 프리미엄은 <b>1인 특가형 공동구독</b>이에요
        </Text>
      </Stack>

      {/* 카드 가로 배치 */}
      <Flex justify="center" align="flex-end" gap={3} mx="auto">
        {/* 왼쪽 (덜 강조) */}
        <Flex
          flexDir="column"
          w="calc((100vw - 52px)*0.45)"
          bg="gray.100"
          borderRadius="2xl"
          px={2}
          py={4}
        >
          <Flex justify="center">
            <Box
              border="var(--border)"
              mr={2}
              w="40px"
              h="40px"
              borderRadius="8px"
              overflow="hidden"
            >
              <Image
                width={40}
                height={40}
                alt="에브리타임"
                src="https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%95%84%EC%9D%B4%EC%BD%98/%EC%97%90%EB%B8%8C%EB%A6%AC%ED%83%80%EC%9E%84.png"
              />
            </Box>
            <Box
              border="var(--border)"
              mr={2}
              w="40px"
              h="40px"
              borderRadius="8px"
              overflow="hidden"
            >
              <Image
                width={40}
                height={40}
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
              "번거로운 가입 과정",
              "활동 기간 존재",
              "한번에 하나의 활동",
              "동아리 일정에 종속",
              "소수의 사람",
              "관리/운영 기능 없음",
              "중복 가입비 발생 + 내가 원하는 활동을 모두 충족 불가능",
            ]}
          />
        </Flex>

        {/* 오른쪽 (강조) */}
        <Flex
          flexDir="column"
          w="calc((100vw - 52px)*0.55)"
          borderRadius="2xl"
          p={8}
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
              "최초 가입비만 20,000원",
              "원터치 소모임 가입",
              "20대 모든 기간 활동 지속",
              "50개 이상의 소모임 주제",
              "내가 원할 때 참여 가능",
              "수천명의 동아리 회원",
              "앱을 통한 간편한 관리/운영",
              "단 한번의 가입으로 20대 모든 순간 내가 원하는 걸 충족할 수 있음",
            ]}
          />
        </Flex>
      </Flex>
    </Box>
  );
}
