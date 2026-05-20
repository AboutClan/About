import { Box, Button, Flex, Text } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";

import StarRatingReviewBlock2 from "../../../components/molecules/StarRatingReviewBlock2";
import RightDrawer from "../../../components/organisms/drawer/RightDrawer";
import {
  StudyReviewProps,
  useStudyPlacesCursorQuery,
  useStudyReviewsQuery,
} from "../../../hooks/study/queries";
import { useOverlayRouter } from "../../../hooks/useOverlayRouter";
import { StudyPlaceProps } from "../../../types/models/studyTypes/study-entity.types";
import { PlaceInfoBox } from "../PlaceInfoDrawer";

const tabs = ["최근 후기", "신규 장소"] as const;
type TabType = (typeof tabs)[number];

// DrawerBody 등 스크롤 컨테이너를 DOM에서 탐색
function findScrollContainer(el: HTMLElement | null): HTMLElement | null {
  let node = el?.parentElement ?? null;
  while (node && node !== document.body) {
    const { overflowY } = window.getComputedStyle(node);
    if (overflowY === "auto" || overflowY === "scroll") return node;
    node = node.parentElement;
  }
  return null;
}

// GatherMain 패턴의 cursor 기반 데이터 누적 훅
function useCursorData<T>(
  useQueryFn: (cursor: number) => { data: T[] | undefined; isLoading: boolean },
) {
  const [items, setItems] = useState<T[]>([]);
  const [cursor, setCursor] = useState(0);
  const firstLoad = useRef(true);
  const hasMore = useRef(true);

  const { data, isLoading } = useQueryFn(cursor);

  // cursor=0 & 첫 데이터 도착 → cursor=1로 올려 무한 스크롤 준비
  useEffect(() => {
    if (cursor === 0 && data?.length) setCursor(1);
  }, [cursor, data]);

  // 데이터 누적 (10개 미만이면 더 이상 없음)
  useEffect(() => {
    if (!data) return;
    firstLoad.current = false;
    if (data.length < 10) hasMore.current = false;
    setItems((prev) => (cursor === 0 ? data : [...prev, ...data]));
  }, [data, cursor]);

  const loadMore = useCallback(() => setCursor((prev) => prev + 1), []);

  return { items, isLoading, firstLoad, hasMore, loadMore };
}

