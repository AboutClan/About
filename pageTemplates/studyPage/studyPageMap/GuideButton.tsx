import { CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  chakra,
  Flex,
  ListItem,
  shouldForwardProp,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { AnimatePresence, isValidMotionProp, motion } from "framer-motion";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";

import ScreenOverlay from "../../../components/atoms/ScreenOverlay";
import Spinner from "../../../components/atoms/Spinner";
import StarRatingReviewBlock2 from "../../../components/molecules/StarRatingReviewBlock2";
import RightDrawer from "../../../components/organisms/drawer/RightDrawer";
import {
  StudyReviewProps,
  useStudyPlacesCursorQuery,
  useStudyReviewsQuery,
} from "../../../hooks/study/queries";
import { ModalLayout } from "../../../modals/Modals";
import { StudyPlaceProps } from "../../../types/models/studyTypes/study-entity.types";
import { PlaceInfoBox } from "../PlaceInfoDrawer";

const MotionFlex = chakra(motion.div, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || shouldForwardProp(prop),
});

type MenuType = "이용 가이드" | "업데이트 소식";
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

interface GuideButtonProps {
  pickReviewPlace?: (place: StudyPlaceProps) => void;
  openReviewForm?: (place: StudyPlaceProps) => void;
  addCafe?: () => void;
}

