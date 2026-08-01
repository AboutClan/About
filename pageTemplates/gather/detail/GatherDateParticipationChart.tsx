import { Box, Flex, Text } from "@chakra-ui/react";
import dayjs from "dayjs";

export interface IGatherDateParticipationStat {
  date: string;
  male: number;
  female: number;
}

interface IGatherDateParticipationChart {
  stats: IGatherDateParticipationStat[];
  minRequired?: number;
}

const PLOT_HEIGHT = 96;
const BAR_WIDTH = 24;

function GatherDateParticipationChart({ stats, minRequired = 5 }: IGatherDateParticipationChart) {
  if (!stats.length) return null;

  const maxTotal = Math.max(...stats.map((stat) => stat.male + stat.female), minRequired);
  const thresholdBottom = Math.round((minRequired / maxTotal) * PLOT_HEIGHT);

  return (
    <Box
      mt={6}
      mx={5}
      p={5}
      py={4}
      bg="gray.100"
      border="var(--border-main)"
      borderRadius="8px"
    >
      <Text fontSize="15px" fontWeight="bold" mb={1}>
        날짜별 참여 인원
      </Text>
      <Text fontSize="12px" color="gray.500" mb={4}>
        5명 이상 인원이 모이면 모임 확정 가능성이 높아요
      </Text>

      <Flex align="center" mb={5} fontSize="11px" color="gray.600" gap={4}>
        <Flex align="center" gap="6px">
          <Box w="8px" h="8px" borderRadius="full" bg="blue.500" />
          남성
        </Flex>
        <Flex align="center" gap="6px">
          <Box w="8px" h="8px" borderRadius="full" bg="pink.500" />
          여성
        </Flex>
      </Flex>

      <Box position="relative" h={`${PLOT_HEIGHT}px`} mt="24px" mx="4px">
        <Flex
          position="absolute"
          left={0}
          right={0}
          bottom={0}
          h="100%"
          align="flex-end"
          justify="space-between"
        >
          {stats.map((stat) => {
            const total = stat.male + stat.female;
            const barHeight = Math.round((total / maxTotal) * PLOT_HEIGHT);
            const maleHeight = total ? Math.round((stat.male / total) * barHeight) : 0;
            const femaleHeight = Math.max(barHeight - maleHeight, 0);

            return (
              <Flex
                key={stat.date}
                flexDir="column"
                align="center"
                flex={1}
                h="100%"
                justify="flex-end"
              >
                <Text fontSize="11px" fontWeight="bold" color="gray.700" mb={1} minH="14px">
                  {total || ""}
                </Text>
                <Flex
                  flexDir="column"
                  w={`${BAR_WIDTH}px`}
                  justify="flex-end"
                  h={`${PLOT_HEIGHT}px`}
                >
                  {stat.female > 0 && (
                    <Flex
                      h={`${femaleHeight}px`}
                      bg="pink.500"
                      borderTopRadius="4px"
                      mb={stat.male > 0 ? "2px" : 0}
                      align="center"
                      justify="center"
                    >
                      {femaleHeight >= 14 && (
                        <Text fontSize="10px" fontWeight="bold" color="white" lineHeight="1">
                          {stat.female}
                        </Text>
                      )}
                    </Flex>
                  )}
                  {stat.male > 0 && (
                    <Flex
                      h={`${maleHeight}px`}
                      bg="blue.500"
                      borderTopRadius={stat.female > 0 ? "0" : "4px"}
                      align="center"
                      justify="center"
                    >
                      {maleHeight >= 14 && (
                        <Text fontSize="10px" fontWeight="bold" color="white" lineHeight="1">
                          {stat.male}
                        </Text>
                      )}
                    </Flex>
                  )}
                  {total === 0 && <Box h="2px" bg="gray.200" borderRadius="full" />}
                </Flex>
                <Text fontSize="10px" color="gray.500" mt={2} whiteSpace="nowrap">
                  {dayjs(stat.date).format("M/D(ddd)")}
                </Text>
              </Flex>
            );
          })}
        </Flex>
      </Box>
    </Box>
  );
}

export default GatherDateParticipationChart;
