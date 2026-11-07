import dayjs from "dayjs";

import {
  IGather,
  IRegularApplicantUser,
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

/** 그 주 모임을 마감하는 요일(월요일 기준 3일 뒤 = 목요일 00:00) */
const CLOSE_OFFSET_DAYS = 3;

/** 신청할 수 있는 가장 이른 회차의 주 월요일. 목요일부터는 그 주가 마감이라 다음 주다. */
const getOpenWeekStart = () => {
  const roundStart = getRoundStart();
  return dayjs().isBefore(roundStart.add(CLOSE_OFFSET_DAYS, "day"))
    ? roundStart
    : roundStart.add(7, "day");
};

/**
 * 날짜가 정해진 일정 중 이미 지난 것.
 * hideClosedWeek면 마감된 주(목요일부터 그 주)에 속한 것도 지난 것으로 본다.
 */
const isClosedSlot = (slot: IRegularSlot, hideClosedWeek: boolean) =>
  !!slot.date &&
  (getSlotDateTime(slot).isBefore(dayjs()) ||
    (hideClosedWeek && dayjs(slot.date).isBefore(getOpenWeekStart())));

/** 상세 화면 일정 한 줄: 실제 날짜 회차와 마감 여부 */
export interface RegularScheduleRow {
  /** 화면 key (slot.key + 날짜) */
  id: string;
  slot: IRegularSlot;
  /** "11.13(금) 19:00" */
  label: string;
  /** 마감된 주(목요일부터 그 주)이거나 이미 지난 회차 */
  isClosed: boolean;
}

/**
 * 상세 화면에 보여 줄 일정(날짜 순).
 * - 매주 일정: 이번 주 회차, 그 회차가 마감이면 다음 주 회차도
 * - 날짜 일정: 이번 주 이후 것
 * 마감된 회차도 보여 주되 isClosed로 표시한다(취소선).
 */
export const getScheduleRows = (slots: IRegularSlot[] = []): RegularScheduleRow[] => {
  const roundStart = getRoundStart();
  const openWeekStart = getOpenWeekStart();
  const now = dayjs();
  const isClosedAt = (when: dayjs.Dayjs) => when.isBefore(openWeekStart) || when.isBefore(now);
  const toRow = (slot: IRegularSlot, when: dayjs.Dayjs): RegularScheduleRow => ({
    id: `${slot.key}-${when.format("YYYYMMDD")}`,
    slot,
    label: `${when.locale("ko").format("M.D(ddd)")} ${slot.time}`,
    isClosed: isClosedAt(when),
  });

  const rows: { row: RegularScheduleRow; at: number }[] = [];
  slots.forEach((slot) => {
    if (slot.date) {
      const when = getSlotDateTime(slot);
      if (!when.isBefore(roundStart)) rows.push({ row: toRow(slot, when), at: when.valueOf() });
      return;
    }
    const [hour, minute] = slot.time.split(":").map(Number);
    const thisWeek = roundStart
      .add(((slot.weekday ?? 0) + 6) % 7, "day")
      .hour(hour || 0)
      .minute(minute || 0);
    rows.push({ row: toRow(slot, thisWeek), at: thisWeek.valueOf() });
    if (isClosedAt(thisWeek)) {
      const nextWeek = thisWeek.add(7, "day");
      rows.push({ row: toRow(slot, nextWeek), at: nextWeek.valueOf() });
    }
  });
  return rows.sort((a, b) => a.at - b.at).map(({ row }) => row);
};

/**
 * 지난·마감된 날짜 일정을 빼고, 매주 일정(월요일부터) → 날짜 일정(가까운 순)으로 정렬.
 * 관리자 확정 모임 화면은 마감된 주의 일정으로 모임을 만들어야 하므로 hideClosedWeek=false로 부른다.
 */
export const getVisibleSlots = (slots: IRegularSlot[] = [], hideClosedWeek = true) => {
  const upcoming = slots.filter((slot) => !isClosedSlot(slot, hideClosedWeek));
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

/**
 * 소모임형 상시 행사: 구글폼 없이 소모임과 연결된 상시 행사.
 * 신청하기는 소모임 가입으로 연결하고, 일정은 소모임 톡방에서 매주 정한다.
 */
export const isGroupRegularGather = (
  gather?: Pick<IGather, "category" | "googleFormUrl" | "groupId"> | null,
) => gather?.category === "regularGather" && !gather.googleFormUrl && !!gather.groupId;

const isThisRound = (gather: Pick<IGather, "formStats">) =>
  gather.formStats?.roundKey === getCurrentRoundKey();

/**
 * 내 폼 응답이 신청자 명단에 나와 연결됐는지.
 * 서버가 앱 신청 기록(대기열)과 폼 응답을 신청 시각·성별·출생연도로 짝지어 회원을 붙인다(폼 제출 후 몇 초 뒤).
 */
export const isAppliedRegular = (gather: Pick<IGather, "formStats">, uid?: string) =>
  !!uid && isThisRound(gather) && !!gather.formStats.applicants?.some((a) => a.user?.uid === uid);

/** 화면에 보여 줄 신청자 한 명. 가짜 인원(isFake)도 같은 모양이다. */
export interface RegularApplicant {
  id: string;
  gender: "남성" | "여성" | null;
  age: number | null;
  keys: string[];
  submittedAt: string | null;
  isFake: boolean;
  /** 앱에서 신청한 회원이면 그 회원(아바타·닉네임 표시용) */
  user?: IRegularApplicantUser | null;
}

/** 시드가 같으면 늘 같은 난수열 (mulberry32) */
const seededRandom = (seedText: string) => {
  let seed = 2166136261;
  for (let i = 0; i < seedText.length; i++)
    seed = Math.imul(seed ^ seedText.charCodeAt(i), 16777619);
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const pickSome = <T>(items: T[], random: () => number, max = 2) => {
  if (!items.length) return [];
  const count = Math.min(items.length, 1 + Math.floor(random() * max));
  return [...items].sort(() => random() - 0.5).slice(0, count);
};

/**
 * 가짜 인원의 성별 목록.
 * 1) 남성:여성이 2:1을 넘지 않게 여성을 채우고
 * 2) 그래도 minCount명(5 또는 6)보다 적으면, 2:1을 넘지 않는 한 남성부터 채운다(남성이 더 많게).
 *    실제 0명이면 5명 → 남3·여2, 6명 → 남4·여2.
 */
const getFakeGenders = (male: number, female: number, minCount: number) => {
  const genders: ("남성" | "여성")[] = [];
  let [m, f] = [male, female];
  while (m > f * 2) {
    genders.push("여성");
    f++;
  }
  while (m + f < minCount) {
    const next = m + 1 <= f * 2 ? "남성" : "여성";
    genders.push(next);
    if (next === "남성") m++;
    else f++;
  }
  return genders;
};

/** 가짜 인원 나이: 20~29세, 20대 중반이 조금 더 자주 나오게 */
const FAKE_AGE_WEIGHTS: [number, number][] = [
  [20, 8],
  [21, 9],
  [22, 10],
  [23, 11],
  [24, 12],
  [25, 12],
  [26, 11],
  [27, 10],
  [28, 9],
  [29, 8],
];

const pickFakeAge = (random: () => number) => {
  const total = FAKE_AGE_WEIGHTS.reduce((sum, [, weight]) => sum + weight, 0);
  let roll = random() * total;
  for (const [age, weight] of FAKE_AGE_WEIGHTS) {
    roll -= weight;
    if (roll < 0) return age;
  }
  return FAKE_AGE_WEIGHTS[FAKE_AGE_WEIGHTS.length - 1][0];
};

/**
 * 상시 행사 이번 주 신청자 목록(최근 신청 순).
 * 구글폼 신청자(formStats.applicants)에 가짜 인원을 더한다(getFakeGenders 규칙).
 * 가짜 인원은 행사 id·주차·순번으로 시드를 고정해 새로고침해도 같은 사람이 같은 자리에 나온다.
 */
export const buildRegularApplicants = (
  gather: Pick<IGather, "id" | "age" | "formStats" | "slots" | "contents">,
): RegularApplicant[] => {
  const currentYear = dayjs().year();
  const real: RegularApplicant[] = (
    isThisRound(gather) ? (gather.formStats.applicants ?? []) : []
  ).map((applicant, idx) => ({
    id: `real-${idx}`,
    gender: applicant.gender,
    age: applicant.birthYear ? currentYear - applicant.birthYear : null,
    keys: applicant.keys ?? [],
    submittedAt: applicant.submittedAt,
    isFake: false,
    user: applicant.user ?? null,
  }));

  const male = real.filter((a) => a.gender === "남성").length;
  const female = real.filter((a) => a.gender === "여성").length;
  // 최소 인원은 행사·주차마다 5 또는 6으로 고정(매번 같은 숫자면 인위적이라서)
  const minCount = seededRandom(`${gather.id}-${getCurrentRoundKey()}-min`)() < 0.5 ? 5 : 6;
  const fakeGenders = getFakeGenders(male, female, minCount);

  // 가짜 인원이 고를 선택지: 지난 날짜는 빼고, 콘텐츠 전용 일정은 그 콘텐츠도 함께 고른 것으로 친다.
  const visibleSlots = getVisibleSlots(gather.slots);
  const commonSlots = visibleSlots.filter((slot) => !slot.contentKey);
  const linkedSlots = visibleSlots.filter((slot) => !!slot.contentKey);
  const freeContents = (gather.contents ?? []).filter(
    (content) => !(gather.slots ?? []).some((slot) => slot.contentKey === content.key),
  );

  const roundStart = getRoundStart();
  const lastSync = gather.formStats?.updatedAt ? dayjs(gather.formStats.updatedAt) : roundStart;
  const span = Math.max(lastSync.diff(roundStart), 0);

  const fakes: RegularApplicant[] = fakeGenders.map((gender, idx) => {
    const random = seededRandom(`${gather.id}-${getCurrentRoundKey()}-${idx}`);
    const keys = new Set<string>();
    pickSome(commonSlots, random).forEach((slot) => keys.add(slot.key));
    pickSome(linkedSlots, random).forEach((slot) => {
      keys.add(slot.key);
      keys.add(slot.contentKey);
    });
    pickSome(freeContents, random).forEach((content) => keys.add(content.key));
    return {
      id: `fake-${idx}`,
      gender,
      age: pickFakeAge(random),
      keys: Array.from(keys),
      submittedAt: roundStart.add(Math.floor(random() * span), "ms").toISOString(),
      isFake: true,
    };
  });

  return [...real, ...fakes].sort(
    (a, b) => dayjs(b.submittedAt ?? 0).valueOf() - dayjs(a.submittedAt ?? 0).valueOf(),
  );
};

/** 신청자 목록에서 slot·content key별 인원 */
export const countApplicantsByOption = (applicants: RegularApplicant[]) => {
  const counts: Record<string, number> = {};
  applicants.forEach((applicant) =>
    applicant.keys.forEach((key) => (counts[key] = (counts[key] ?? 0) + 1)),
  );
  return counts;
};

/** 매주 일정이 있으면 "매주 금·토·일", 날짜 일정만 있으면 "11.7 ~ 11.15" */
export const summarizeSchedule = (slots: IRegularSlot[] = []) => {
  const visible = getVisibleSlots(slots);
  const weekdays = Array.from(
    new Set(visible.filter((slot) => !slot.date).map((slot) => slot.weekday)),
  );
  if (weekdays.length) return `매주 ${weekdays.map(getWeekdayLabel).join("·")}`;

  const dated = visible.filter((slot) => !!slot.date);
  if (!dated.length) return slots.length ? "모집 종료" : "상시 진행";
  const first = getSlotDateTime(dated[0]).locale("ko").format("M.D(ddd)");
  const last = getSlotDateTime(dated[dated.length - 1])
    .locale("ko")
    .format("M.D(ddd)");
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