function GuideButton({ pickReviewPlace, addCafe }: GuideButtonProps) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [menu, setMenu] = useState<MenuType | null>(null);
  const [feedTab, setFeedTab] = useState<FeedTab>("최근 후기");
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [isLocationConfirmOpen, setIsLocationConfirmOpen] = useState(false);

  const reviews = useCursorData<StudyReviewProps>(useStudyReviewsQuery);
  const newPlaces = useCursorData<StudyPlaceProps>(useStudyPlacesCursorQuery);

  const isFeedOpen = router.query.modal === "reviewFeed";

  const { loaderRef: reviewLoaderRef } = useScrollInfinite({
    isActive: isFeedOpen && feedTab === "최근 후기",
    isLoading: reviews.isLoading,
    firstLoad: reviews.firstLoad,
    hasMore: reviews.hasMore,
    onLoadMore: reviews.loadMore,
  });

  const { loaderRef: newPlaceLoaderRef } = useScrollInfinite({
    isActive: isFeedOpen && feedTab === "신규 장소",
    isLoading: newPlaces.isLoading,
    firstLoad: newPlaces.firstLoad,
    hasMore: newPlaces.hasMore,
    onLoadMore: newPlaces.loadMore,
  });

  const openMenu = (item: MenuType) => {
    setIsOpen(false);
    setMenu(item);
  };

  const openAddCafe = () => {
    setIsOpen(false);
    setIsLocationConfirmOpen(false);
    addCafe?.();
  };

  // "카공 후기 작성 (현재 위치)": 1.5초 로딩 후 현재 위치가 맞는지 확인하는 모달을 띄운다.
  const handleCurrentLocationReview = () => {
    setIsOpen(false);
    setIsLocationLoading(true);
    setTimeout(() => {
      setIsLocationLoading(false);
      setIsLocationConfirmOpen(true);
    }, 1500);
  };

  return (
    <>
      {isOpen && <ScreenOverlay onClick={() => setIsOpen(false)} />}
      <Box>
        <AnimatePresence>
          {isOpen && (
            <MotionFlex
              position="absolute"
              right="20px"
              bottom="72px"
              flexDirection="column"
              bg="white"
              borderRadius="16px"
              py={1}
              minW="220px"
              overflow="hidden"
              boxShadow="0px 12px 32px rgba(0, 0, 0, 0.18)"
              initial={{ opacity: 0, y: 12, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.94 }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              transition={{ duration: 0.18 as any }}
              zIndex={3000}
            >
              <GuideMenuItem
                icon={<CurrentLocationIcon />}
                title="카공 후기 작성"
                subtitle="현재 위치"
                onClick={handleCurrentLocationReview}
              />
              <Box h="1px" bg="gray.100" mx={4} />
              <GuideMenuItem
                icon={<SearchLocationIcon />}
                title="카공 후기 작성"
                subtitle="직접 검색"
                onClick={openAddCafe}
              />
            </MotionFlex>
          )}
        </AnimatePresence>

        <Button
          rounded="full"
          bgColor={isOpen ? "white" : "var(--gray-900)"}
          boxShadow="0 1px 3px rgba(0, 0, 0, 0.07), 0 2px 8px rgba(0, 0, 0, 0.05)"
          w="40px"
          h="40px"
          minW="40px"
          size="sm"
          p="0"
          border="var(--border-main)"
          borderWidth="1px"
          borderColor="var(--gray-300)"
          onClick={() => setIsOpen((prev) => !prev)}
          _hover={{ bgColor: isOpen ? "white" : "var(--gray-900)" }}
          _active={{ bgColor: isOpen ? "white" : "var(--gray-900)" }}
          zIndex={3000}
        >
          {isOpen ? <CloseIcon boxSize="12px" /> : <Icon2 />}
        </Button>
      </Box>

      {/* 현재 위치 확인 로딩 */}
      {isLocationLoading && <Spinner text="위치를 확인중입니다..." />}

      {/* 현재 위치 확인 모달 */}
      {isLocationConfirmOpen && (
        <ModalLayout
          title="이 카페가 맞나요?"
          setIsModal={() => setIsLocationConfirmOpen(false)}
          footerOptions={{
            main: { text: "네, 맞아요", func: () => setIsLocationConfirmOpen(false) },
            sub: { text: "직접 검색", func: openAddCafe },
          }}
        >
          <p>
            <b>[카페 타셴]</b> 기준으로
            <br />
            카공 후기를 작성할게요!
          </p>
        </ModalLayout>
      )}

      {/* 이용 가이드 / 업데이트 소식 */}
      {(menu === "이용 가이드" || menu === "업데이트 소식") && (
        <RightDrawer title={menu} onClose={() => setMenu(null)} isFull={false}>
          <Flex flex={1} overflowY="auto" direction="column">
            {menu === "이용 가이드"
              ? FAQ_ITEMS.map((item) => (
                  <FaqCard key={item.label} question={item.label} answer={item.text} />
                ))
              : UPDATE_ITEMS.slice()
                  .reverse()
                  .map((item) => <UpdateCard key={item.date} {...item} />)}
          </Flex>
        </RightDrawer>
      )}

      {/* 실시간 카공 피드 */}
      {isFeedOpen && (
        <RightDrawer title="실시간 카공 피드" onClose={() => router.back()} px={false} stickyHeader>
          <Flex maxW="var(--max-width)" mx="auto" borderBottom="var(--border)" mb={2}>
            {FEED_TABS.map((text, idx) => {
              const selected = feedTab === text;
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
                  onClick={() => setFeedTab(text)}
                >
                  {text}
                </Button>
              );
            })}
          </Flex>

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
                    handleClick={() => pickReviewPlace?.(place)}
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

function FaqCard({ question, answer }: { question: string; answer: string }) {
  return (
    <Box bg="gray.50" borderRadius="8px" p={3} border="1px solid" borderColor="gray.100" mb={2}>
      <Flex as="h3" align="flex-start" mb={2} fontSize="14px" fontWeight={700} color="gray.900">
        <Text as="span" color="mint.500" mr={2}>
          Q.
        </Text>
        {question}
      </Flex>
      <Text pl={5} fontSize="14px" color="gray.600" lineHeight="1.7">
        {answer}
      </Text>
    </Box>
  );
}

function UpdateCard({
  isCompleted,
  date,
  textArr,
}: {
  isCompleted: boolean;
  date: string;
  textArr: string[];
}) {
  return (
    <Box bg="gray.50" borderRadius="8px" p={3} border="1px solid" borderColor="gray.100" mb={2}>
      <Flex as="h3" align="flex-start" mb={2} fontSize="14px" fontWeight={700} color="gray.900">
        <Text as="span" color="mint.500" mr={2}>
          {isCompleted ? "[완료]" : "[예정]"}
        </Text>
        {isCompleted ? `${dayjs(date).format("M월 D일")} 업데이트` : "다음 업데이트 예정"}
      </Flex>
      <UnorderedList ml={0}>
        {textArr.map((text) => (
          <ListItem key={text} fontSize="12px" lineHeight="24px">
            {text}
          </ListItem>
        ))}
      </UnorderedList>
    </Box>
  );
}

const FAQ_ITEMS = [
  {
    label: "카공 지도는 무엇인가요?",
    text: "카공하기 좋은 카페는 따로 있는 거 아시나요? '카공 지도'는 실제 카공러 평가를 기반으로 공부하기 좋은 카페를 바로 찾을 수 있는 서비스예요.",
  },
  {
    label: "별점은 어떻게 평가되나요?",
    text: "공부 분위기, 콘센트, 자리 여유를 우선으로 평가해요. 그 외에 음료, 가성비, 조명, 와이파이, 주차 등은 기타 요소로 평가할 수 있어요.",
  },
  {
    label: "인기/베스트 카공 스팟은 무엇인가요?",
    text: "인기 카공 스팟은 별점 4.0, 베스트 카공 스팟은 별점 4.5 이상의 장소예요. 카공 카페로 검증된 장소! ",
  },
  {
    label: "장소 추가나 문의는 어떻게 하나요?",
    text: "우측 상단 메뉴에서 확인할 수 있어요!",
  },
  {
    label: "카페 리뷰는 어떻게 하나요?",
    text: "[카페 정보 → 후기 게시판]에서 평가할 수 있어요. 누구나 리뷰 작성이 가능하지만, 신뢰도 높은 리뷰 평가를 위해 검증된 카공 리뷰단도 준비 중이에요.",
  },
  {
    label: "업데이트는 언제 하나요?",
    text: "매일 신규 장소 추가 및 신규 기능을 업데이트 하고 있어요!",
  },
  {
    label: "어디서 운영하나요?",
    text: "20대 커뮤니티형 동아리 'About'에서 운영하고 있어요! 카공·스터디·취미·친목 등 다양한 모임을 운영 중이에요.",
  },
];

const UPDATE_ITEMS: { isCompleted: boolean; date: string; textArr: string[] }[] = [
  {
    date: "2026-05-17",
    isCompleted: true,
    textArr: [
      "전반적인 UI/UX 및 사용성 개선",
      "FAQ 및 업데이트 소식 기능 추가",
      "장소 추가 및 후기 작성 버튼 노출 문제 해결",
      "동일 카페 중복 등록 방지 기능 적용",
      "신규 카공 카페 등록",
    ],
  },
  {
    date: "2026-05-18",
    isCompleted: true,
    textArr: [
      "카페 리뷰 시 닉네임 작성 가능",
      "후기 신뢰도 검증 알고리즘 적용",
      "신규 카공 카페 등록",
    ],
  },
  {
    date: "2026-05-19",
    isCompleted: true,
    textArr: ["실시간 카공 피드 출시 (우측 상단)", "검증된 카공러 PICK 아카이브 추가"],
  },
  {
    date: "2026-05-20",
    isCompleted: true,
    textArr: ["전반적인 UI/UX 및 사용성 개선", "일부 오류 수정 및 안정성 개선"],
  },
  {
    date: "2026-05-24",
    isCompleted: true,
    textArr: ["카공지도 시즌2 대규모 업데이트"],
  },
  {
    date: "2026-05-31",
    isCompleted: true,
    textArr: [
      "카공 카페 등록 편의 개선",
      "AI 기반 실시간 카페 별점 판단",
      "AI 기반 실시간 정보 업데이트",
      "신규 카공 카페 30곳 추가",
      "폐업한 카페 30곳 제거",
    ],
  },
  {
    date: "2026-05-18",
    isCompleted: false,
    textArr: ["스터디 기능 오픈 예정", "아이폰/안드로이드 앱 출시 예정"],
  },
];

function GuideMenuItem({
  icon,
  title,
  subtitle,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <Flex
      as="button"
      type="button"
      align="center"
      gap={3}
      w="full"
      px={4}
      py={3}
      transition="background 0.12s"
      _hover={{ bg: "gray.50" }}
      _active={{ bg: "gray.100" }}
      onClick={onClick}
    >
      <Flex
        w="34px"
        h="34px"
        borderRadius="full"
        align="center"
        justify="center"
        bg="mint.50"
        flexShrink={0}
      >
        {icon}
      </Flex>
      <Flex direction="column" align="flex-start" lineHeight="1.3">
        <Text fontWeight={600} fontSize="15px" color="gray.900">
          {title}
        </Text>
        <Text fontWeight={500} fontSize="12px" color="mint">
          {subtitle}
        </Text>
      </Flex>
    </Flex>
  );
}

function Icon2() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20px"
      viewBox="0 -960 960 960"
      width="20px"
      fill="WHITE"
    >
      <path d="M480-87.87q-80.67 0-152.11-30.6-71.43-30.6-125.13-84.29-53.69-53.7-84.29-125.13-30.6-71.44-30.6-152.61 0-81.17 30.6-152.11 30.6-70.93 84.29-124.63 53.7-53.69 125.13-84.29 71.44-30.6 152.11-30.6 45.61 0 90.32 10.42 44.7 10.43 85.27 31.51 15.91 8 19.63 24.16 3.71 16.15-6.24 31.06-9.96 15.15-27.35 19.11-17.39 3.96-33.78-4.04-29.13-14.61-61.78-21.92-32.66-7.3-66.07-7.3-128.57 0-218.85 90.28T170.87-480q0 128.57 90.28 218.85T480-170.87q23.13 0 46.14-3.9t45.14-10.47q16.39-5 33.17.94 16.77 5.93 24.48 22.08 7.72 16.15.53 32.07-7.2 15.91-23.11 20.91-30.33 10.57-61.8 15.97-31.46 5.4-64.55 5.4ZM738.5-282.5H660q-17.15 0-29.33-12.17Q618.5-306.85 618.5-324t12.17-29.33Q642.85-365.5 660-365.5h78.5V-444q0-17.15 12.17-29.33Q762.85-485.5 780-485.5t29.33 12.17Q821.5-461.15 821.5-444v78.5H900q17.15 0 29.33 12.17Q941.5-341.15 941.5-324t-12.17 29.33Q917.15-282.5 900-282.5h-78.5v78.5q0 17.15-12.17 29.33Q797.15-162.5 780-162.5t-29.33-12.17Q738.5-186.85 738.5-204v-78.5ZM425.28-418.37l360.81-360.8q12.43-12.44 28.34-12.44 15.92 0 28.35 12.44 12.44 12.43 12.44 28.84 0 16.42-12.44 28.85l-389.43 390.2q-12.68 12.67-29.07 12.67t-29.06-12.67L288.8-437.7q-12.43-12.43-12.43-29.22 0-16.8 12.43-29.23 12.44-12.44 29.35-12.44 16.92 0 29.35 12.44l77.78 77.78Z" />
    </svg>
  );
}

function SearchLocationIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20px"
      viewBox="0 -960 960 960"
      width="20px"
      fill="var(--gray-900)"
    >
      <path d="M579.91-380.61q69.76-69.8 69.76-169.52 0-99.72-69.8-169.48-69.8-69.76-169.52-69.76-99.72 0-169.6 69.8-69.88 69.81-69.88 169.53 0 99.71 69.85 169.47 69.85 69.77 169.64 69.77 99.79 0 169.55-69.81ZM371.5-529.22l-46.63-47.11q-12.43-12.43-30.83-11.93-18.39.5-30.94 12.93-12.56 12.44-12.44 30.83.12 18.39 12.8 31.07l78.45 78.45q12.26 12.68 29.12 12.68t29.54-12.68l156.76-157q12.43-12.9 12.43-30.94t-12.43-30.47q-12.6-12.68-30.56-12.68t-31.1 12.68L371.5-529.22Zm39.23 301.42q-135.2 0-229.03-93.99-93.83-93.99-93.83-228.3 0-134.3 94.11-228.29 94.11-93.99 228.41-93.99 134.31 0 228.3 93.76 93.98 93.77 93.98 228.86 0 55.44-17.38 105.63t-49.38 91.14l177.43 177.43q12.64 12.64 12.64 29.52t-12.44 29.16q-12.1 12.61-29.04 12.61-16.95 0-29.81-12.88L607.26-294.56q-40.96 31.76-91.07 49.26-50.11 17.5-105.46 17.5Zm-.34-322.29Z" />
    </svg>
  );
}

