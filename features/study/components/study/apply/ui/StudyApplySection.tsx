import { Box, Button, Collapse, Flex, Grid } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useEffect, useMemo, useRef, useState } from "react";

import DatePointButton from "@/components/molecules/DatePointButton";
import RangeSlider from "@/components/molecules/RangeSlider";
import {
  DEFAULT_RANGE_NUM,
  RANGE_LABEL_KM,
  RANGE_TO_EPS,
} from "@/constants/serviceConstants/studyConstants/studyRangeConstant";
import { STUDY_RESULT_HOUR } from "@/constants/serviceConstants/studyConstants/studyTimeConstant";
import { countMatchCandidates } from "@/features/study/lib/matchProgress";
import StudyExpectedMap from "@/features/study/screens/StudyExpectedMap";
import { LocationProps } from "@/types/common";
import { StudyParticipationProps } from "@/types/models/studyTypes/study-entity.types";
import { dayjsToFormat, dayjsToStr, getHour } from "@/utils/dateTimeUtils";

export interface DateParticipationsProps {
  date: string;
  study: StudyParticipationProps[];
}

interface StudyApplySectionProps {
  selectedDates: string[];
  /** 이미 신청해 둔 날짜. undefined면 아직 로딩 중이라는 뜻이라 빈 배열과 구분해야 한다. */
  beforeMyDates: string[] | undefined;
  selectDates: (dates: string[]) => void;
  defaultDate: string;
  rangeNum: number;
  changeRangeNum: (n: number) => void;
  voteLocations: LocationProps[];
  nearbyParticipations: DateParticipationsProps[];
  isLocation?: boolean;
  /** index === voteLocations.length 면 새 기준점 추가다. */
  onEditAnchor: (index: number) => void;
  onRemoveAnchor: (index: number) => void;
  /** 내 userId. 날짜별 근처 인원에서 나를 뺀다. */
  myId?: string;
}

const WEEK_DAYS_KR = ["일", "월", "화", "수", "목", "금", "토"];

export const MAX_ANCHOR_COUNT = 2;

/** 신청 화면 섹션 제목. 날짜·범위·시간 세 섹션이 같은 모양(번호 + 15px 굵게)을 쓴다. */
export function SectionLabel({ step, children }: { step?: number; children: React.ReactNode }) {
  return (
    <Flex align="center" gap={1.5} fontSize="15px" fontWeight={700} color="gray.800">
      {step && (
        <Flex
          w="18px"
          h="18px"
          align="center"
          justify="center"
          borderRadius="50%"
          bg="gray.800"
          color="white"
          fontSize="11px"
          fontWeight={700}
          flexShrink={0}
        >
          {step}
        </Flex>
      )}
      {children}
    </Flex>
  );
}

