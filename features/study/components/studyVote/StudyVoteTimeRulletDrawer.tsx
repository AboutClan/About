import { Box, Button, Flex } from "@chakra-ui/react";
import dayjs, { Dayjs } from "dayjs";
import Image from "next/image";
import { Dispatch, useEffect, useState } from "react";

import BottomFlexDrawer, {
  BottomFlexDrawerOptions,
} from "@/components/modals/drawer/BottomFlexDrawer";
import RulletPickerTwo from "@/components/molecules/picker/RulletPickerTwo";
import { STUDY_VOTE_HOUR_ARR } from "@/constants/serviceConstants/studyConstants/studyTimeConstant";
import { TimeOptionCard } from "@/features/community/screens/TestClock";
import { IModal } from "@/types/components/modalTypes";
import { createTimeArr, dayjsToFormat, parseTimeToDayjs } from "@/utils/dateTimeUtils";

export interface VoteTimeProps {
  start: Dayjs;
  end: Dayjs;
}

interface IStudyVoteTimeRulletDrawer extends IModal {
  defaultVoteTime?: VoteTimeProps;
  setVoteTime: Dispatch<VoteTimeProps>;
  drawerOptions: BottomFlexDrawerOptions;
  zIndex?: number;
  /**
   * 날짜별로 다른 시간을 정할 수 있게 한다. 2개 이상 넘길 때만 토글이 뜬다.
   * 넘기지 않으면 기존과 동일하게 공용 시간 하나만 고른다.
   */
  perDateDates?: string[];
  /** 날짜별 시간. 날짜별 모드를 쓰지 않으면 빈 객체로 둔다. */
  dateTimes?: Record<string, VoteTimeProps>;
  setDateTimes?: Dispatch<Record<string, VoteTimeProps>>;
}