export function CurrentLocationIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20px"
      viewBox="0 -960 960 960"
      width="20px"
      fill="var(--gray-900)"
    >
      <path d="m448.87-536.63-25.04-24.04q-11.48-11.48-25.96-11.48t-25.96 11.48q-11.48 11.47-11.48 26.45 0 14.98 11.48 26.46l46.89 47.89q12.68 12.67 29.57 12.67t29.56-12.67L590-573.17q11.48-11.48 11.36-25.84-.12-14.36-11.6-25.84t-25.84-11.48q-14.35 0-25.83 11.48l-89.22 88.22ZM480-197.46q117.33-105.08 177.23-192.09 59.9-87.02 59.9-160.41 0-103.32-67.66-171.25Q581.8-789.13 480-789.13t-169.47 67.92q-67.66 67.93-67.66 171.25 0 73.39 59.9 160.29 59.9 86.89 177.23 192.21Zm-26.29 80.42q-12.34-4.74-24.06-14.22-41.43-35.72-88.89-82.96-47.46-47.24-88.05-101.71-40.6-54.48-66.72-114.06-26.12-59.58-26.12-119.97 0-137.34 91.51-229.76 91.51-92.41 228.62-92.41 136.11 0 228.12 92.41 92.01 92.42 92.01 229.76 0 60.39-26.62 120.47t-66.72 114.56q-40.09 54.47-87.55 101.21-47.46 46.74-88.89 82.46-11.72 9.48-24.06 14.22-12.33 4.74-26.29 4.74-13.96 0-26.29-4.74ZM480-552Z" />
    </svg>
  );
}

export default GuideButton;
