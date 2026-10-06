import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

import BottomFlexDrawer from "@/components/modals/drawer/BottomFlexDrawer";
import { SectionLabel } from "@/features/study/components/study/apply/ui/StudyApplySection";
import { StudyVoteTimeRullets } from "@/features/study/components/studyVote/StudyVoteTimeRulletDrawer";
import { IStudyVoteTime } from "@/types/models/studyTypes/studyInterActions";
import { dayjsToFormat, parseTimeToDayjs } from "@/utils/dateTimeUtils";

export type StudyTimePreset = "afternoon" | "evening" | "custom";

export const STUDY_TIME_PRESETS: Record<
  Exclude<StudyTimePreset, "custom">,
  { label: string; start: string; end: string }
> = {
  afternoon: { label: "오후", start: "14:00", end: "18:00" },
  evening: { label: "저녁", start: "18:00", end: "22:00" },
};

export const presetToTime = (preset: Exclude<StudyTimePreset, "custom">): IStudyVoteTime => ({
  start: parseTimeToDayjs(STUDY_TIME_PRESETS[preset].start),
  end: parseTimeToDayjs(STUDY_TIME_PRESETS[preset].end),
});

export const formatTimeRange = (time?: IStudyVoteTime) =>
  time ? `${dayjsToFormat(time.start, "HH:mm")}–${dayjsToFormat(time.end, "HH:mm")}` : "-";

interface StudyApplyTimeSectionProps {
  selectedDates: string[];
  preset: StudyTimePreset;
  commonTime: IStudyVoteTime;
  onChangeCommon: (preset: StudyTimePreset, time: IStudyVoteTime) => void;
  /** 날짜별로 다른 시간 모드. 비어 있으면 모든 날짜가 공용 시간을 쓴다. */
  dateTimes: Record<string, IStudyVoteTime>;
  setDateTimes: (next: Record<string, IStudyVoteTime>) => void;
  /** 이미 신청해 둔 날짜의 기존 시간. 이 날짜들은 직접 바꾸지 않는 한 그대로 둔다. */
  existingTimes: Record<string, IStudyVoteTime>;
  applyToExisting: boolean;
  setApplyToExisting: (value: boolean) => void;
  /**
   * 이미 확정된 날짜(오늘 9시 이후). 확정 뒤 시간 변경은 스터디 상세에서 하므로 여기서는 바꾸지 않는다.
   */
  lockedDate?: string | null;
}

/**
 * 신청 화면 안의 "참여 시간" 영역.
 *
 * 예전에는 시간을 다음 단계 시트에서 골랐고, 시트를 열자마자 "점심(14~18)"이 공용 시간으로
 * 들어가 이미 신청해 둔 날짜의 시간까지 사용자 모르게 덮어썼다. 이제 공용 시간은 새로 고른
 * 날짜에만 적용하고, 기존 날짜는 "모든 날짜에 적용"을 눌러야 바뀐다.
 */
