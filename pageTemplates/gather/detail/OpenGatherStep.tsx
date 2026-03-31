import { Badge, Box, Flex, Text, VStack } from "@chakra-ui/react";

type StepItem = {
  step: number;
  title: string;
  description?: string;
  date?: string;
};

const steps: StepItem[] = [
  {
    step: 1,
    title: "모임에 관심 있는 멤버들의 신청을 먼저 받아요",
    description: "이 단계에서는 신청자 정보가 공개되지 않아요",
  },
  {
    step: 2,
    title: "함께하고 싶은 멤버를 직접 선택해요",
    description: "신청한 멤버들의 프로필을 확인할 수 있어요",
    date: "3월 31일(화)",
  },
  {
    step: 3,
    title: "선택을 바탕으로 최종 멤버가 확정돼요",
    description: "선택 멤버, 나이, 성별, 인원 등을 고려해요",
    date: "4월 1일(수)",
  },
  {
    step: 4,
    title: "톡방이 개설되고, 함께 모임을 진행해요!",
    description: "시간, 장소, 콘텐츠는 운영진이 함께 조율해요",
  },
];

function StepCircle({ step }: { step: number }) {
  return (
    <Flex
      w="20px"
      h="20px"
      borderRadius="full"
      bg="gray.500"
      color="white"
      fontSize="10px"
      fontWeight="600"
      align="center"
      justify="center"
      lineHeight="1"
    >
      {step}
    </Flex>
  );
}

function StepConnector({ isBig }: { isBig?: boolean }) {
  return <Box w="2px" my={1} minH={isBig ? "32px" : "20px"} bg="gray.200" borderRadius="full" />;
}

function StepRow({ item, isLast }: { item: StepItem; isLast: boolean }) {
  return (
    <Flex align="flex-start" w="full">
      <Flex flexDir="column" mr={3} flexShrink={0} w="full">
        <Flex>
          <StepCircle step={item.step} />
          <Text ml={2} color="gray.600" fontWeight={600} fontSize="13px" lineHeight="20px">
            {item.title}
          </Text>
          <Flex align="center" ml={2} wrap="wrap">
            {item.date && (
              <Badge
                h="20px"
                variant="subtle"
                px={2}
                py={1}
                lineHeight="12px"
                fontWeight="semibold"
                fontSize="9px"
                borderRadius="10px"
                colorScheme="mint"
              >
                {item.date}
              </Badge>
            )}
          </Flex>
        </Flex>
        <Flex align="flex-start">
          <Box ml={!isLast ? "9px" : "11px"}>{!isLast && <StepConnector isBig={true} />}</Box>
          <Box flex={1}>
            {item.description && (
              <Text color="gray.500" fontSize="12px" mt={1} ml={4}>
                {item.description}
              </Text>
            )}
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default function ProcessGuide() {
  return (
    <Box bg="gray.100" border="var(--border-main)" borderRadius="8px" p={5} py={4} mx={5} mt={5}>
      <Text color="gray.800" fontSize="16px" fontWeight="600" mb={4}>
        오픈 번개는 이렇게 진행돼요!
      </Text>
      <VStack spacing={0} align="stretch">
        {steps.map((item, index) => (
          <StepRow key={item.step} item={item} isLast={index === steps.length - 1} />
        ))}
      </VStack>
    </Box>
  );
}
