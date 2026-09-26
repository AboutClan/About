import { STUDY_MIN_OVERLAP_MINUTES } from "@/constants/serviceConstants/studyConstants/studyMatchConstant";
import { LocationProps, TimeRangeProps } from "@/types/common";
import { StudyParticipationProps } from "@/types/models/studyTypes/study-entity.types";
import { getDistanceFromLatLonInKm } from "@/utils/mathUtils";

/** 서버 판정 반경은 신청 eps에 0.1km를 더한 값이다(경계 부동소수점 오차용 버퍼). */
const EPS_BUFFER_KM = 0.1;

/**
 * 시:분만 꺼내 자정 기준 분으로. 서버 `doAlgorithm`의 `toMinutesOfDay`와 같은 방식이다.
 *
 * start/end에 담긴 날짜는 믿지 않는다 — 주간 신청으로 저장된 과거 기록에는
 * 스터디 날짜가 아니라 신청한 날짜가 박혀 있다.
 */
const toMinutesOfDay = (raw: string): number | null => {
  if (!raw) return null;

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return null;

  return parsed.getHours() * 60 + parsed.getMinutes();
};

/** 두 시간대가 겹치는 분. 자정을 넘지 않는다고 본다(신청 룰렛이 10:00~23:00). */
export const getOverlapMinutes = (a: TimeRangeProps, b: TimeRangeProps): number => {
  const aStart = toMinutesOfDay(a?.start as string);
  const aEnd = toMinutesOfDay(a?.end as string);
  const bStart = toMinutesOfDay(b?.start as string);
  const bEnd = toMinutesOfDay(b?.end as string);

  if (aStart === null || aEnd === null || bStart === null || bEnd === null) return 0;

  return Math.max(0, Math.min(aEnd, bEnd) - Math.max(aStart, bStart));
};

const isWithinRadius = (
  anchors: LocationProps[],
  target: LocationProps,
  radiusKm: number,
): boolean => {
  if (!target?.latitude || !target?.longitude) return false;

  return anchors.some((anchor) => {
    if (!anchor?.latitude || !anchor?.longitude) return false;

    const distance = getDistanceFromLatLonInKm(
      anchor.latitude,
      anchor.longitude,
      target.latitude,
      target.longitude,
    );

    return distance != null && distance <= radiusKm;
  });
};

interface MatchCandidateParams {
  /** 내 기준점(최대 2개). 하나라도 반경 안이면 후보로 센다. */
  anchors: LocationProps[];
  /** 내 매칭 반경(km). 판정에는 +0.1km를 더해 쓴다. */
  eps: number;
  /** 같은 날짜의 전체 신청자. 내 것이 섞여 있어도 된다. */
  participations: StudyParticipationProps[];
  /** 내 참여 시간. 주면 60분 이상 겹치는 사람만 센다. 없으면 거리만 본다. */
  times?: TimeRangeProps;
  /** 내 userId. 중복으로 세지 않기 위해 제외한 뒤 마지막에 1을 더한다. */
  myId?: string;
}

/**
 * 나와 같은 조가 될 수 있는 신청자 수(나 포함).
 *
 * 서버 매칭은 여기에 더해 "두 사람이 함께 갈 수 있는 카페가 실제로 있는지"까지 보므로,
 * 이 값이 최소 인원을 넘겨도 매칭이 보장되지는 않는다. 진행 상황을 보여주는 용도다.
 */
export const countMatchCandidates = ({
  anchors,
  eps,
  participations,
  times,
  myId,
}: MatchCandidateParams): number => {
  if (!anchors?.length || !participations?.length) return 0;

  const radiusKm = eps + EPS_BUFFER_KM;
  const counted = new Set<string>();

  participations.forEach((participation) => {
    const userId = participation.user?._id;
    if (!userId || userId === myId) return;

    const targets = participation.locations?.length
      ? participation.locations
      : [participation.location];

    if (!targets.some((target) => isWithinRadius(anchors, target, radiusKm))) return;

    if (times && getOverlapMinutes(times, participation.times) < STUDY_MIN_OVERLAP_MINUTES) {
      return;
    }

    counted.add(userId);
  });

  // 본인은 위에서 제외했으므로 여기서 더한다. myId를 모르면 참여자 목록에 이미 포함돼 있다.
  return counted.size + (myId ? 1 : 0);
};
