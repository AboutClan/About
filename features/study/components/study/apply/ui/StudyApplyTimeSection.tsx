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
  /** 이미 신청해 둔 날짜의 기존 시간. 날짜별 모드를 켤 때 출발값으로 쓴다. */
  existingTimes: Record<string, IStudyVoteTime>;
  /**
   * 이미 확정된 날짜(오늘 9시 이후). 확정 뒤 시간 변경은 스터디 상세에서 하므로 여기서는 바꾸지 않는다.
   */
  lockedDate?: string | null;
}

/**
 * 신청 화면 안의 "참여 시간" 영역.
 *
 * 보이는 시간이 곧 제출되는 시간이다. 이미 신청해 둔 사람은 드로어가 기존 시간으로 채워 열어서
 * (StudyApplyDrawer), 손대지 않으면 기존 시간이 그대로 나간다.
 */
function StudyApplyTimeSection({
  selectedDates,
  preset,
  commonTime,
  onChangeCommon,
  dateTimes,
  setDateTimes,
  existingTimes,
  lockedDate = null,
}: StudyApplyTimeSectionProps) {
  // 직접 선택 시트가 편집 중인 대상. "common"이면 공용 시간, 날짜면 그 날짜.
  const [editing, setEditing] = useState<"common" | string | null>(null);
  const [draftTime, setDraftTime] = useState<IStudyVoteTime>(commonTime);

  const isSplit = Object.keys(dateTimes).length > 0;
  // 확정된 날짜는 시간 영역에서 다루지 않는다(보이지도, 바뀌지도 않게).
  const editableDates = selectedDates.filter((date) => date !== lockedDate);

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
          // 제목 + 룰렛 + 확인 버튼이 다 들어가는 높이. 340이면 룰렛이 확인 버튼 위로 겹쳤다(원래 시간 시트와 같은 400).
          height={400}
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
