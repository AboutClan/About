import { Box, Button, Flex, Skeleton } from "@chakra-ui/react";
import dayjs from "dayjs";
import Link from "next/link";
import { Fragment, useMemo } from "react";

import { ShortArrowIcon } from "@/components/Icons/ArrowIcons";
import { StarIcon } from "@/components/Icons/StarIcons";
import { STUDY_MIN_MEMBER_COUNT } from "@/constants/serviceConstants/studyConstants/studyMatchConstant";
import { STUDY_RESULT_HOUR } from "@/constants/serviceConstants/studyConstants/studyTimeConstant";
import { StudyBadgeRankingProps } from "@/features/study/hooks/queries";
import { countMatchCandidates } from "@/features/study/lib/matchProgress";
import { StudyWeekSetProps } from "@/types/models/studyTypes/study-set.types";
import { getTodayStr } from "@/utils/dateTimeUtils";

/** 서버 신청 기본 반경(eps). 구버전 신청에는 eps가 없다. */
const DEFAULT_EPS_KM = 3;

interface StudyMyCardProps {
  studySet: StudyWeekSetProps | null | undefined;
  myId: string | undefined;
  isGuest: boolean;
  badgeRanking?: StudyBadgeRankingProps;
  onOpenRanking: () => void;
}

interface TodayStudy {
  name: string;
  time: string | null;
  memberCnt: number;
  url: string;
  /** 남이 연 스터디에 참여 신청만 하고 아직 승인받지 못했다(realtime status "pending"). */
  isPending: boolean;
}

interface ApplyStatus {
  date: string;
  /** 미리보기 조에 들어가 있으면 그 카페 이름. */
  placeName: string | null;
  /** 나 포함, 같은 조가 될 수 있는 인원(미리보기 조면 그 조 인원). */
  count: number;
  /** 내가 신청한 시간("14:00~18:00"). 확인하려고 드로어를 열지 않게 같이 보여 준다. */
  time: string | null;
}

const formatTime = (raw?: string) => (raw ? dayjs(raw).format("HH:mm") : null);

const isConfirmedDate = (date: string) =>
  date < getTodayStr() || (date === getTodayStr() && dayjs().hour() >= STUDY_RESULT_HOUR);

/**
 * 스터디 탭 맨 위 "내 스터디" 카드. 지금 내 상태에 맞는 한 가지만 보여 준다.
 *
 * - 오늘 스터디가 있으면 → 카페·시간·인원과 상세 바로가기(승인 대기면 그 상태)
 * - 오늘 9시 매칭에서 빠졌으면 → 실패 안내와 다른 날짜 신청
 * - 신청해 둔 날짜가 있으면 → 날짜별로 지금 몇 명이 모였고 몇 명이 더 필요한지
 * - 아무것도 없으면(게스트 포함) → 진행 방식 안내. 신청 버튼은 하단 고정 버튼 하나만 둔다.
 *
 * 스탬프·랭킹은 신청을 끌어내는 정보가 아니라서 맨 아래 한 줄로만 둔다.
 */
