import { Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useMemo, useState } from "react";

import { ShortArrowIcon } from "@/components/Icons/ArrowIcons";
import {
  StudyThumbnailCard,
  StudyThumbnailCardProps,
} from "@/components/molecules/cards/StudyThumbnailCard";
import { StudyThumbnailCardSkeleton } from "@/components/skeleton/StudyThumbnailCardSkeleton";
import { STUDY_RESULT_HOUR } from "@/constants/serviceConstants/studyConstants/studyTimeConstant";
import { useLastStudySetQuery } from "@/features/study/hooks/queries";
import { setStudyThumbnailCard } from "@/features/study/lib/thumbnailCardLibs";
import { StudyWeekSetProps } from "@/types/models/studyTypes/study-set.types";
import { dayjsToFormat, getTodayStr } from "@/utils/dateTimeUtils";

const LOUNGE_NAME = "카공 스터디 라운지";

interface StudyWeekCardListProps {
  studySet: StudyWeekSetProps | null | undefined;
  myId: string | undefined;
  /** 오늘 열린 스터디가 없을 때 "직접 열어 보세요"를 누르면 부른다(직접 개설 드로어). */
  onOpenStudy?: () => void;
  /**
   * 카공지도 스터디 탭. 신청 기능이 없으므로 라운지(신청 현황)와 "직접 열어 보세요"를 빼고,
   * 카드 링크에 from=cafe-map을 달아 상세가 카공지도 기준(버튼 숨김·이름 가림)으로 그려지게 한다.
   */
  isCafeMap?: boolean;
}

interface CardSection {
  key: string;
  title: string;
  cards: StudyThumbnailCardProps[];
  /** 카드 아래 한 줄 안내(라운지의 날짜별 신청 현황). */
  footer?: string;
  /** 카드가 없을 때 보여 줄 빈 상태(오늘 9시 이후 열린 스터디 없음). */
  isEmptyToday?: boolean;
}

/**
 * 스터디 탭 카드 목록. 날짜를 고르지 않고 아래로 날짜가 이어진다.
 *
 * - 맨 위 "스터디 라운지": 스터디를 신청해 둔 모든 멤버(매칭 대기)
 * - 그 아래 날짜별 구분선과 그날 스터디. 같은 날 안에서는 내 스터디가 먼저, 그다음
 *   확정 → 오픈 예정(9시 전 미리보기) → 직접 개설 순, 같은 종류끼리는 인원 많은 순.
 *   종류를 섞으면 9시 전후에 카드가 무엇을 뜻하는지 헷갈린다.
 * - 개인 공부 인증은 스터디 탭에서 뺐다.
 */
