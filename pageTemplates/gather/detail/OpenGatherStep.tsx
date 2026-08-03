import { Badge, Box, Flex, Text, VStack } from "@chakra-ui/react";
import dayjs from "dayjs";

import { dayjsToKr } from "../../../utils/dateTimeUtils";

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

interface ProcessGuideProps {
  date: string;
  isOfficialGather?: boolean;
}

export default function ProcessGuide({ date, isOfficialGather }: ProcessGuideProps) {
  const gatherDate = dayjs(date);
  const mondayOfWeek = gatherDate.subtract((gatherDate.day() + 6) % 7, "day");
  const prevFriday = mondayOfWeek.subtract(3, "day");
  const prevSunday = mondayOfWeek.subtract(1, "day");

  const steps: StepItem[] = isOfficialGather
    ? [
        {
          step: 1,
          title: "구글폼으로 먼저 신청을 받아요",
          description: "하단의 신청하기 버튼을 누르면 구글폼으로 연결돼요",
        },
        {
          step: 2,
          title: "나이·성별·후기 등을 고려해 별도 승인 연락을 드려요",
          description: "3일 이내에 연락을 받지 못하면 보류 상태예요!",
        },
        {
          step: 3,
          title: "참여비 입금 후 톡방에 입장해요",
          description: "상세 내용은 승인자에 한해 별도 안내드려요!",
        },
      ]
    : [
        {
          step: 1,
          title: "모임에 관심 있는 멤버들의 신청을 먼저 받아요",
          description: "신청자들의 선택 날짜, 나이, 성별만 공개돼요",
        },
        {
          step: 2,
          title: "날짜·나이·성별을 고려해 조가 추천돼요",
          description: "추천된 조원들의 프로필이 공개돼요",
          date: dayjsToKr(prevFriday),
        },
        {
          step: 3,
          title: "최종 참여를 확정하면, 톡방이 개설돼요",
          description: "조 편성 후 불참은 2,000P가 차감될 수 있어요",
          date: dayjsToKr(prevSunday),
        },
        {
          step: 4,
          title: "멤버들과 함께 모임을 진행해요!",
          description: "시간, 장소, 콘텐츠는 운영진이 함께 조율해요",
        },
      ];

  return (
    <Box bg="gray.100" border="var(--border-main)" borderRadius="8px" p={5} py={4} mx={5} mt={5}>
      <Text color="gray.800" fontSize="16px" fontWeight="600" mb={4}>
        {isOfficialGather ? "정기모임은 이렇게 진행돼요!" : "오픈 번개는 이렇게 진행돼요!"}
      </Text>
      <VStack spacing={0} align="stretch">
        {steps.map((item, index) => (
          <StepRow key={item.step} item={item} isLast={index === steps.length - 1} />
        ))}
      </VStack>
    </Box>
  );
}