function StudyMyCard({ studySet, myId, isGuest, badgeRanking, onOpenRanking }: StudyMyCardProps) {
  const todayStudy = useMemo<TodayStudy | null>(() => {
    if (!studySet || !myId) return null;
    const today = getTodayStr();

    // 정규 매칭은 9시 확정 뒤부터, 직접 개설은 연 순간부터 "오늘의 스터디"다.
    const candidates = [
      ...(isConfirmedDate(today)
        ? studySet.results.map((entry) => ({ entry, type: "results" }))
        : []),
      ...studySet.openRealTimes.map((entry) => ({ entry, type: "openRealTimes" })),
    ];

    for (const { entry, type } of candidates) {
      if (entry.date !== today) continue;
      const me = entry.study.members.find((member) => member.user?._id === myId);
      if (!me) continue;

      const place = entry.study.place;
      return {
        name: place?.location?.name ?? "오늘의 스터디",
        time: me.time?.start ? `${formatTime(me.time.start)} ~ ${formatTime(me.time.end)}` : null,
        // 승인 대기 중인 사람은 아직 참여자가 아니므로 세지 않는다.
        memberCnt: entry.study.members.filter((member) => member.status !== "pending").length,
        url: `/study/${place?._id}/${today}?type=${type}`,
        isPending: me.status === "pending",
      };
    }
    return null;
  }, [studySet, myId]);

  const applyStatuses = useMemo<ApplyStatus[]>(() => {
    if (!studySet || !myId) return [];

    return studySet.participations
      .filter((day) => !isConfirmedDate(day.date))
      .flatMap((day) => {
        const mine = day.study.find((par) => par.user?._id === myId);
        if (!mine) return [];
        const time = mine.times?.start
          ? `${formatTime(mine.times.start as string)}~${formatTime(mine.times.end as string)}`
          : null;

        const previewGroup = studySet.results.find(
          (entry) =>
            entry.date === day.date &&
            entry.study.members.some((member) => member.user?._id === myId),
        );
        if (previewGroup) {
          return [
            {
              date: day.date,
              placeName: previewGroup.study.place?.location?.name ?? null,
              count: previewGroup.study.members.length,
              time,
            },
          ];
        }

        // 이미 다른 미리보기 조에 들어간 사람은 나와 묶일 수 없으므로 세지 않는다.
        // 안 빼면 미매칭이 예상되는데도 "9시에 카페가 정해져요"가 나온다.
        const groupedIds = new Set(
          studySet.results
            .filter((entry) => entry.date === day.date)
            .flatMap((entry) => entry.study.members.map((member) => member.user?._id)),
        );
        const anchors = mine.locations?.length ? mine.locations : [mine.location];
        return [
          {
            date: day.date,
            placeName: null,
            time,
            count: countMatchCandidates({
              anchors,
              eps: mine.eps ?? DEFAULT_EPS_KM,
              participations: day.study.filter((par) => !groupedIds.has(par.user?._id)),
              times: mine.times,
              myId,
            }),
          },
        ];
      });
  }, [studySet, myId]);

  /** 오늘 9시 매칭에서 빠졌는가. 서버가 확정 뒤 unmatched에 그날 신청했지만 조가 없는 사람을 준다. */
  const isUnmatchedToday = useMemo(() => {
    if (!studySet || !myId) return false;
    const today = getTodayStr();
    return studySet.unmatched.some(
      (entry) => entry.date === today && entry.users.some((user) => user?._id === myId),
    );
  }, [studySet, myId]);

  // 데이터가 오기 전에 상태를 짐작해 그리면, 신청한 사람에게도 "신청하기"가 잠깐 보였다가 바뀐다.
  if (!studySet) {
    return (
      <Box px={4} py={4} border="var(--border-main)" borderRadius="12px" bg="white">
        <Skeleton h="24px" w="60%" borderRadius="6px" />
        <Skeleton h="16px" mt={2} borderRadius="6px" />
        <Skeleton h="44px" mt={3} borderRadius="8px" />
      </Box>
    );
  }

  return (
    <Box px={4} py={4} border="var(--border-main)" borderRadius="12px" bg="white">
      {todayStudy ? (
        <>
          <TodayStudyBlock study={todayStudy} />
          {/* 오늘 스터디가 있어도 다른 날짜 신청 현황이 묻히지 않게 한 줄로 덧붙인다. */}
          {applyStatuses.length > 0 && <ApplySummaryLine statuses={applyStatuses} />}
        </>
      ) : isUnmatchedToday ? (
        <>
          <UnmatchedBlock />
          {applyStatuses.length > 0 && <ApplySummaryLine statuses={applyStatuses} />}
        </>
      ) : applyStatuses.length ? (
        <ApplyStatusBlock statuses={applyStatuses} />
      ) : (
        <IntroBlock />
      )}

      {!isGuest && badgeRanking && (
        <Flex
          align="center"
          justify="space-between"
          mt={3}
          pt={3}
          borderTop="var(--border)"
          fontSize="12px"
          color="gray.600"
        >
          <Flex align="center" gap={1.5}>
            <Flex
              w="18px"
              h="18px"
              align="center"
              justify="center"
              borderRadius="50%"
              bg="mint"
              sx={{ svg: { width: "10px", height: "10px" } }}
            >
              <StarIcon />
            </Flex>
            이번 달 스탬프
            <Box as="b" color="gray.800">
              {badgeRanking.myBadgeCnt}개
            </Box>
            <Box color="gray.400">·</Box>
            {badgeRanking.myRank ? `${badgeRanking.myRank}위` : "순위권 외"}
          </Flex>
          <Flex
            as="button"
            type="button"
            align="center"
            gap={0.5}
            fontWeight="bold"
            color="mint"
            onClick={onOpenRanking}
          >
            랭킹
            <ShortArrowIcon dir="right" color="mint" />
          </Flex>
        </Flex>
      )}
    </Box>
  );
}

/** 신청 버튼은 하단 고정 버튼 하나만 둔다(스크롤해도 항상 보인다). */
function IntroBlock() {
  return (
    <>
      <Box
        fontSize="16px"
        fontWeight={800}
        lineHeight="24px"
        letterSpacing="-0.02em"
        color="gray.800"
      >
        원하는 날, 근처에서 같이 카공해요
      </Box>
      <Box mt={1.5} fontSize="13px" lineHeight="20px" letterSpacing="-0.01em" color="gray.600">
        날짜와 위치를 선택해 스터디를 신청하면,
        <br />
        가까운 멤버가{" "}
        <Box as="b" color="gray.800">
          4명 이상
        </Box>{" "}
        모일 때 스터디가 확정돼요.
      </Box>

      {/*
        진행 순서. 번호 원 아래에 한 줄 문구를 두고, 칸 사이에 작은 화살표를 넣는다.
        문구(7~8자)가 칸 폭에 딱 맞아서 자간을 살짝 좁히고 줄바꿈을 막았다.
      */}
      <Flex mt={4} align="center">
        {STEPS.map((step, idx) => (
          <Fragment key={step}>
            {idx > 0 && (
              <Flex w="14px" flexShrink={0} justify="center">
                <ShortArrowIcon dir="right" size="sm" color="lightGray" />
              </Flex>
            )}
            <Flex
              flex={1}
              minW={0}
              direction="column"
              align="center"
              gap="6px"
              py={3}
              bg="gray.50"
              borderRadius="10px"
            >
              <Flex
                w="18px"
                h="18px"
                align="center"
                justify="center"
                borderRadius="50%"
                bg="mint"
                color="white"
                fontSize="10px"
                lineHeight="1"
                fontWeight={700}
              >
                {idx + 1}
              </Flex>
              <Box
                fontSize="11px"
                lineHeight="16px"
                letterSpacing="-0.03em"
                fontWeight={600}
                color="gray.700"
                whiteSpace="nowrap"
              >
                {step}
              </Box>
            </Flex>
          </Fragment>
        ))}
      </Flex>
    </>
  );
}

