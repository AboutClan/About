import dayjs from "dayjs";

import { getApplicantCount } from "@/features/gather/utils/getApplicantCount";
import {
  IGather,
  IGatherParticipants,
  IRegularContent,
  IRegularSlot,
} from "@/types/models/gatherTypes/gatherTypes";

/**
 * 상시 행사(regularGather) 공통 계산.
 * 일정(slots)은 매주 반복(weekday) 또는 특정 날짜(date)이고, 콘텐츠(contents)와 따로 또는 연결돼 있다.
 * 신청은 매주 월요일 00:00에 새 회차로 넘어간다.
 */

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

export const getWeekdayLabel = (weekday: number) => WEEKDAY_LABELS[weekday] ?? "";

/** 이번 주 월요일 00:00 */
export const getRoundStart = () => {
  const today = dayjs().startOf("day");
  return today.subtract((today.day() + 6) % 7, "day");
};

/** 서버 formStats.roundKey와 같은 형식("YYYY-MM-DD", 이번 주 월요일) */
export const getCurrentRoundKey = () => getRoundStart().format("YYYY-MM-DD");

const getSlotDateTime = (slot: IRegularSlot) => dayjs(`${slot.date} ${slot.time}`);

/** 날짜가 정해진 일정 중 이미 지난 것 */
const isPastSlot = (slot: IRegularSlot) => !!slot.date && getSlotDateTime(slot).isBefore(dayjs());

/** 지난 날짜 일정을 빼고, 매주 일정(월요일부터) → 날짜 일정(가까운 순)으로 정렬 */
export const getVisibleSlots = (slots: IRegularSlot[] = []) => {
  const upcoming = slots.filter((slot) => !isPastSlot(slot));
  const weekly = upcoming
    .filter((slot) => !slot.date)
    .sort(
      (a, b) =>
        (((a.weekday ?? 0) + 6) % 7) - (((b.weekday ?? 0) + 6) % 7) || a.time.localeCompare(b.time),
    );
  const dated = upcoming
    .filter((slot) => !!slot.date)
    .sort((a, b) => getSlotDateTime(a).valueOf() - getSlotDateTime(b).valueOf());
  return [...weekly, ...dated];
};

/** "매주 금 19:00" / "11.7(토) 16:00" */
export const formatSlot = (slot: IRegularSlot) =>
  slot.date
    ? `${getSlotDateTime(slot).locale("ko").format("M.D(ddd)")} ${slot.time}`
    : `매주 ${getWeekdayLabel(slot.weekday)} ${slot.time}`;

const isThisRound = (gather: Pick<IGather, "formStats">) =>
  gather.formStats?.roundKey === getCurrentRoundKey();

/** 이번 주 전체 신청 인원(표시용으로 부풀린 값). 지난 주 집계면 0에서 시작한다. */
export const getRegularApplicantCount = (gather: Pick<IGather, "formStats" | "id">) =>
  getApplicantCount(0, isThisRound(gather) ? gather.formStats.total : 0, gather.id);

/**
 * 이번 주 일정·콘텐츠별 신청 인원(표시용으로 부풀린 값).
 * 전체 인원에 더한 보정치(id % 10)를 같은 묶음의 선택지 수로 나눠 붙여, 묶음 합이 전체 표시값을 넘지 않게 한다.
 */
export const getOptionApplicantCount = (
  gather: Pick<IGather, "formStats" | "id">,
  optionKey: string,
  groupSize: number,
) => {
  const real = isThisRound(gather) ? (gather.formStats.byOption?.[optionKey] ?? 0) : 0;
  return real + Math.floor((gather.id % 10) / Math.max(groupSize, 1));
};

/** 내가 이번 주에 앱에서 신청했는지 (waiting.createdAt 기준) */
export const isAppliedThisRound = (gather: Pick<IGather, "waiting">, userId?: string) => {
  if (!userId) return false;
  const roundStart = getRoundStart();
  return gather.waiting.some(
    (who) =>
      who.user?._id === userId && !!who.createdAt && !dayjs(who.createdAt).isBefore(roundStart),
  );
};

/** 이번 주(월요일 00:00 이후)에 앱에서 신청한 대기열 */
export const getThisRoundWaitings = <W extends { createdAt?: string }>(waitings: W[] = []) => {
  const roundStart = getRoundStart();
  return waitings.filter((who) => !!who.createdAt && !dayjs(who.createdAt).isBefore(roundStart));
};

/**
 * 상시 행사 신청자 목록: 기존 참여자(운영용 더미 포함) + 이번 주 앱 신청자.
 * 구글폼으로만 신청한 사람은 프로필이 없어 인원수(formStats)에만 반영된다.
 */
export const getRegularApplicants = (
  gather: Pick<IGather, "participants" | "waiting">,
): IGatherParticipants[] => [
  ...(gather.participants ?? []),
  ...getThisRoundWaitings(gather.waiting).map((who) => ({ user: who.user, phase: who.phase })),
];

/** 매주 일정이 있으면 "매주 금·토·일", 날짜 일정만 있으면 "11.7 ~ 11.15" */
export const summarizeSchedule = (slots: IRegularSlot[] = []) => {
  const visible = getVisibleSlots(slots);
  const weekdays = Array.from(
    new Set(visible.filter((slot) => !slot.date).map((slot) => slot.weekday)),
  );
  if (weekdays.length) return `매주 ${weekdays.map(getWeekdayLabel).join("·")}`;

  const dated = visible.filter((slot) => !!slot.date);
  if (!dated.length) return slots.length ? "모집 종료" : "상시 진행";
  const first = getSlotDateTime(dated[0]).format("M.D");
  const last = getSlotDateTime(dated[dated.length - 1]).format("M.D");
  return first === last ? first : `${first} ~ ${last}`;
};

/** 행사 공통 장소가 있으면 그것, 없으면 콘텐츠 장소를 모아 "A 외 n곳" */
export const summarizeLocation = (commonPlace: string, contents: IRegularContent[] = []) => {
  if (commonPlace) return commonPlace;
  const places = Array.from(
    new Set(contents.map((c) => c.location?.main).filter((main): main is string => !!main)),
  );
  if (!places.length) return "";
  return places.length === 1 ? places[0] : `${places[0]} 외 ${places.length - 1}곳`;
};