export default function StudyVoteTimeRulletDrawer({
  setVoteTime,
  drawerOptions,
  setIsModal,
  zIndex,
  defaultVoteTime,
  perDateDates,
  dateTimes,
  setDateTimes,
}: IStudyVoteTimeRulletDrawer) {
  const [isFirst, setIsFirst] = useState(true);
  const [selectedPreset, setSelectedPreset] = useState<"lunch" | "dinner" | null>("lunch");

  const canSplitByDate = !!setDateTimes && (perDateDates?.length ?? 0) > 1;
  const isSplitByDate = !!dateTimes && Object.keys(dateTimes).length > 0;

  // 날짜별 모드에서 지금 편집 중인 날짜. null이면 날짜 목록을 보여준다.
  const [editingDate, setEditingDate] = useState<string | null>(null);

  // 공용 시간을 바꾸면 그 값을 받는다. 날짜별 모드에서는 편집 중인 날짜에만 반영한다.
  const applyTime = (time: VoteTimeProps) => {
    if (isSplitByDate && editingDate) {
      setDateTimes({ ...dateTimes, [editingDate]: time });
      return;
    }

    setVoteTime(time);
  };

  useEffect(() => {
    if (selectedPreset === "lunch") {
      applyTime({
        start: parseTimeToDayjs("14:00"),
        end: parseTimeToDayjs("18:00"),
      });
    } else if (selectedPreset === "dinner") {
      applyTime({
        start: parseTimeToDayjs("18:00"),
        end: parseTimeToDayjs("22:00"),
      });
    }
    // editingDate는 일부러 의존성에서 뺀다 — 날짜를 열어보기만 해도 프리셋이 적용돼
    // 그 날짜에 정해 둔 시간이 덮이면 안 된다. 프리셋을 실제로 누를 때만 반영한다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPreset]);

  const getBaseTime = () =>
    defaultVoteTime ?? {
      start: parseTimeToDayjs("14:00"),
      end: parseTimeToDayjs("18:00"),
    };

  const toggleSplitByDate = () => {
    if (isSplitByDate) {
      setDateTimes({});
      setEditingDate(null);
      return;
    }

    // 켤 때는 지금 고른 공용 시간을 모든 날짜의 기본값으로 깔아 둔다.
    const base = getBaseTime();

    setDateTimes(
      Object.fromEntries(perDateDates.map((date) => [date, { ...base }])),
    );
  };

  // 드로어를 닫고 선택 날짜를 바꾼 뒤 다시 열면 dateTimes가 옛 날짜를 들고 있다.
  // 그대로 두면 목록이 dateTimes에 없는 날짜를 렌더하다 터지므로, 새 날짜는 기본값으로
  // 채우고 빠진 날짜는 버려 선택 날짜와 항상 일치시킨다.
  useEffect(() => {
    if (!isSplitByDate) return;

    const keys = Object.keys(dateTimes);
    const dates = perDateDates ?? [];
    const isSynced =
      keys.length === dates.length && dates.every((date) => keys.includes(date));

    if (isSynced) return;

    const base = getBaseTime();

    setDateTimes(
      Object.fromEntries(
        dates.map((date) => [date, dateTimes[date] ?? { ...base }]),
      ),
    );
    setEditingDate(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSplitByDate, perDateDates]);

  // 날짜별 모드에서 편집할 날짜를 아직 고르지 않았으면 날짜 목록만 보여준다.
  if (isSplitByDate && !editingDate) {
    return (
      <BottomFlexDrawer
        isOverlay
        isHideBottom
        isDrawerUp
        zIndex={zIndex || 5000}
        height={400}
        setIsModal={setIsModal}
        drawerOptions={drawerOptions}
      >
        <SplitByDateToggle isOn onClick={toggleSplitByDate} />
        <Box w="full" overflowY="auto">
          {perDateDates.map((date) => (
            <Flex
              as="button"
              type="button"
              key={date}
              w="100%"
              align="center"
              justify="space-between"
              py={3}
              borderBottom="var(--border)"
              onClick={() => setEditingDate(date)}
            >
              <Box fontSize="14px" fontWeight={600} color="gray.800">
                {dayjsToFormat(dayjs(date), "M월 D일(ddd)")}
              </Box>
              <Flex align="center" gap={2}>
                <Box fontSize="13px" fontWeight={500} color="gray.600">
                  {/* 동기화 effect가 한 틱 늦게 돌 수 있어 방어한다. */}
                  {dateTimes[date]
                    ? `${dayjsToFormat(dateTimes[date].start, "HH:mm")} - ${dayjsToFormat(
                        dateTimes[date].end,
                        "HH:mm",
                      )}`
                    : "-"}
                </Box>
                <Box fontSize="13px" color="gray.400">
                  ›
                </Box>
              </Flex>
            </Flex>
          ))}
        </Box>
      </BottomFlexDrawer>
    );
  }

  return (
    <>
      <BottomFlexDrawer
        isOverlay
        isHideBottom
        isDrawerUp
        zIndex={zIndex || 5000}
        height={400}
        setIsModal={setIsModal}
        drawerOptions={
          editingDate
            ? // 날짜 하나를 편집하는 중에는 목록으로 돌아가는 버튼만 둔다.
              {
                ...drawerOptions,
                footer: {
                  text: "완료",
                  func: () => setEditingDate(null),
                },
              }
            : drawerOptions
        }
      >
        {editingDate && (
          <Box w="full" mb={2} fontSize="13px" fontWeight={600} color="gray.700">
            {dayjsToFormat(dayjs(editingDate), "M월 D일(ddd)")} 참여 시간
          </Box>
        )}

        {isFirst ? (
          <>
            <Flex w="full" mb={3}>
              <TimeOptionCard
                title="오후"
                time="14:00 - 18:00"
                iconSrc="/icons/lunch.png"
                isSelected={selectedPreset === "lunch"}
                onClick={() => setSelectedPreset("lunch")}
              />
              <Box w={3} />
              <TimeOptionCard
                title="저녁"
                time="18:00 - 22:00"
                iconSrc="/icons/dinner.png"
                isSelected={selectedPreset === "dinner"}
                onClick={() => setSelectedPreset("dinner")}
              />
            </Flex>
            <Button
              variant="unstyled"
              w="full"
              px={3}
              py={3}
              border="var(--border-main)"
              borderRadius="12px"
              onClick={() => {
                setSelectedPreset(null);
                setIsFirst(false);
              }}
            >
              <Flex>
                <Box mr={2}>
                  <Image src="/icons/selectIcon.png" width={40} height={40} alt="select" />
                </Box>
                <Flex flexDir="column" textAlign="start">
                  <Box fontSize="14px" mb={1} color="gray.800" lineHeight="20px">
                    직접 시간 선택
                  </Box>
                  <Box fontSize="11px" fontWeight={400} color="gray.500" lineHeight="12px">
                    세부 시간을 직접 선택할 수 있습니다.
                  </Box>
                </Flex>
              </Flex>
            </Button>
            {canSplitByDate && !editingDate && (
              <SplitByDateToggle isOn={false} onClick={toggleSplitByDate} />
            )}
          </>
        ) : (
          <>
            <Flex w="full" mb={2}>
              <Button
                variant="unstyled"
                display="flex"
                alignItems="center"
                h="auto"
                fontSize="13px"
                fontWeight={500}
                color="gray.600"
                onClick={() => {
                  // 프리셋으로 돌아가면 기본값(오후)이 다시 적용된다.
                  setSelectedPreset("lunch");
                  setIsFirst(true);
                }}
              >
                ← 추천 시간대로
              </Button>
            </Flex>
            <StudyVoteTimeRullets defaultVoteTime={defaultVoteTime} setVoteTime={applyTime} />
            {canSplitByDate && !editingDate && (
              <SplitByDateToggle isOn={false} onClick={toggleSplitByDate} />
            )}
          </>
        )}
      </BottomFlexDrawer>
    </>
  );
}

/** "날짜별로 다르게" 스위치. 여러 날짜를 한 번에 신청할 때만 노출된다. */
function SplitByDateToggle({ isOn, onClick }: { isOn: boolean; onClick: () => void }) {
  return (
    <Flex
      as="button"
      type="button"
      w="100%"
      mt={3}
      align="center"
      justify="space-between"
      onClick={onClick}
    >
      <Box fontSize="12.5px" fontWeight={500} color="gray.600" textAlign="start">
        날짜별로 다른 시간 설정
      </Box>
      <Box
        fontSize="12px"
        fontWeight={600}
        color={isOn ? "mint" : "gray.500"}
        textDecoration="underline"
      >
        {isOn ? "모든 날짜 같게" : "날짜별로 다르게"}
      </Box>
    </Flex>
  );
}

interface StudyVoteTimeRulletsProps {
  defaultVoteTime: { start: Dayjs; end: Dayjs };
  setVoteTime: Dispatch<{ start: Dayjs; end: Dayjs }>;
}

export function StudyVoteTimeRullets({ defaultVoteTime, setVoteTime }: StudyVoteTimeRulletsProps) {
  const startItemArr = createTimeArr(
    STUDY_VOTE_HOUR_ARR[0],
    STUDY_VOTE_HOUR_ARR[STUDY_VOTE_HOUR_ARR.length - 3],
  );

  const endTimeArr = createTimeArr(
    STUDY_VOTE_HOUR_ARR[2],
    STUDY_VOTE_HOUR_ARR[STUDY_VOTE_HOUR_ARR.length - 1],
  );

  const [rulletIndex, setRulletIndex] = useState<{
    left: number;
    right: number;
  }>({
    left: 8,
    right: 12,
  });

  const dayjsToTimeString = (time: Dayjs): string => {
    const hour = time.hour();
    const minute = time.minute();

    // 30분 단위로 반올림
    const roundedMinutes = Math.round(minute / 30) * 30;
    const adjustedTime = dayjs(time)
      .hour(roundedMinutes === 60 ? hour + 1 : hour)
      .minute(roundedMinutes === 60 ? 0 : roundedMinutes)
      .second(0); // 필요하다면 초도 제거

    return adjustedTime.format("HH:mm");
  };
  // 받은 시간(defaultVoteTime)에서 룰렛을 시작한다. 예전에는 여기서 바로 return해 늘 14–18에서
  // 시작했고, 아래 마운트 effect가 그 값을 setVoteTime으로 올려 기존 시간을 덮었다.
  useEffect(() => {
    if (defaultVoteTime) {
      const startIndex = startItemArr.findIndex((time) => {
        return (
          dayjsToTimeString(parseTimeToDayjs(time)) === dayjsToTimeString(defaultVoteTime.start)
        );
      });
      const endIndex = endTimeArr.findIndex((time) => {
        return dayjsToTimeString(parseTimeToDayjs(time)) === dayjsToTimeString(defaultVoteTime.end);
      });

      if (startIndex !== -1 && endIndex !== -1) {
        const end = startIndex + 4 <= endIndex ? endIndex : startIndex + 4;
        setRulletIndex({
          left: startIndex,
          right: end,
        });
      }
    }
  }, []);

  useEffect(() => {
    let newLeft = rulletIndex.left;
    let newRight = rulletIndex.right;
    let changed = false;

    // 시작 시간 변경 시 종료 시간 최소 4칸 뒤로
    if (newLeft + 4 > newRight) {
      newRight = Math.min(newLeft + 4, endTimeArr.length - 1);
      changed = true;
    }

    // 종료 시간 변경 시 시작 시간보다 앞서지 않게
    if (newRight - 4 < newLeft) {
      newLeft = Math.max(newRight - 4, 0);
      changed = true;
    }

    if (changed) {
      setRulletIndex({ left: newLeft, right: newRight });
    }
  }, [rulletIndex.left, rulletIndex.right]);

  useEffect(() => {
    setVoteTime({
      start: parseTimeToDayjs(startItemArr[rulletIndex.left]),
      end: parseTimeToDayjs(endTimeArr[rulletIndex.right]),
    });
  }, [rulletIndex]);

  return (
    <RulletPickerTwo
      leftRulletArr={startItemArr}
      rightRulletArr={endTimeArr}
      rulletIndex={rulletIndex}
      setRulletIndex={setRulletIndex}
    />
  );
}