const STEPS = ["날짜·지역 선택", "스터디 자동 매칭", "당일 스터디 확정"];

// 신청 변경은 하단 고정 버튼([신청 변경]) 하나로 한다. 카드 안에 같은 버튼을 두지 않는다.
function ApplyStatusBlock({ statuses }: { statuses: ApplyStatus[] }) {
  return (
    <>
      <Box fontSize="16px" fontWeight={800} lineHeight="24px" color="gray.800">
        신청한 스터디
      </Box>
      <Box mt={2}>
        {statuses.map(({ date, placeName, count, time }) => {
          const remain = Math.max(STUDY_MIN_MEMBER_COUNT - count, 0);
          return (
            <Flex key={date} align="center" justify="space-between" py={1.5} fontSize="13px">
              <Box fontWeight={600} color="gray.800" flexShrink={0}>
                {dayjs(date).format("M/D(ddd)")}
                {time && (
                  <Box as="span" ml={1.5} fontSize="11px" fontWeight={400} color="gray.500">
                    {time}
                  </Box>
                )}
              </Box>
              <Box ml={3} color="gray.600" textAlign="right" isTruncated>
                {placeName ? (
                  <>
                    <Box as="span" color="mint" fontWeight={600}>
                      오픈 예정
                    </Box>{" "}
                    · {placeName} · {count}명
                    {/* 미리보기는 3명부터 보인다. 확정 기준(4명)에 못 미치면 남은 인원을 같이 적는다. */}
                    {remain > 0 && ` · 확정까지 ${remain}명`}
                  </>
                ) : remain > 0 ? (
                  <>
                    내 근처 {count}명 ·{" "}
                    <Box as="span" color="mint" fontWeight={600}>
                      {remain}명
                    </Box>{" "}
                    더 모이면 확정
                  </>
                ) : (
                  <>내 근처 {count}명 · 9시에 카페가 정해져요</>
                )}
              </Box>
            </Flex>
          );
        })}
      </Box>
      <Box mt={1} fontSize="11px" color="gray.400">
        오전 9시 전까지는 무료로 변경·취소할 수 있어요.
      </Box>
    </>
  );
}

// 다른 날짜 신청은 하단 고정 버튼으로 한다.
function UnmatchedBlock() {
  return (
    <>
      <Box fontSize="16px" fontWeight={800} lineHeight="24px" color="gray.800">
        오늘은 매칭되지 않았어요
      </Box>
      <Box mt={1} fontSize="13px" lineHeight="20px" color="gray.600">
        근처에서 시간이 겹치는 멤버가 부족했어요. 아래 오늘 스터디에 빈자리가 있으면 바로 참여할 수
        있어요.
      </Box>
    </>
  );
}

function ApplySummaryLine({ statuses }: { statuses: ApplyStatus[] }) {
  return (
    <Box mt={3} fontSize="12px" color="gray.500" isTruncated>
      신청한 날짜 {statuses.length}개 ·{" "}
      {statuses.map(({ date }) => dayjs(date).format("M/D(ddd)")).join(", ")}
    </Box>
  );
}

function TodayStudyBlock({ study }: { study: TodayStudy }) {
  return (
    <>
      <Box fontSize="12px" fontWeight={600} color={study.isPending ? "gray.500" : "mint"}>
        {study.isPending ? "참여 승인 대기 중" : "오늘의 스터디"}
      </Box>
      <Box mt={0.5} fontSize="16px" fontWeight={800} lineHeight="24px" color="gray.800" isTruncated>
        {study.name}
      </Box>
      <Box mt={0.5} fontSize="13px" color="gray.600">
        {study.time ? `${study.time} · ` : ""}
        {study.memberCnt}명 참여
        {study.isPending && " · 개설자가 승인하면 참여가 확정돼요"}
      </Box>
      <Button as={Link} href={study.url} mt={3} w="100%" h="44px" colorScheme="mint">
        스터디 보러 가기
      </Button>
    </>
  );
}

export default StudyMyCard;
