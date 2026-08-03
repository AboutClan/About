import { Box, Flex, Text } from "@chakra-ui/react";
import { useMemo } from "react";

import { IGather } from "../../../types/models/gatherTypes/gatherTypes";
import { IUser } from "../../../types/models/userTypes/userInfoTypes";
import { birthToAge } from "../../../utils/convertUtils/convertTypes";

interface IGatherOfficialParticipationChart {
  data: IGather;
}

const PLOT_HEIGHT = 88;
const BAR_WIDTH = 14;
const MALE_COLOR = "#007dfb";
const FEMALE_COLOR = "#ff338c";

interface IAgeStat {
  age: number;
  male: number;
  female: number;
}

function computeAgeStats(data: IGather): IAgeStat[] {
  const [minAge, maxAge] = data?.age?.length === 2 ? data.age : [19, 28];
  const buckets: Record<number, { male: number; female: number }> = {};
  for (let age = minAge; age <= maxAge; age++) buckets[age] = { male: 0, female: 0 };

  (data?.participants || []).forEach((par) => {
    const user = par.user as IUser;
    const age = birthToAge(user?.birth);
    if (age == null) return;
    if (!buckets[age]) buckets[age] = { male: 0, female: 0 };
    if (user.gender === "남성") buckets[age].male += 1;
    else if (user.gender === "여성") buckets[age].female += 1;
  });

  return Object.entries(buckets)
    .map(([age, v]) => ({ age: Number(age), male: v.male, female: v.female }))
    .sort((a, b) => a.age - b.age);
}

function computeGenderTotals(data: IGather) {
  let male = 0;
  let female = 0;
  (data?.participants || []).forEach((par) => {
    const user = par.user as IUser;
    if (user?.gender === "남성") male++;
    else if (user?.gender === "여성") female++;
  });
  return { male, female };
}

function GatherOfficialParticipationChart({ data }: IGatherOfficialParticipationChart) {
  const ageStats = useMemo(() => computeAgeStats(data), [data]);
  const { male: totalMale, female: totalFemale } = useMemo(() => computeGenderTotals(data), [data]);
  const total = totalMale + totalFemale;

  if (!total) return null;

  const maxTotal = Math.max(...ageStats.map((stat) => stat.male + stat.female), 1);
  const malePercent = Math.round((totalMale / total) * 100);
  const femalePercent = 100 - malePercent;

  return (
    <Box mt={6} mx={5} p={5} py={4} bg="gray.100" border="var(--border-main)" borderRadius="8px">
      <Text fontSize="15px" fontWeight="bold" mb={1}>
        참여 인원 통계
      </Text>
      <Text fontSize="12px" color="gray.500" mb={4}>
        나이와 성비로 살펴보는 참여 현황이에요
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

      <Flex align="flex-end" gap={5}>
        {/* 나이별 참여 인원 - 세로형 막대 그래프 */}
        <Box flex={1} minW={0}>
          <Box position="relative" h={`${PLOT_HEIGHT}px`} mt="20px">
            <Flex
              position="absolute"
              left={0}
              right={0}
              bottom={0}
              h="100%"
              align="flex-end"
              justify="space-between"
            >
              {ageStats.map((stat) => {
                const total2 = stat.male + stat.female;
                const barHeight = Math.round((total2 / maxTotal) * PLOT_HEIGHT);
                const maleHeight = total2 ? Math.round((stat.male / total2) * barHeight) : 0;
                const femaleHeight = Math.max(barHeight - maleHeight, 0);

                return (
                  <Flex
                    key={stat.age}
                    flexDir="column"
                    align="center"
                    flex={1}
                    h="100%"
                    justify="flex-end"
                  >
                    <Text fontSize="9px" fontWeight="bold" color="gray.700" mb={1} minH="12px">
                      {total2 || ""}
                    </Text>
                    <Flex
                      flexDir="column"
                      w={`${BAR_WIDTH}px`}
                      justify="flex-end"
                      h={`${PLOT_HEIGHT}px`}
                    >
                      {stat.female > 0 && (
                        <Box
                          h={`${femaleHeight}px`}
                          bg="pink.500"
                          borderTopRadius="3px"
                          mb={stat.male > 0 ? "2px" : 0}
                        />
                      )}
                      {stat.male > 0 && (
                        <Box
                          h={`${maleHeight}px`}
                          bg="blue.500"
                          borderTopRadius={stat.female > 0 ? "0" : "3px"}
                        />
                      )}
                      {total2 === 0 && <Box h="2px" bg="gray.300" borderRadius="full" />}
                    </Flex>
                    <Text fontSize="9px" color="gray.500" mt={1.5} whiteSpace="nowrap">
                      {stat.age}세
                    </Text>
                  </Flex>
                );
              })}
            </Flex>
          </Box>
        </Box>

        {/* 성비 - 원형 그래프 */}
        <Flex direction="column" align="center" flexShrink={0} w="92px">
          <Box
            position="relative"
            w="84px"
            h="84px"
            borderRadius="full"
            sx={{
              background: `conic-gradient(${MALE_COLOR} 0 ${malePercent}%, ${FEMALE_COLOR} ${malePercent}% 100%)`,
            }}
          >
            <Flex
              position="absolute"
              inset="10px"
              bg="gray.100"
              borderRadius="full"
              align="center"
              justify="center"
            >
              <Text fontSize="12px" fontWeight="bold" color="gray.800">
                {total}명
              </Text>
            </Flex>
          </Box>
          <Flex mt={3} direction="column" gap={1} fontSize="10px" color="gray.600" w="100%">
            <Flex justify="space-between">
              <Box>남 {malePercent}%</Box>
              <Box fontWeight="bold">{totalMale}명</Box>
            </Flex>
            <Flex justify="space-between">
              <Box>여 {femalePercent}%</Box>
              <Box fontWeight="bold">{totalFemale}명</Box>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}

export default GatherOfficialParticipationChart;
