import { Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useMemo, useState } from "react";

import {
  StudyThumbnailCard,
  StudyThumbnailCardProps,
} from "@/components/molecules/cards/StudyThumbnailCard";
import { StudyThumbnailCardSkeleton } from "@/components/skeleton/StudyThumbnailCardSkeleton";
import { useLastStudySetQuery } from "@/features/study/hooks/queries";
import { setStudyThumbnailCard } from "@/features/study/lib/thumbnailCardLibs";
import { StudyWeekSetProps } from "@/types/models/studyTypes/study-set.types";
import { dayjsToFormat, getTodayStr } from "@/utils/dateTimeUtils";

const LOUNGE_NAME = "카공 스터디 라운지";

interface StudyWeekCardListProps {
  studySet: StudyWeekSetProps | null | undefined;
  myId: string | undefined;
}

interface CardSection {
  key: string;
  title: string;
  cards: StudyThumbnailCardProps[];
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
function StudyWeekCardList({ studySet, myId }: StudyWeekCardListProps) {
  const sections = useMemo<CardSection[] | null>(() => {
    if (!studySet) return null;
    const today = getTodayStr();

    // 라운지는 신청자 전원을 보여 준다(오픈 예정 조에 들어간 사람 포함).
    // 마지막 인자(isTemp)가 개인 공부 인증 카드를 뺀다.
    const cards = setStudyThumbnailCard(
      today,
      studySet,
      myId,
      undefined,
      undefined,
      undefined,
      undefined,
      true,
    );

    const loungeCards = cards.filter((card) => card.place.name === LOUNGE_NAME);

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
        title: dayjsToFormat(dayjs(key), "M월 D일") + (key === today ? " (오늘)" : ""),
        cards: [...dayCards].sort(
          (a, b) =>
            Number(b.isMyStudy) - Number(a.isMyStudy) ||
            kindRank(a) - kindRank(b) ||
            (b.participants?.length ?? 0) - (a.participants?.length ?? 0),
        ),
      }));

    return [
      ...(loungeCards.length ? [{ key: "lounge", title: "스터디 라운지", cards: loungeCards }] : []),
      ...dateSections,
    ];
  }, [studySet, myId]);

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
        </Box>
      ))}
      <PastStudySection myId={myId} />
    </Box>
  );
}

/** 지난 스터디는 접어 두고, 누를 때마다 한 주씩 더 불러온다. */
function PastStudySection({ myId }: { myId: string | undefined }) {
  const [weekCnt, setWeekCnt] = useState(0);

  return (
    <Box mt={4}>
      {Array.from({ length: weekCnt }, (_, i) => (
        <PastWeekCards key={i} idx={i + 1} myId={myId} />
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

function PastWeekCards({ idx, myId }: { idx: number; myId: string | undefined }) {
  const { data } = useLastStudySetQuery(idx);

  const cards = useMemo(() => {
    if (!data) return null;
    // temp=true: 라운지 제외·최신순, isTemp=true: 개인 공부 인증 카드 제외
    return setStudyThumbnailCard(getTodayStr(), data, myId, null, null, true, false, true);
  }, [data, myId]);

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
