import { Badge, Box, Flex, Text, VStack } from "@chakra-ui/react";

type StepItem = {
  step: number;
  title: string;
  description?: string;
  date?: string;
};

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

export default function StudyStep() {
  const steps: StepItem[] = [
    {
      step: 1,
      title: "원하는 날짜와 장소로 스터디를 신청해요",
      description: "해당 위치를 기준으로 가까운 스터디가 매칭돼요",
      date: "스터디 신청",
    },
    {
      step: 2,
      title: "당일 오전 9시에 스터디가 확정돼요",
      description: "알림이 발송되니, 앱 알림을 켜주세요!",
      date: "결과 발표",
    },
    {
      step: 3,
      title: "스터디 일일 톡방에 입장해요",
      description: "진행 순서를 확인하고, 참여 멤버들과 소통할 수 있어요",
      date: "톡방 입장",
    },
    {
      step: 4,
      title: "스터디 장소에 모여서 카공해요!",
      date: "스터디 출석",
    },
  ];

  return (
    <Box bg="gray.100" border="var(--border-main)" borderRadius="8px" p={5} py={4} mt={4}>
      <VStack spacing={0} align="stretch">
        {steps.map((item, index) => (
          <StepRow key={item.step} item={item} isLast={index === steps.length - 1} />
        ))}
      </VStack>
    </Box>
  );
}