function StudyWeekCardList({ studySet, myId, onOpenStudy, isCafeMap }: StudyWeekCardListProps) {
  const sections = useMemo<CardSection[] | null>(() => {
    if (!studySet) return null;
    const today = getTodayStr();

    // 라운지는 신청자 전원을 보여 준다(오픈 예정 조에 들어간 사람 포함).
    // 마지막 인자(isTemp)가 개인 공부 인증 카드를 뺀다.
    const allCards = setStudyThumbnailCard(
      today,
      studySet,
      myId,
      undefined,
      undefined,
      undefined,
      isCafeMap,
      true,
    );
    const cards = isCafeMap
      ? allCards.filter((card) => card.place.name !== LOUNGE_NAME)
      : allCards;

    const loungeCards = cards.filter((card) => card.place.name === LOUNGE_NAME);

    // 라운지 아래 날짜별 신청 현황("수 3명 · 목 5명 신청 중"). 카드가 없는 날짜도 사람이 모이고
    // 있다는 걸 보여 준다. 오늘은 9시 매칭 전까지만 센다.
    const loungeFooter = studySet.participations
      .filter(
        (day) =>
          day.study.length > 0 &&
          (day.date > today || (day.date === today && dayjs().hour() < STUDY_RESULT_HOUR)),
      )
      .sort((a, b) => (a.date < b.date ? -1 : 1))
      .map(
        (day) =>
          `${day.date === today ? "오늘" : dayjs(day.date).format("ddd")} ${day.study.length}명`,
      )
      .join(" · ");

    const kindRank = (card: StudyThumbnailCardProps) => {
      if (card.studyType === "openRealTimes") return 2;
      return card.dateStatus === "future" ? 1 : 0;
    };

    const byDate = new Map<string, StudyThumbnailCardProps[]>();
    cards
      .filter((card) => card.place.date)
      .forEach((card) => {
        const key = dayjsToFormat(card.place.date, "YYYY-MM-DD");
        byDate.set(key, [...(byDate.get(key) ?? []), card]);
      });

    const dateSections = Array.from(byDate.entries())
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .map(([key, dayCards]) => ({
        key,
        title: dayjsToFormat(dayjs(key), "M월 D일 (ddd)") + (key === today ? " · 오늘" : ""),
        cards: [...dayCards].sort(
          (a, b) =>
            Number(b.isMyStudy) - Number(a.isMyStudy) ||
            kindRank(a) - kindRank(b) ||
            (b.participants?.length ?? 0) - (a.participants?.length ?? 0),
        ),
      }));

    // 오늘 9시 이후 오늘 카드가 하나도 없으면 "오늘" 구분선째 사라져, 오늘 하고 싶은 사람이
    // 갈 곳이 없다. 빈 오늘 칸을 넣고 직접 개설로 이어 준다.
    const isAfterResult = dayjs().hour() >= STUDY_RESULT_HOUR;
    if (isAfterResult && !byDate.has(today)) {
      dateSections.unshift({
        key: today,
        title: dayjsToFormat(dayjs(today), "M월 D일 (ddd)") + " · 오늘",
        cards: [],
        isEmptyToday: true,
      } as CardSection);
    }

    return [
      ...(loungeCards.length
        ? [
            {
              key: "lounge",
              title: "스터디 라운지",
              cards: loungeCards,
              footer: loungeFooter ? `${loungeFooter} 신청 중` : undefined,
            },
          ]
        : []),
      ...dateSections,
    ];
  }, [studySet, myId, isCafeMap]);

  if (!sections) {
    return (
      <Box mt={2}>
        {[1, 2, 3, 4].map((idx) => (
          <Box key={idx} mb={3}>
            <StudyThumbnailCardSkeleton />
          </Box>
        ))}
      </Box>
    );
  }

  return (
    <Box mt={2}>
      {sections.map((section) => (
        <Box key={section.key}>
          <SectionDivider text={section.title} />
          {section.cards.map((card) => (
            <Box key={card.url} mb={3}>
              <StudyThumbnailCard {...card} />
            </Box>
          ))}
          {section.isEmptyToday && (
            <Flex
              align="center"
              justify="space-between"
              mb={3}
              px={4}
              py={3}
              bg="gray.50"
              borderRadius="10px"
              fontSize="13px"
            >
              <Box color="gray.600">오늘은 열린 스터디가 없어요</Box>
              {!isCafeMap && onOpenStudy && (
              <Flex
                as="button"
                type="button"
                align="center"
                gap={0.5}
                fontWeight={600}
                color="mint"
                onClick={onOpenStudy}
              >
                직접 열어 보세요
                <ShortArrowIcon dir="right" color="mint" />
              </Flex>
              )}
            </Flex>
          )}
          {section.footer && (
            <Box mt={-1} mb={3} fontSize="12px" lineHeight="18px" color="gray.500">
              {section.footer}
            </Box>
          )}
        </Box>
      ))}
      <PastStudySection myId={myId} isCafeMap={isCafeMap} />
    </Box>
  );
}

/** 지난 스터디는 접어 두고, 누를 때마다 한 주씩 더 불러온다. */
function PastStudySection({ myId, isCafeMap }: { myId: string | undefined; isCafeMap?: boolean }) {
  const [weekCnt, setWeekCnt] = useState(0);

  return (
    <Box mt={4}>
      {Array.from({ length: weekCnt }, (_, i) => (
        <PastWeekCards key={i} idx={i + 1} myId={myId} isCafeMap={isCafeMap} />
      ))}
      <Button
        w="100%"
        h="40px"
        bgColor="white"
        border="0.5px solid #E8E8E8"
        fontSize="13px"
        fontWeight={500}
        color="gray.600"
        onClick={() => setWeekCnt((old) => old + 1)}
      >
        {weekCnt ? "지난 스터디 더 보기" : "지난 스터디 보기"}
      </Button>
    </Box>
  );
}

function PastWeekCards({
  idx,
  myId,
  isCafeMap,
}: {
  idx: number;
  myId: string | undefined;
  isCafeMap?: boolean;
}) {
  const { data } = useLastStudySetQuery(idx);

  const cards = useMemo(() => {
    if (!data) return null;
    // temp=true: 라운지 제외·최신순, isTemp=true: 개인 공부 인증 카드 제외
    return setStudyThumbnailCard(getTodayStr(), data, myId, null, null, true, isCafeMap, true);
  }, [data, myId, isCafeMap]);

  if (!cards) return <StudyThumbnailCardSkeleton />;

  return (
    <>
      {cards.map((card, i) => {
        const key = card.place.date ? dayjsToFormat(card.place.date, "YYYY-MM-DD") : "";
        const prevKey =
          i > 0 && cards[i - 1].place.date
            ? dayjsToFormat(cards[i - 1].place.date, "YYYY-MM-DD")
            : null;
        return (
          <Box key={card.url}>
            {key !== prevKey && card.place.date && (
              <SectionDivider text={dayjsToFormat(card.place.date, "M월 D일")} />
            )}
            <Box mb={3}>
              <StudyThumbnailCard {...card} />
            </Box>
          </Box>
        );
      })}
    </>
  );
}

function SectionDivider({ text }: { text: string }) {
  return (
    <Flex align="center" my={4}>
      <Box flex={1} h="1px" bg="gray.200" />
      <Box mx={3} fontSize="12px" fontWeight="bold" color="gray.500" whiteSpace="nowrap">
        {text}
      </Box>
      <Box flex={1} h="1px" bg="gray.200" />
    </Flex>
  );
}

export default StudyWeekCardList;
