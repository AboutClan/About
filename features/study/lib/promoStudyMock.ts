/**
 * 홍보용 이미지 캡처 전용 가짜 스터디 데이터 (promo/study-mock 브랜치 전용, main에 머지 금지).
 *
 * 서버 응답(`/vote2/week`, `/vote2/:idx/lastWeek`)을 받은 뒤 화면에 넘기기 전에 가짜 조와
 * 신청자를 덧붙인다. DB에는 아무것도 쓰지 않는다. 장소는 실제 Place 목록에서 이미지가 있는 곳을
 * 고르고, 멤버는 아바타 캐릭터를 쓰는 가짜 유저다. 같은 날짜는 항상 같은 결과가 나오도록
 * 날짜를 시드로 쓴다.
 */
import axios from "axios";
import dayjs from "dayjs";

import { SERVER_URI } from "@/constants/system";
import {
  InitialParticipationsProps,
  InitialStudyPassedDayProps,
  StudySetInitialDataProps,
} from "@/features/study/hooks/queries";
import { StudyPlaceProps } from "@/types/models/studyTypes/study-entity.types";
import { UserSimpleInfoProps } from "@/types/models/userTypes/userInfoTypes";

export const IS_PROMO_STUDY_MOCK = true;

/**
 * 화면 날짜를 며칠 옮긴다(음수면 과거로). 인자 없는 `dayjs()`(= 지금)를 이만큼 옮기고, 스터디 응답의
 * 날짜·시각도 같은 만큼 옮겨서 "오늘" 표시와 카드 날짜가 함께 움직인다. `new Date()`·`Date.now()`는
 * 그대로라 서버 호출 시각에는 영향이 없다.
 */
export const PROMO_DAY_OFFSET = -3;

if (IS_PROMO_STUDY_MOCK && PROMO_DAY_OFFSET) {
  dayjs.extend((_option, dayjsClass) => {
    const proto = dayjsClass.prototype as unknown as {
      parse: (cfg: { date?: unknown }) => void;
    };
    const originalParse = proto.parse;
    proto.parse = function (cfg) {
      if (cfg.date === undefined) {
        cfg.date = new Date(Date.now() + PROMO_DAY_OFFSET * 24 * 60 * 60 * 1000);
      }
      originalParse.call(this, cfg);
    };
  });
}

const AVATAR_TYPE_CNT = 37;
const AVATAR_BG_CNT = 10;

const FAKE_NAMES = [
  "김서연", "이도윤", "박지우", "최하준", "정서윤", "강민준", "조하은", "윤지호",
  "장수아", "임예준", "한지민", "오시우", "서다은", "신유준", "권채원", "황주원",
  "안소율", "송건우", "전나윤", "홍현우", "유지아", "고은우", "문서진", "양태윤",
  "손하린", "배준서", "백가은", "허승현", "남윤서", "노지환", "심예린", "곽민재",
  "성아린", "차도현", "주연우", "우시은", "구민성", "민채윤", "진우진", "나하율",
];

const FAKE_COMMENTS = [
  "토익 900 목표!", "개발 공부 중", "자격증 준비해요", "논문 마감 화이팅",
  "공시생입니다", "취준 같이해요", "조용히 집중하는 스타일", "",
];

