import { Box, Button, Collapse, Flex, Grid } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";

import { STUDY_RESULT_HOUR } from "../../../../../constants/serviceConstants/studyConstants/studyTimeConstant";
import { useUserInfo } from "../../../../../hooks/custom/UserHooks";
import StudyExpectedMap from "../../../../../pageTemplates/study/StudyExpectedMap";
import { LocationProps } from "../../../../../types/common";
import { StudyParticipationProps } from "../../../../../types/models/studyTypes/study-entity.types";
import { dayjsToFormat, dayjsToStr, getHour } from "../../../../../utils/dateTimeUtils";
import { getDistanceFromLatLonInKm } from "../../../../../utils/mathUtils";
import PageIntro from "../../../../atoms/PageIntro";
import { ShortArrowIcon } from "../../../../Icons/ArrowIcons";
import DatePointButton from "../../../../molecules/DatePointButton";
import RangeSlider from "../../../../molecules/RangeSlider";

interface StudyApplySectionProps {
  canChange: boolean;
  selectedDates: string[];
  beforeMyDates: string[];
  selectDates: (dates: string[]) => void;
  defaultDate: string;
  rangeNum: number;
  changeRangeNum: (n: number) => void;
  voteLocation: LocationProps;
  nearbyParticipations: StudyParticipationProps[];
  pickLocation: (l: LocationProps) => void;
  defaultLocation: LocationProps;
  isLocation?: boolean;
  onClickChangeLocation: () => void;
}

const WEEK_DAYS_KR = ["일", "월", "화", "수", "목", "금", "토"];

// VoteMap.tsx의 circleCenter 반경(2000/3000/4000m, outer = *1.5)과 동일한 값
const RANGE_KM: Record<number, number> = { 1: 2, 2: 3, 3: 4 };
const RANGE_KM_MAX: Record<number, number> = { 1: 3, 2: 4.5, 3: 6 };

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Box fontSize="15px" fontWeight={700} color="gray.800">
      {children}
    </Box>
  );
}