function StudyApplyTimeSection({
  selectedDates,
  preset,
  commonTime,
  onChangeCommon,
  dateTimes,
  setDateTimes,
  existingTimes,
  applyToExisting,
  setApplyToExisting,
  lockedDate = null,
}: StudyApplyTimeSectionProps) {
  // 직접 선택 시트가 편집 중인 대상. "common"이면 공용 시간, 날짜면 그 날짜.
  const [editing, setEditing] = useState<"common" | string | null>(null);
  const [draftTime, setDraftTime] = useState<IStudyVoteTime>(commonTime);

  const isSplit = Object.keys(dateTimes).length > 0;
  // 확정된 날짜는 시간 영역에서 다루지 않는다(보이지도, 바뀌지도 않게).
  const editableDates = selectedDates.filter((date) => date !== lockedDate);
  const keptDates = editableDates.filter((date) => existingTimes[date]);

  // 날짜별 모드에서 날짜를 추가·해제하면 목록을 맞춘다. 안 맞추면 새로 고른 날짜가 "-"로 보이고
  // 화면에 없는 공용 시간으로 저장됐다(기존 신청 날짜면 기존 시간까지 덮였다).
  useEffect(() => {
    if (!isSplit) return;
    const keys = Object.keys(dateTimes);
    const isSynced =
      keys.length === editableDates.length && editableDates.every((date) => keys.includes(date));
    if (isSynced) return;
    setDateTimes(
      Object.fromEntries(
        editableDates.map((date) => [
          date,
          dateTimes[date] ?? existingTimes[date] ?? { ...commonTime },
        ]),
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSplit, editableDates.join()]);

  const openEditor = (target: "common" | string) => {
    setDraftTime(target === "common" ? commonTime : (dateTimes[target] ?? commonTime));
    setEditing(target);
  };

  const confirmEditor = () => {
    if (editing === "common") onChangeCommon("custom", draftTime);
    else if (editing) setDateTimes({ ...dateTimes, [editing]: draftTime });
    setEditing(null);
  };

  // 날짜별 모드를 켤 때 출발값: 기존 신청 날짜는 그 시간, 새 날짜는 방금 고른 공용 시간.
  // (예전에는 무엇을 골랐든 전부 14~18시로 초기화됐다.)
  const toggleSplit = () => {
    if (isSplit) {
      setDateTimes({});
      return;
    }
    setDateTimes(
      Object.fromEntries(
        editableDates.map((date) => [date, existingTimes[date] ?? { ...commonTime }]),
      ),
    );
  };

  // 확정된 날짜(오늘)만 남았으면 여기서 바꿀 시간이 없다. 칩을 보여 주면 눌러도 아무 일도 없다.
  if (!editableDates.length) {
    return (
      <Box>
        <SectionLabel step={3}>참여 시간</SectionLabel>
        <Box mt={2} fontSize="12px" color="gray.500">
          오늘 스터디는 확정됐어요. 시간은 스터디 상세에서 바꿀 수 있어요.
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Flex align="baseline" justify="space-between">
        <SectionLabel step={3}>참여 시간</SectionLabel>
        {(editableDates.length > 1 || isSplit) && (
          <Box
            as="button"
            type="button"
            fontSize="12px"
            fontWeight={600}
            color={isSplit ? "mint" : "gray.500"}
            textDecoration="underline"
            onClick={toggleSplit}
          >
            {isSplit ? "모든 날짜 같게" : "날짜별로 다르게"}
          </Box>
        )}
      </Flex>

      {!isSplit ? (
        <>
          <Flex mt={3} gap={2}>
            {(["afternoon", "evening"] as const).map((key) => (
              <TimeChip
                key={key}
                label={STUDY_TIME_PRESETS[key].label}
                time={`${STUDY_TIME_PRESETS[key].start}–${STUDY_TIME_PRESETS[key].end}`}
                isSelected={preset === key}
                onClick={() => onChangeCommon(key, presetToTime(key))}
              />
            ))}
            <TimeChip
              label="직접 선택"
              time={preset === "custom" ? formatTimeRange(commonTime) : "시간 고르기"}
              isSelected={preset === "custom"}
              onClick={() => openEditor("common")}
            />
          </Flex>

          {keptDates.length > 0 && (
            <Flex
              mt={3}
              p={3}
              gap={2}
              align="center"
              justify="space-between"
              bg="gray.50"
              borderRadius="10px"
              fontSize="12px"
              lineHeight="18px"
            >
              <Box color="gray.600">
                {applyToExisting
                  ? "이미 신청한 날짜도 이 시간으로 바뀌어요."
                  : `${keptDates
                      .map((date) => dayjsToFormat(dayjs(date), "M/D(ddd)"))
                      .join(", ")}은 기존 시간(${formatTimeRange(
                      existingTimes[keptDates[0]],
                    )}${keptDates.length > 1 ? " 등" : ""}) 그대로예요.`}
              </Box>
              <Box
                as="button"
                type="button"
                flexShrink={0}
                fontWeight={600}
                color="mint"
                onClick={() => setApplyToExisting(!applyToExisting)}
              >
                {applyToExisting ? "기존 시간 유지" : "모든 날짜에 적용"}
              </Box>
            </Flex>
          )}
        </>
      ) : (
        <Box mt={2}>
          {editableDates.map((date) => (
            <Flex
              as="button"
              type="button"
              key={date}
              w="100%"
              py={3}
              align="center"
              justify="space-between"
              borderBottom="var(--border)"
              onClick={() => openEditor(date)}
            >
              <Box fontSize="14px" fontWeight={600} color="gray.800">
                {dayjsToFormat(dayjs(date), "M월 D일(ddd)")}
              </Box>
              <Box fontSize="13px" color="gray.600">
                {formatTimeRange(dateTimes[date])} ›
              </Box>
            </Flex>
          ))}
        </Box>
      )}

      {editing && (
        <BottomFlexDrawer
          isOverlay
          isHideBottom
          isDrawerUp
          zIndex={5000}
          height={340}
          setIsModal={() => setEditing(null)}
          drawerOptions={{
            header: {
              title:
                editing === "common"
                  ? "참여 시간을 선택해 주세요"
                  : `${dayjsToFormat(dayjs(editing), "M월 D일(ddd)")} 참여 시간`,
              subTitle: "당일 오전 9시까지 변경할 수 있어요.",
            },
            footer: { text: "확인", func: confirmEditor },
          }}
        >
          <StudyVoteTimeRullets defaultVoteTime={draftTime} setVoteTime={setDraftTime} />
        </BottomFlexDrawer>
      )}
    </Box>
  );
}

function TimeChip({
  label,
  time,
  isSelected,
  onClick,
}: {
  label: string;
  time: string;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <Flex
      as="button"
      type="button"
      flex={1}
      direction="column"
      align="center"
      py={2.5}
      borderRadius="10px"
      border="1px solid"
      borderColor={isSelected ? "mint" : "var(--gray-200)"}
      bg={isSelected ? "mint.50" : "white"}
      onClick={onClick}
    >
      <Box fontSize="13px" fontWeight={700} color={isSelected ? "mint" : "gray.800"}>
        {label}
      </Box>
      <Box mt={0.5} fontSize="11px" color={isSelected ? "mint" : "gray.500"}>
        {time}
      </Box>
    </Flex>
  );
}

export default StudyApplyTimeSection;