/** 날짜 문자열을 시드로 쓰는 결정적 난수. */
const createRandom = (seedText: string) => {
  let seed = 0;
  for (let i = 0; i < seedText.length; i++) seed = (Math.imul(31, seed) + seedText.charCodeAt(i)) | 0;
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const pickInt = (rand: () => number, min: number, max: number) =>
  min + Math.floor(rand() * (max - min + 1));

const FAKE_USERS: UserSimpleInfoProps[] = FAKE_NAMES.map((name, idx) => ({
  _id: `promo-user-${idx}`,
  uid: `promo-${idx}`,
  name,
  avatar: { type: (idx * 7) % AVATAR_TYPE_CNT, bg: idx % AVATAR_BG_CNT },
  profileImage: "",
  monthScore: 0,
  score: 0,
  comment: FAKE_COMMENTS[idx % FAKE_COMMENTS.length],
  role: "member",
  badge: { badgeIdx: 0 },
  temperature: { temperature: 36.5, cnt: 0 },
  // 멤버 카드의 불꽃 배지(스터디 출석 횟수). 1~10회로 고르게 퍼뜨린다.
  studyRecord: { accumulationCnt: 1 + ((idx * 7) % 10) },
})) as UserSimpleInfoProps[];

/** 스터디 날짜(KST)의 시각을 서버 형식(UTC ISO)으로. */
const toServerTime = (date: string, hour: number, minute = 0) =>
  dayjs(`${date}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00+09:00`)
    .toISOString();

/** 서울·경기·인천(수도권) 주소만 쓴다. */
const CAPITAL_AREA_PREFIX = /^\s*(서울|경기|인천)/;

let placesPromise: Promise<StudyPlaceProps[]> | null = null;

const getPromoPlaces = () => {
  if (!placesPromise) {
    // 평점 상위 100곳(카공 랭킹). 전체 목록은 수천 건이라 무겁고 사진 품질도 들쭉날쭉하다.
    placesPromise = axios
      .get<{ place: StudyPlaceProps }[]>(`${SERVER_URI}/place/ranking`)
      .then(({ data }) =>
        data
          .map((row) => row.place)
          .filter(
            (place) =>
              place?.image &&
              place.location?.name &&
              CAPITAL_AREA_PREFIX.test(place.location?.address ?? ""),
          ),
      )
      .catch(() => {
        placesPromise = null;
        return [];
      });
  }
  return placesPromise;
};

const shuffle = <T>(arr: T[], rand: () => number) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const addPromoDay = (
  day: StudySetInitialDataProps,
  places: StudyPlaceProps[],
  withParticipations: boolean,
  withResults = true,
): StudySetInitialDataProps => {
  const dateStr = dayjs(day.date).format("YYYY-MM-DD");
  const rand = createRandom(dateStr);
  const dayResults = day.results ?? [];
  const usedPlaceIds = new Set(dayResults.map((result) => result.place?._id));
  const candidates = shuffle(
    places.filter((place) => !usedPlaceIds.has(place._id)),
    rand,
  );
  const users = shuffle(FAKE_USERS, rand);
  let userCursor = 0;

  // 하루 2~3개. 서버에 이미 있는 조가 있으면 그만큼 덜 만든다.
  const pickedCnt = pickInt(rand, 2, 3);
  const studyCnt = withResults ? Math.max(0, pickedCnt - dayResults.length) : 0;

  const fakeResults = candidates.slice(0, studyCnt).map((place) => {
    const memberCnt = pickInt(rand, 4, 6);
    const baseStart = pickInt(rand, 10, 14);
    const members = users.slice(userCursor, userCursor + memberCnt).map((user) => {
      const start = baseStart + pickInt(rand, -1, 1);
      const end = start + pickInt(rand, 3, 5);
      return {
        user,
        time: {
          start: toServerTime(dateStr, start, rand() < 0.3 ? 30 : 0),
          end: toServerTime(dateStr, Math.min(end, 23)),
        },
      };
    });
    userCursor += memberCnt;
    return { place, members };
  });

  // 라운지(매칭 대기) 신청자. 조에 들어간 사람과 겹치지 않게 남은 유저에서 뽑는다.
  const fakeParticipations: InitialParticipationsProps[] = withParticipations
    ? users.slice(userCursor, userCursor + pickInt(rand, 5, 9)).map((user, idx) => {
        const place = candidates[(studyCnt + idx) % Math.max(candidates.length, 1)];
        const start = pickInt(rand, 10, 15);
        return {
          user,
          start: toServerTime(dateStr, start),
          end: toServerTime(dateStr, Math.min(start + pickInt(rand, 3, 5), 23)),
          latitude: place?.location?.latitude ?? 37.5,
          longitude: place?.location?.longitude ?? 127.0,
          locationDetail: place?.location?.address ?? "",
          isBeforeResult: true,
        };
      })
    : [];

  return {
    ...day,
    results: [...dayResults, ...(fakeResults as StudySetInitialDataProps["results"])],
    participations: [...(day.participations ?? []), ...fakeParticipations],
  };
};

const shiftTime = <T>(value: T): T =>
  value ? (dayjs(value as string).add(PROMO_DAY_OFFSET, "day").toISOString() as T) : value;

const shiftTimeRange = <T extends { start?: unknown; end?: unknown }>(time: T): T =>
  time ? { ...time, start: shiftTime(time.start), end: shiftTime(time.end) } : time;

/** 하루치 응답의 날짜와 모든 시각을 PROMO_DAY_OFFSET만큼 옮긴다. */
const shiftDay = (day: StudySetInitialDataProps): StudySetInitialDataProps => {
  // 라운지(신청자) 이름은 가운데를 가린다. 상세에서 이름이 그대로 보이기 때문이다.
  return {
    ...day,
    date: dayjs(day.date).add(PROMO_DAY_OFFSET, "day").format("YYYY-MM-DD"),
    results: (day.results ?? []).map((result) => ({
      ...result,
      members: result.members.map((member) => ({
        ...member,
        user: toPromoUser(member.user),
        time: shiftTimeRange(member.time),
      })),
    })),
    participations: (day.participations ?? []).map((par) => ({
      ...shiftTimeRange(par),
      user: toPromoUser(par.user, true),
    })),
    realTimes: (day.realTimes ?? []).map((real) => ({
      ...real,
      user: toPromoUser(real.user),
      time: shiftTimeRange(real.time),
    })),
  };
};

/**
 * 가짜 데이터를 넣는 기간(화면 날짜 기준). 시작일부터 PROMO_FAKE_DAYS일은 스터디와 신청자를,
 * 그다음 PROMO_APPLY_DAYS일까지는 라운지 신청자만 넣는다.
 */
export const PROMO_FAKE_START = "2026-10-04";
export const PROMO_FAKE_DAYS = 6;
export const PROMO_APPLY_DAYS = 7;

const toDisplayDate = (realDate: string) =>
  dayjs(realDate).add(PROMO_DAY_OFFSET, "day").format("YYYY-MM-DD");

/** 화면 날짜 → 서버에 물어볼 실제 날짜. */
export const toPromoRealDate = (displayDate: string) =>
  IS_PROMO_STUDY_MOCK
    ? dayjs(displayDate).subtract(PROMO_DAY_OFFSET, "day").format("YYYY-MM-DD")
    : displayDate;

const getPromoDayIdx = (realDate: string) =>
  dayjs(toDisplayDate(realDate)).diff(dayjs(PROMO_FAKE_START), "day");

const isInPromoWindow = (realDate: string) => {
  const idx = getPromoDayIdx(realDate);
  return idx >= 0 && idx < PROMO_FAKE_DAYS;
};

/**
 * 특정 날짜(화면 날짜)의 스터디 장소를 이름으로 골라 바꾼다. 랭킹 상위 100곳에 없는 카페도 쓸 수 있게
 * 전체 장소 목록에서 찾는다. 이름 비교는 공백을 무시한다.
 */
const PLACE_REPLACEMENTS: { displayDate: string; from: string; to: string }[] = [
  { displayDate: "2026-10-04", from: "단국대", to: "셀렉티드닉스" },
];

const normalizeName = (name?: string) => (name ?? "").replace(/\s/g, "");

let allPlacesPromise: Promise<StudyPlaceProps[]> | null = null;

const getAllPlaces = () => {
  if (!allPlacesPromise) {
    allPlacesPromise = axios
      .get<StudyPlaceProps[]>(`${SERVER_URI}/place`)
      .then(({ data }) => data)
      .catch(() => {
        allPlacesPromise = null;
        return [];
      });
  }
  return allPlacesPromise;
};

const replacePlaces = async (day: StudySetInitialDataProps): Promise<StudySetInitialDataProps> => {
  const displayDate = toDisplayDate(dayjs(day.date).format("YYYY-MM-DD"));
  const targets = PLACE_REPLACEMENTS.filter((rep) => rep.displayDate === displayDate);
  if (!targets.length || !day.results?.length) return day;

  const allPlaces = await getAllPlaces();
  // 같은 이름이 여러 곳이면 강남구 지점을 먼저 쓴다.
  const findPlace = (name: string) => {
    const matched = allPlaces.filter((place) =>
      normalizeName(place.location?.name).includes(normalizeName(name)),
    );
    return matched.find((place) => place.location?.address?.includes("강남")) ?? matched[0];
  };

  return {
    ...day,
    results: day.results.map((result) => {
      const target = targets.find((rep) =>
        normalizeName(result.place?.location?.name).includes(normalizeName(rep.from)),
      );
      const nextPlace = target && findPlace(target.to);
      return nextPlace ? { ...result, place: nextPlace } : result;
    }),
  };
};

const injectDays = async (data: StudySetInitialDataProps[]) => {
  const places = await getPromoPlaces();
  // 실제 오늘. 인자 없는 dayjs()는 옮겨진 날짜라 쓰지 않는다.
  const realToday = dayjs(Date.now()).format("YYYY-MM-DD");
  const injected = data.map((day) => {
      const realDate = dayjs(day.date).format("YYYY-MM-DD");
      // 기간 밖 날짜는 실제 신청자도 비운다. 라운지 아래 "일 1명" 같은 현황 줄에 남지 않게.
      const idx = getPromoDayIdx(realDate);
      if (idx < 0 || idx >= PROMO_APPLY_DAYS) return { ...day, participations: [] };
      if (!places.length) return day;
      // 라운지(매칭 대기) 신청자는 아직 매칭 전인 날짜에만 둔다.
      return addPromoDay(day, places, realDate > realToday, idx < PROMO_FAKE_DAYS);
    });
  const replaced = await Promise.all(injected.map(replacePlaces));
  return replaced.map(shiftDay);
};

/**
 * 이번 주(오늘부터 8일) 데이터. 마지막 날(오늘 + 7일, 다음 주 같은 요일)은 통째로 뺀다.
 * 화면 오늘이 일요일이면 1주일 뒤 일요일이 목록 끝에 붙기 때문이다.
 */
export const injectPromoWeek = async (data: StudySetInitialDataProps[]) => {
  const lastDisplayDate = dayjs().add(7, "day").format("YYYY-MM-DD");
  return (await injectDays(data)).filter((day) => day.date < lastDisplayDate);
};

/** 지난 주 데이터. */
export const injectPromoLastWeek = injectDays;

/** 지난 날짜 상세(`/vote2/:date/info`). 주간 목록과 같은 시드라 같은 조가 나온다. */
export const injectPromoPassedDay = async (
  data: InitialStudyPassedDayProps,
  realDate: string,
): Promise<InitialStudyPassedDayProps> => {
  const places = await getPromoPlaces();
  const baseDay = {
    date: realDate,
    results: data.results ?? [],
    participations: [],
    realTimes: [],
    unmatchedUsers: [],
    status: "open",
  } as StudySetInitialDataProps;
  const day = places.length && isInPromoWindow(realDate) ? addPromoDay(baseDay, places, false) : baseDay;
  const shifted = shiftDay(await replacePlaces(day));

  return {
    ...data,
    results: shifted.results,
    realTimes: {
      ...data.realTimes,
      userList: (data.realTimes?.userList ?? []).map((user) => ({
        ...user,
        time: shiftTimeRange(user.time),
      })),
    },
  };
};

/** 이름 가운데를 *로 가린다. "김서연" → "김*연", "이도" → "이*". */
export const maskPromoName = (name?: string) => {
  if (!name || name.length < 2) return name;
  if (name.length === 2) return `${name[0]}*`;
  return `${name[0]}${"*".repeat(name.length - 2)}${name[name.length - 1]}`;
};

/** 실제 사진 대신 아바타 캐릭터로 보여 줄 유저(이름 기준). */
const AVATAR_OVERRIDE_NAMES = ["윤초은"];

type PromoUserLike = {
  _id?: string;
  name?: string;
  studyRecord?: { accumulationCnt?: number };
  avatar?: UserSimpleInfoProps["avatar"];
  profileImage?: string;
};

/** 홍보 캡처용 유저 표시 보정. 지정한 유저는 아바타로, mask면 이름 가운데를 가린다. */
export const toPromoUser = <T extends PromoUserLike>(user: T, mask = false): T => {
  if (!user) return user;
  let next = user;
  if (AVATAR_OVERRIDE_NAMES.includes(user.name ?? "")) {
    next = { ...next, avatar: { type: 5, bg: 3 }, profileImage: "" };
  }
  // 불꽃 배지(출석 횟수)가 0인 실제 유저도 1~10회로 채운다. id 기준이라 화면마다 같은 값.
  if (!next.studyRecord?.accumulationCnt) {
    const seed = Array.from(next._id ?? next.name ?? "").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    next = { ...next, studyRecord: { ...next.studyRecord, accumulationCnt: 1 + (seed % 10) } };
  }
  if (mask) next = { ...next, name: maskPromoName(next.name) };
  return next;
};