function StudyApplySection({
  canChange,
  selectedDates,
  selectDates,
  beforeMyDates = [],
  defaultDate,
  rangeNum,
  changeRangeNum,
  voteLocation,
  nearbyParticipations,
  pickLocation,
  defaultLocation,
  isLocation,
  onClickChangeLocation,
}: StudyApplySectionProps) {
  const userInfo = useUserInfo();
  const [isRangeOpen, setIsRangeOpen] = useState(false);

  useEffect(() => {
    if (!canChange) {
      const date =
        getHour() < STUDY_RESULT_HOUR ? defaultDate : dayjsToStr(dayjs(defaultDate).add(1, "day"));
      if (!beforeMyDates.includes(date) && date) {
        selectDates([date]);
      }
    } else {
      selectDates([...selectedDates, ...beforeMyDates]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultDate, canChange]);

  useEffect(() => {
    if (defaultLocation) {
      pickLocation(defaultLocation);
      return;
    }

    if (userInfo?.locationDetail) {
      pickLocation(userInfo.locationDetail);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultLocation, userInfo?.locationDetail]);

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
  const startOfThisWeek = today.startOf("week");
  const weekDates = Array.from({ length: 14 }, (_, i) => startOfThisWeek.add(i, "day"));
  const activeUntil = today.add(6, "day");

  const rangeKm = RANGE_KM[rangeNum] ?? RANGE_KM[2];
  const rangeKmMax = rangeNum === 2 ? 15 : rangeNum === 3 ? 20 : 10;

  const nearbyCount = useMemo(() => {
    if (!voteLocation) return 0;
    return nearbyParticipations.filter((p) => {
      if (!p.location?.latitude || !p.location?.longitude) return false;
      const distance = getDistanceFromLatLonInKm(
        voteLocation.latitude,
        voteLocation.longitude,
        p.location.latitude,
        p.location.longitude,
      );
      return distance != null && distance <= rangeKmMax;
    }).length;
  }, [nearbyParticipations, voteLocation, rangeKmMax]);

  const locationName = voteLocation?.name?.split(" ")?.[0] || "설정 위치";
  return (
    <Flex direction="column" gap={5}>
      <Box>
        <PageIntro
          main={{
            first: "희망 날짜 선택",
          }}
          sub="스터디에 참여하고 싶은 날짜를 모두 선택해 주세요"
        />

        <Box position="relative" mt="14px">
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
              {WEEK_DAYS_KR.map((day, idx) => (
                <Box
                  h="20px"
                  key={day}
                  textAlign="center"
                  fontSize="12px"
                  fontWeight={500}
                  color={
                    idx === 0 ? "var(--color-red)" : idx === 6 ? "var(--color-blue)" : "gray.600"
                  }
                >
                  {day}
                </Box>
              ))}
            </Grid>
            <Box h="1px" bg="gray.200" mb={3} />
            <Grid templateColumns="repeat(7, 1fr)" rowGap="10px">
              {weekDates.map((d) => {
                const dateStr = dayjsToStr(d);
                const isMint = !canChange && beforeMyDates?.includes(dateStr);
                const isOutOfRange =
                  d.isAfter(activeUntil, "day") || d.isBefore(today, "day");
                return (
                  <Flex key={dateStr} justify="center">
                    <DatePointButton
                      date={dateStr}
                      func={() => handleClickDate(dateStr)}
                      isSelected={selectedDates.includes(dateStr)}
                      pointType="mint"
                      isDisabled={isMint || isOutOfRange}
                      isMint={isMint}
                      size="md"
                    />
                  </Flex>
                );
              })}
            </Grid>
          </Box>
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
              <SectionLabel>스터디 매칭 범위</SectionLabel>
              <Box fontSize="12px" color="gray.500" mt={0.5}>
                <Box as="b">{locationName}</Box>
                {` 기준 ${rangeKmMax}분 이내 장소로 매칭돼요.`}
              </Box>
            </Box>
            <Box flexShrink={0} ml={3}>
              <ShortArrowIcon dir={isRangeOpen ? "top" : "bottom"} color="gray" />
            </Box>
          </Flex>

          <Flex
            mx={4}
            mb={4}
            p={3}
            bg="mint.50"
            borderRadius="10px"
            align="center"
            justify="space-between"
          >
            <Box fontSize="12.5px" color="gray.600">
              현재 범위 내 스터디 신청 인원
            </Box>
            <Box fontSize="14px" fontWeight={700} color="mint">
              {nearbyCount}명
            </Box>
          </Flex>

          <Collapse in={isRangeOpen} animateOpacity unmountOnExit>
            <Box px={4} pb={4} pt={1} borderTop="1px solid" borderColor="gray.100">
              <Box mt={4}>
                <Flex
                  justify="space-between"
                  align="center"
                  mb={4}
                  p={3}
                  bg="gray.50"
                  borderRadius="10px"
                >
                  <Box fontSize="13px" fontWeight={600} color="gray.700">
                    기준 위치 - {voteLocation?.name?.split(" ")?.[0] || "미설정"}
                  </Box>
                  <Button
                    size="sm"
                    variant="outline"
                    borderRadius="full"
                    fontSize="12px"
                    onClick={onClickChangeLocation}
                  >
                    위치 변경하기
                  </Button>
                </Flex>

                <RangeSlider
                  numberArr={[0, 1, 2, 3]}
                  defaultNums={[0, rangeNum]}
                  isNumber={false}
                  setNums={(num: number[]) => {
                    if (num[1] === 0) return;
                    changeRangeNum(num[1]);
                  }}
                />

                {voteLocation && (
                  <Box mt={4}>
                    <StudyExpectedMap centerLocation={voteLocation} rangeNum={rangeNum} />
                  </Box>
                )}
              </Box>
            </Box>
          </Collapse>
        </Box>
      )}
      <Box h="24px" />
    </Flex>
  );
}

export default StudyApplySection;