// DrawerBody scroll 이벤트 기반 무한 스크롤 훅
function useScrollInfinite({
  isActive,
  isLoading,
  firstLoad,
  hasMore,
  onLoadMore,
}: {
  isActive: boolean;
  isLoading: boolean;
  firstLoad: { current: boolean };
  hasMore: { current: boolean };
  onLoadMore: () => void;
}) {
  const loaderEl = useRef<HTMLDivElement | null>(null);
  const [loaderMounted, setLoaderMounted] = useState(false);
  const onLoadMoreRef = useRef(onLoadMore);
  useEffect(() => {
    onLoadMoreRef.current = onLoadMore;
  });

  const loaderRef = useCallback((el: HTMLDivElement | null) => {
    loaderEl.current = el;
    setLoaderMounted(!!el);
  }, []);

  useEffect(() => {
    if (!isActive || !loaderMounted) return;

    const container = findScrollContainer(loaderEl.current);
    if (!container) return;

    const onScroll = () => {
      if (isLoading || firstLoad.current || !hasMore.current) return;
      const { scrollHeight, scrollTop, clientHeight } = container;
      if (scrollHeight - scrollTop - clientHeight < 50) onLoadMoreRef.current();
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, [isLoading, isActive, loaderMounted]);

  return { loaderRef };
}

interface ReviewButtonProps {
  pickReviewPlace: (place: StudyPlaceProps) => void;
}

function ReviewButton({ pickReviewPlace }: ReviewButtonProps) {
  const router = useRouter();
  const { updateQuery } = useOverlayRouter();
  const [tab, setTab] = useState<TabType>("최근 후기");

  const isDrawer = router.query.modal === "reviewFeed";

  const reviews = useCursorData<StudyReviewProps>(useStudyReviewsQuery);
  const newPlaces = useCursorData<StudyPlaceProps>(useStudyPlacesCursorQuery);

  const { loaderRef: reviewLoaderRef } = useScrollInfinite({
    isActive: isDrawer && tab === "최근 후기",
    isLoading: reviews.isLoading,
    firstLoad: reviews.firstLoad,
    hasMore: reviews.hasMore,
    onLoadMore: reviews.loadMore,
  });

  const { loaderRef: newPlaceLoaderRef } = useScrollInfinite({
    isActive: isDrawer && tab === "신규 장소",
    isLoading: newPlaces.isLoading,
    firstLoad: newPlaces.firstLoad,
    hasMore: newPlaces.hasMore,
    onLoadMore: newPlaces.loadMore,
  });

  return (
    <>
      <Button
        rounded="full"
        bgColor="white"
        boxShadow="0px 5px 10px 0px rgba(66, 66, 66, 0.1)"
        w="40px"
        h="40px"
        size="sm"
        p="0"
        border="var(--border-main)"
        borderWidth="1px"
        borderColor="var(--gray-300)"
        onClick={() => updateQuery({ modal: "reviewFeed" })}
      >
        <BoardIcon />
      </Button>

      {isDrawer && (
        <RightDrawer
          title="실시간 카공 피드"
          onClose={() => router.back()}
          px={false}
          stickyHeader
        >
          <Flex maxW="var(--max-width)" mx="auto" borderBottom="var(--border)" mb={2}>
            {tabs.map((text, idx) => {
              const selected = tab === text;
              return (
                <Button
                  key={text}
                  borderRadius="0"
                  position="relative"
                  flex={1}
                  variant="unstyled"
                  fontSize="14px"
                  fontWeight={selected ? 700 : 500}
                  py={3}
                  bg={selected ? "white" : "var(--gray-100)"}
                  border="var(--border-main)"
                  borderLeft={idx === 1 ? "var(--border-main)" : "none"}
                  borderRight={idx === 1 ? "var(--border-main)" : "none"}
                  borderBottom={selected ? "2px solid var(--color-mint)" : "var(--border-main)"}
                  onClick={() => setTab(text)}
                >
                  {text}
                </Button>
              );
            })}
          </Flex>

          {tab === "최근 후기" && (
            <Flex flexDir="column" px={4} pt={1}>
              {reviews.items.map((item, idx) => {
                return (
                  <Box key={idx} pt={2} pb={3} borderBottom="var(--border)">
                    <Text fontSize="13px" fontWeight={600} color="gray.700" mb={2}>
                      {item.placeInfo?.location?.name}
                    </Text>
                    <StarRatingReviewBlock2 review={item.rating} idx={idx + 1} />
                  </Box>
                );
              })}
              <Box ref={reviewLoaderRef} h="1px" />
            </Flex>
          )}

          {tab === "신규 장소" && (
            <Flex flexDir="column" pt={2}>
              {newPlaces.items.map((place) => (
                <Box key={place._id} borderBottom="var(--border-main)" pb={3} px={4} pt={1}>
                  <PlaceInfoBox
                    placeInfo={place}
                    isDown={false}
                    isShort
                    handleClick={() => pickReviewPlace(place)}
                    customSubText={
                      place.registerDate
                        ? dayjs(place.registerDate).format("등록일: YYYY년 M월 D일")
                        : undefined
                    }
                  />
                </Box>
              ))}
              <Box ref={newPlaceLoaderRef} h="1px" />
            </Flex>
          )}
        </RightDrawer>
      )}
    </>
  );
}

export default ReviewButton;

export function BoardIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="19px"
      viewBox="0 -960 960 960"
      width="19px"
      fill="var(--gray-800)"
    >
      <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h168q13-36 43.5-58t68.5-22q38 0 68.5 22t43.5 58h168q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm120-80h200q17 0 28.5-11.5T560-320q0-17-11.5-28.5T520-360H320q-17 0-28.5 11.5T280-320q0 17 11.5 28.5T320-280Zm0-160h320q17 0 28.5-11.5T680-480q0-17-11.5-28.5T640-520H320q-17 0-28.5 11.5T280-480q0 17 11.5 28.5T320-440Zm0-160h320q17 0 28.5-11.5T680-640q0-17-11.5-28.5T640-680H320q-17 0-28.5 11.5T280-640q0 17 11.5 28.5T320-600Zm181.5-198.5Q510-807 510-820t-8.5-21.5Q493-850 480-850t-21.5 8.5Q450-833 450-820t8.5 21.5Q467-790 480-790t21.5-8.5ZM200-200v-560 560Z" />
    </svg>
  );
}
