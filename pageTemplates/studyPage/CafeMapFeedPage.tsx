import { Box, Button, Flex, Text } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";

import Header from "../../components/layouts/Header";
import StarRatingReviewBlock2 from "../../components/molecules/StarRatingReviewBlock2";
import {
  StudyReviewProps,
  useStudyPlacesCursorQuery,
  useStudyReviewsQuery,
} from "../../hooks/study/queries";
import { useOverlayRouter } from "../../hooks/useOverlayRouter";
import { StudyPlaceProps } from "../../types/models/studyTypes/study-entity.types";
import { getSafeAreaBottom } from "../../utils/validationUtils";
import { RightReviewDrawer } from "../study/StudyReview";
import { PlaceInfoBox } from "./PlaceInfoDrawer";
import { StudyReviewDrawer } from "./StudyReviewDrawer";

const FEED_TABS = ["최근 후기", "신규 장소"] as const;
type FeedTab = (typeof FEED_TABS)[number];

function findScrollContainer(el: HTMLElement | null): HTMLElement | null {
  let node = el?.parentElement ?? null;
  while (node && node !== document.body) {
    const { overflowY } = window.getComputedStyle(node);
    if (overflowY === "auto" || overflowY === "scroll") return node;
    node = node.parentElement;
  }
  return null;
}

function useCursorData<T>(
  useQueryFn: (cursor: number) => { data: T[] | undefined; isLoading: boolean },
) {
  const [items, setItems] = useState<T[]>([]);
  const [cursor, setCursor] = useState(0);
  const firstLoad = useRef(true);
  const hasMore = useRef(true);

  const { data, isLoading } = useQueryFn(cursor);

  useEffect(() => {
    if (cursor === 0 && data?.length) setCursor(1);
  }, [cursor, data]);

  useEffect(() => {
    if (!data) return;
    firstLoad.current = false;
    if (data.length < 10) hasMore.current = false;
    setItems((prev) => (cursor === 0 ? data : [...prev, ...data]));
  }, [data, cursor]);

  const loadMore = useCallback(() => setCursor((prev) => prev + 1), []);
  return { items, isLoading, firstLoad, hasMore, loadMore };
}

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

export default function CafeMapFeedPage() {
  const router = useRouter();
  const { updateQuery } = useOverlayRouter();
  const modalParam = router.query.modal;

  const [feedTab, setFeedTab] = useState<FeedTab>("최근 후기");
  const [reviewPlace, setReviewPlace] = useState<StudyPlaceProps | null>(null);

  const reviews = useCursorData<StudyReviewProps>(useStudyReviewsQuery);
  const newPlaces = useCursorData<StudyPlaceProps>(useStudyPlacesCursorQuery);
  console.log(3, newPlaces);
  const { loaderRef: reviewLoaderRef } = useScrollInfinite({
    isActive: feedTab === "최근 후기",
    isLoading: reviews.isLoading,
    firstLoad: reviews.firstLoad,
    hasMore: reviews.hasMore,
    onLoadMore: reviews.loadMore,
  });

  const { loaderRef: newPlaceLoaderRef } = useScrollInfinite({
    isActive: feedTab === "신규 장소",
    isLoading: newPlaces.isLoading,
    firstLoad: newPlaces.firstLoad,
    hasMore: newPlaces.hasMore,
    onLoadMore: newPlaces.loadMore,
  });

  return (
    <Flex
      flexDir="column"
      pos="fixed"
      top={0}
      left={0}
      right={0}
      bottom={getSafeAreaBottom(52)}
      zIndex={500}
      bg="white"
      maxW="var(--max-width)"
      mx="auto"
    >
      <Header title="실시간 카공 피드" isBack={false} isSlide={false}></Header>

      {/* 탭 바 */}
      <Flex w="full" borderBottom="var(--border)" flexShrink={0} mt="var(--header-h)">
        {FEED_TABS.map((text, idx) => {
          const selected = feedTab === text;
          return (
            <Button
              key={text}
              borderRadius="0"
              flex={1}
              variant="unstyled"
              fontSize="14px"
              fontWeight={selected ? 700 : 500}
              py={3}
              h="auto"
              bg={selected ? "white" : "var(--gray-100)"}
              border="var(--border-main)"
              borderLeft={idx === 1 ? "var(--border-main)" : "none"}
              borderRight={idx === 1 ? "var(--border-main)" : "none"}
              borderBottom={selected ? "2px solid var(--color-mint)" : "var(--border-main)"}
              color={selected ? "gray.900" : "gray.500"}
              onClick={() => setFeedTab(text)}
            >
              {text}
            </Button>
          );
        })}
      </Flex>

      {/* 스크롤 영역 */}
      <Box flex={1} overflowY="auto">
        {feedTab === "최근 후기" && (
          <Flex flexDir="column" px={4} pt={1}>
            {reviews.items.map((item, idx) => (
              <Box key={idx} pt={2} pb={3} borderBottom="var(--border)">
                <Text fontSize="13px" fontWeight={600} color="gray.700" mb={2}>
                  {item.placeInfo?.location?.name}
                </Text>
                <StarRatingReviewBlock2 review={item.rating} idx={idx + 1} />
              </Box>
            ))}
            <Box ref={reviewLoaderRef} h="1px" />
          </Flex>
        )}

        {feedTab === "신규 장소" && (
          <Flex flexDir="column" pt={2}>
            {newPlaces.items.map((place) => (
              <Box key={place._id} borderBottom="var(--border-main)" pb={3} px={4} pt={1}>
                <PlaceInfoBox
                  placeInfo={place}
                  isDown={false}
                  isShort
                  customSubText={
                    place.registerDate
                      ? dayjs(place.registerDate).format("등록일: YYYY년 M월 D일")
                      : undefined
                  }
                  handleClick={() => {
                    setReviewPlace(place);
                    updateQuery({ modal: "reviewPlace" });
                  }}
                />
              </Box>
            ))}
            <Box ref={newPlaceLoaderRef} h="1px" />
          </Flex>
        )}
      </Box>

      {reviewPlace && (
        <StudyReviewDrawer
          placeInfo={reviewPlace}
          onClose={() => {
            router.back();
            setReviewPlace(null);
          }}
          zIndex={3000}
          handleClick={() => updateQuery({ modal: "addReview" })}
        />
      )}
      {modalParam === "addReview" && reviewPlace && (
        <RightReviewDrawer placeId={reviewPlace._id} onClose={() => router.back()} zIndex={4000} />
      )}
    </Flex>
  );
}
