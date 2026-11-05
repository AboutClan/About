import { Badge, Box, Flex, Text } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useMemo, useState } from "react";

import Divider from "@/components/atoms/Divider";
import {
  buildRegularApplicants,
  countApplicantsByOption,
  formatSlot,
  getVisibleSlots,
  isGroupRegularGather,
} from "@/features/gather/utils/regularGather";
import StudyAddressMap from "@/features/study/screens/StudyAddressMap";
import { IGather, IGatherLocation } from "@/types/models/gatherTypes/gatherTypes";

interface RegularGatherScheduleProps {
  data: IGather;
}

const CIRCLED_NUMBERS = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩"];

/**
 * 상시 행사 상세: 장소·일정 대신 일정과 콘텐츠 라인업을 보여 준다.
 * - 콘텐츠와 연결되지 않은 일정 → "일정" 박스
 * - 콘텐츠 → "라인업" 카드. 콘텐츠 전용 일정(contentKey)은 카드 안에 표시
 * 날짜가 지난 일정은 숨기고, 전용 일정이 모두 지난 콘텐츠도 숨긴다.
 */
function RegularGatherSchedule({ data }: RegularGatherScheduleProps) {
  const [openMapKey, setOpenMapKey] = useState<string | null>(null);

  const allSlots = data.slots ?? [];
  const visibleSlots = getVisibleSlots(allSlots);
  const commonSlots = visibleSlots.filter((slot) => !slot.contentKey);
  const contents = (data.contents ?? []).filter((content) => {
    const hasOwnSlots = allSlots.some((slot) => slot.contentKey === content.key);
    return !hasOwnSlots || visibleSlots.some((slot) => slot.contentKey === content.key);
  });

  // 신청자 목록(가짜 인원 포함)과 같은 기준으로 일정·콘텐츠별 인원을 센다.
  const optionCounts = useMemo(() => countApplicantsByOption(buildRegularApplicants(data)), [data]);

  const toggleMap = (key: string) => setOpenMapKey((prev) => (prev === key ? null : key));

  return (
    <>
      <Box px={5} pb={4}>
        {data.location?.main && (
          <LocationRow
            mapKey="common"
            location={data.location}
            isMapOpen={openMapKey === "common"}
            onToggle={toggleMap}
          />
        )}

        {commonSlots.length > 0 && (
          <Section title="일정" isMulti={commonSlots.length > 1}>
            <Box border="var(--border)" borderRadius="8px" px={4} py={1} bg="white">
              {commonSlots.map((slot, idx) => (
                <Flex
                  key={slot.key}
                  justify="space-between"
                  align="center"
                  py={2}
                  borderTop={idx ? "var(--border)" : "none"}
                >
                  <Text fontSize="13px" fontWeight={600} color="gray.800">
                    {formatSlot(slot)}
                  </Text>
                  <Text fontSize="11px" color="gray.500">
                    신청 {optionCounts[slot.key] ?? 0}명
                  </Text>
                </Flex>
              ))}
            </Box>
          </Section>
        )}

        {contents.length > 0 && (
          <Section title="라인업" isMulti={contents.length > 1}>
            <Flex flexDir="column" gap={2}>
              {contents.map((content, idx) => {
                const ownSlots = visibleSlots.filter((slot) => slot.contentKey === content.key);
                return (
                  <Box
                    key={content.key}
                    border="var(--border)"
                    borderRadius="8px"
                    px={4}
                    py={3}
                    bg="white"
                  >
                    <Flex justify="space-between" align="flex-start" gap={2}>
                      <Text fontSize="14px" fontWeight={700} color="gray.800">
                        {CIRCLED_NUMBERS[idx] ?? `${idx + 1}.`} {content.title}
                      </Text>
                      <Text fontSize="11px" color="gray.500" flexShrink={0} lineHeight="20px">
                        신청 {optionCounts[content.key] ?? 0}명
                      </Text>
                    </Flex>
                    {content.badge && (
                      <Badge mt={1} size="sm" variant="subtle" colorScheme="mint">
                        {content.badge}
                      </Badge>
                    )}
                    {content.description && (
                      <Text mt={1} fontSize="12px" color="gray.600" whiteSpace="pre-wrap">
                        {content.description}
                      </Text>
                    )}
                    {ownSlots.length > 0 && (
                      <Flex mt={2} gap={1} wrap="wrap">
                        {ownSlots.map((slot) => (
                          <Badge
                            key={slot.key}
                            size="md"
                            variant="subtle"
                            colorScheme="gray"
                            color="var(--gray-700)"
                          >
                            {formatSlot(slot)}
                          </Badge>
                        ))}
                      </Flex>
                    )}
                    {content.location?.main && (
                      <LocationRow
                        mapKey={content.key}
                        location={content.location}
                        isMapOpen={openMapKey === content.key}
                        onToggle={toggleMap}
                      />
                    )}
                    {content.url && (
                      <Box
                        as="a"
                        href={content.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        display="inline-block"
                        mt={2}
                        fontSize="12px"
                        fontWeight={600}
                        color="mint"
                      >
                        자세히 보기 ↗
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Flex>
          </Section>
        )}

        {!commonSlots.length && !contents.length && (
          <Text fontSize="13px" color="gray.500">
            {isGroupRegularGather(data)
              ? "일정은 소모임 톡방에서 매주 투표로 정해요."
              : allSlots.length
                ? "모집 중인 일정이 없어요."
                : "일정을 준비 중이에요."}
          </Text>
        )}

        {data.formStats?.updatedAt && (
          <Text mt={2} fontSize="11px" color="gray.400" textAlign="end">
            신청 인원 {dayjs(data.formStats.updatedAt).locale("ko").format("M.D(ddd) HH:mm")} 기준
          </Text>
        )}
      </Box>
      <Divider />
    </>
  );
}

function Section({
  title,
  isMulti,
  children,
}: {
  title: string;
  isMulti: boolean;
  children: React.ReactNode;
}) {
  return (
    <Box mt={3}>
      <Flex align="center" mb={2}>
        <Text fontSize="14px" fontWeight={600} color="gray.800">
          {title}
        </Text>
        {isMulti && (
          <Text ml={1} fontSize="11px" color="gray.500">
            (복수 선택 가능)
          </Text>
        )}
      </Flex>
      {children}
    </Box>
  );
}

function LocationRow({
  mapKey,
  location,
  isMapOpen,
  onToggle,
}: {
  mapKey: string;
  location: IGatherLocation;
  isMapOpen: boolean;
  onToggle: (key: string) => void;
}) {
  const hasMap = !!location.latitude;
  return (
    <Box mt={2}>
      <Flex fontSize="12px" color="gray.500" align="center" wrap="wrap">
        <Box as="span" mr={1}>
          📍
        </Box>
        <Box as="span" fontWeight={600} color="gray.600">
          {location.main}
        </Box>
        {location.sub && (
          <Box as="span" ml={1}>
            {location.sub}
          </Box>
        )}
        {hasMap && (
          <Box as="button" ml={1} textDecoration="underline" onClick={() => onToggle(mapKey)}>
            {isMapOpen ? "지도 닫기" : "지도 보기"}
          </Box>
        )}
      </Flex>
      {isMapOpen && (
        <Box mt={2}>
          <StudyAddressMap
            location={{
              name: location.main,
              address: location.sub,
              latitude: location.latitude,
              longitude: location.longitude,
            }}
          />
        </Box>
      )}
    </Box>
  );
}

export default RegularGatherSchedule;