function StudyApplySection({
  selectedDates,
  selectDates,
  beforeMyDates,
  defaultDate,
  rangeNum,
  changeRangeNum,
  voteLocations,
  nearbyParticipations,
  isLocation,
  onEditAnchor,
  onRemoveAnchor,
  myId,
}: StudyApplySectionProps) {
  // 위치·범위는 한 줄 요약으로 접어 두고, 바꿀 때만 펼친다(화면 하나에 날짜·위치·시간을 담기 위해).
  const [isRangeOpen, setIsRangeOpen] = useState(false);
  const hasInitializedRef = useRef(false);

  // 서버는 제출된 날짜 목록을 "이번 주 최종 상태"로 해석해 목록에 없는 날짜의 신청을 지운다.
  // 그래서 이미 신청한 날짜를 처음부터 선택된 상태로 넣어야 selectedDates가 곧 최종 상태가 된다.
  // beforeMyDates가 도착하기 전에 초기화하면 기존 신청이 빠진 채로 제출되어 삭제되므로,
  // undefined(로딩 중)일 때는 아무것도 하지 않는다.
  useEffect(() => {
    if (hasInitializedRef.current) return;
    if (!beforeMyDates) return;

    const fallbackDate =
      getHour() < STUDY_RESULT_HOUR ? defaultDate : dayjsToStr(dayjs(defaultDate).add(1, "day"));

    if (beforeMyDates.length) {
      selectDates([...beforeMyDates]);
    } else if (fallbackDate) {
      selectDates([fallbackDate]);
    }

    hasInitializedRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beforeMyDates, defaultDate]);

  const handleClickDate = (date: string) => {
    let newDates = [...selectedDates];

    if (newDates.includes(date)) {
      newDates = newDates.filter((d) => d !== date);
    } else {
      newDates.push(date);
    }

    selectDates(newDates);
  };

  const today = dayjs();
  // 선택 가능한 건 오늘부터 7일뿐이라 딱 그만큼만 그린다.
  const weekDates = Array.from({ length: 7 }, (_, i) => today.add(i, "day"));
  // 9시 이후에는 오늘 매칭이 이미 확정됐다. 실수로 해제해 신청이 지워지지 않게 잠근다.
  const isTodayLocked = getHour() >= STUDY_RESULT_HOUR;

  const rangeLabelKm = RANGE_LABEL_KM[rangeNum] ?? RANGE_LABEL_KM[2];

  // 날짜별 근처 신청 인원(나 제외). 예전에는 고른 날짜를 모두 합쳐 셌고 나 자신도 포함했다.
  const nearbyCountByDate = useMemo(() => {
    if (!voteLocations.length) return {} as Record<string, number>;
    const eps = RANGE_TO_EPS[rangeNum] ?? RANGE_TO_EPS[DEFAULT_RANGE_NUM];
    return Object.fromEntries(
      nearbyParticipations.map((participation) => {
        const others = (participation.study ?? []).filter((par) => par.user?._id !== myId);
        const count = countMatchCandidates({ anchors: voteLocations, eps, participations: others });
        return [participation.date, count];
      }),
    ) as Record<string, number>;
  }, [nearbyParticipations, voteLocations, rangeNum, myId]);

  const getShortName = (location: LocationProps) => location?.name?.split(" ")?.[0];

  const headerLocationText = !voteLocations.length
    ? "설정 위치"
    : voteLocations.length === 1
      ? getShortName(voteLocations[0]) || "설정 위치"
      : `${getShortName(voteLocations[0]) || "설정 위치"} 외 ${voteLocations.length - 1}곳`;

  return (
    <Flex direction="column" gap={5}>
      <Box>
        {/* 페이지 제목은 헤더("스터디 신청")가 한다. 섹션 제목은 세 섹션 모두 같은 모양으로. */}
        <SectionLabel step={1}>희망 날짜</SectionLabel>
        <Box mt={0.5} fontSize="12px" color="gray.500">
          참여하고 싶은 날짜를 모두 선택해 주세요
        </Box>

        <Box position="relative" mt="26px">
          <Flex
            position="absolute"
            top="-14px"
            left="0"
            zIndex={1}
            justify="center"
            align="center"
            py={1.5}
            px={2.5}
            borderRadius="full"
            bg="gray.800"
            color="white"
            fontSize="10px"
            fontWeight={600}
          >
            {dayjsToFormat(today, "M월")}
          </Flex>
          <Box p={3} pt={5} bg="gray.50" borderRadius="16px" border="var(--border)">
            <Grid templateColumns="repeat(7, 1fr)" mb={2}>
              {weekDates.map((d) => {
                const dayIdx = d.day();
                return (
                  <Box
                    h="20px"
                    key={dayjsToStr(d)}
                    textAlign="center"
                    fontSize="12px"
                    fontWeight={500}
                    color={
                      dayIdx === 0
                        ? "var(--color-red)"
                        : dayIdx === 6
                          ? "var(--color-blue)"
                          : "gray.600"
                    }
                  >
                    {WEEK_DAYS_KR[dayIdx]}
                  </Box>
                );
              })}
            </Grid>
            <Box h="1px" bg="gray.200" mb={3} />
            <Grid templateColumns="repeat(7, 1fr)" rowGap="10px">
              {weekDates.map((d) => {
                const dateStr = dayjsToStr(d);
                const isLockedToday = isTodayLocked && d.isSame(today, "day");
                const nearbyCount = nearbyCountByDate[dateStr] ?? 0;
                return (
                  <Flex key={dateStr} direction="column" align="center">
                    <DatePointButton
                      date={dateStr}
                      func={() => handleClickDate(dateStr)}
                      isSelected={selectedDates.includes(dateStr)}
                      pointType="mint"
                      isDisabled={isLockedToday}
                      isMint={false}
                      size="md"
                    />
                    {/* 근처 신청 인원. 0명이면 오히려 망설이게 해서 비워 둔다. */}
                    <Box mt={1} h="16px" fontSize="11px" lineHeight="16px" color="mint">
                      {!isLockedToday && nearbyCount > 0 ? `${nearbyCount}명` : ""}
                    </Box>
                  </Flex>
                );
              })}
            </Grid>
          </Box>
        </Box>

        <Box mt={2} fontSize="11.5px" color="gray.500" lineHeight="16px">
          숫자는 근처 신청 인원
        </Box>
      </Box>

      {!isLocation && (
        <Box border="1px solid" borderColor="gray.100" borderRadius="14px" overflow="hidden">
          <Flex
            as="button"
            type="button"
            w="100%"
            justify="space-between"
            align="center"
            p={4}
            onClick={() => setIsRangeOpen((old) => !old)}
          >
            <Box textAlign="start">
              <SectionLabel step={2}>매칭 범위</SectionLabel>
              <Box fontSize="12px" color="gray.500" mt={0.5}>
                <Box as="b">{headerLocationText}</Box>
                {` 기준 ${rangeLabelKm}km 이내 카페로 매칭돼요.`}
              </Box>
            </Box>
            {/* 화살표만으로는 바꿀 수 있다는 게 잘 안 보여 글자로 둔다. */}
            <Box flexShrink={0} ml={3} fontSize="12px" fontWeight={600} color="mint">
              {isRangeOpen ? "접기" : "변경"}
            </Box>
          </Flex>

          <Collapse in={isRangeOpen} animateOpacity unmountOnExit>
            <Box px={4} pb={4} pt={1} borderTop="1px solid" borderColor="gray.100">
              <Box mt={4}>
                <Flex justify="space-between" align="baseline" mb={2}>
                  <Box fontSize="13px" fontWeight={700} color="gray.700">
                    기준 위치
                  </Box>
                  {voteLocations.length > 1 && (
                    <Box fontSize="11px" color="gray.500">
                      둘 중 어디든 가까우면 매칭돼요
                    </Box>
                  )}
                </Flex>

                <Flex direction="column" gap={2} mb={4}>
                  {voteLocations.map((location, index) => (
                    <Flex
                      key={`${location.latitude}-${location.longitude}-${index}`}
                      justify="space-between"
                      align="center"
                      p={3}
                      bg="white"
                      border="1px solid"
                      borderColor="gray.300"
                      borderRadius="10px"
                      gap={2}
                    >
                      <Box fontSize="13px" fontWeight={600} color="gray.700" flex={1} isTruncated>
                        {getShortName(location) || "미설정"}
                      </Box>
                      <Button
                        size="sm"
                        variant="outline"
                        borderRadius="full"
                        fontSize="12px"
                        flexShrink={0}
                        onClick={() => onEditAnchor(index)}
                      >
                        변경
                      </Button>
                      {voteLocations.length > 1 && (
                        <Button
                          size="sm"
                          variant="ghost"
                          borderRadius="full"
                          fontSize="12px"
                          color="gray.500"
                          flexShrink={0}
                          aria-label="기준 위치 삭제"
                          onClick={() => onRemoveAnchor(index)}
                        >
                          삭제
                        </Button>
                      )}
                    </Flex>
                  ))}

                  {voteLocations.length < MAX_ANCHOR_COUNT && (
                    <Flex
                      as="button"
                      type="button"
                      justify="center"
                      align="center"
                      p={3}
                      borderRadius="10px"
                      border="1px dashed"
                      borderColor="gray.400"
                      fontSize="13px"
                      fontWeight={600}
                      color="gray.700"
                      onClick={() => onEditAnchor(voteLocations.length)}
                    >
                      기준 위치 추가
                    </Flex>
                  )}
                </Flex>

                <RangeSlider
                  numberArr={[0, 1, 2, 3]}
                  defaultNums={[0, rangeNum]}
                  isNumber={false}
                  labelArr={[
                    "범위",
                    `${RANGE_LABEL_KM[1]}km`,
                    `${RANGE_LABEL_KM[2]}km`,
                    `${RANGE_LABEL_KM[3]}km`,
                  ]}
                  setNums={(num: number[]) => {
                    if (num[1] === 0) return;
                    changeRangeNum(num[1]);
                  }}
                />

                {!!voteLocations.length && (
                  <Box mt={4}>
                    <StudyExpectedMap centerLocations={voteLocations} rangeNum={rangeNum} />
                  </Box>
                )}
              </Box>
            </Box>
          </Collapse>
        </Box>
      )}
    </Flex>
  );
}

export default StudyApplySection;
