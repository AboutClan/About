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
  pickReviewPlace: (place: StudyPlaceProps) => void;
}

function GuideButton({ pickReviewPlace }: GuideButtonProps) {
  const router = useRouter();
  const { updateQuery } = useOverlayRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [menu, setMenu] = useState<MenuType | null>(null);
  const [feedTab, setFeedTab] = useState<FeedTab>("최근 후기");

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

  const openFeed = () => {
    setIsOpen(false);
    updateQuery({ modal: "reviewFeed" });
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
              borderRadius="12px"
              px={5}
              py={2.5}
              gap={4}
              minW="190px"
              boxShadow="0px 12px 32px rgba(0, 0, 0, 0.18)"
              initial={{ opacity: 0, y: 12, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.94 }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              transition={{ duration: 0.18 as any }}
              zIndex={3000}
            >
              <FloatingMenuItem
                icon={
                  <Flex borderRadius="full" align="center" justify="center">
                    <BoardIcon />
                  </Flex>
                }
                text="실시간 카공 피드"
                onClick={() => openFeed()}
              />

              <FloatingMenuItem
                icon={
                  <Flex borderRadius="full" align="center" justify="center">
                    <UpdateIcon />
                  </Flex>
                }
                text="업데이트 소식"
                onClick={() => openMenu("업데이트 소식")}
              />
              {/* <FloatingMenuItem
                icon={
                  <Flex borderRadius="full" align="center" justify="center">
                    <InfoIcon />
                  </Flex>
                }
                text="이용 가이드"
                onClick={() => openMenu("이용 가이드")}
              /> */}
            </MotionFlex>
          )}
        </AnimatePresence>

        <Button
          rounded="full"
          bgColor="white"
          boxShadow="0px 5px 10px 0px rgba(66, 66, 66, 0.1)"
          w="40px"
          h="40px"
          minW="40px"
          size="sm"
          p="0"
          border="var(--border-main)"
          borderWidth="1px"
          borderColor="var(--gray-300)"
          onClick={() => setIsOpen((prev) => !prev)}
          _hover={{ bgColor: "white" }}
          _active={{ bgColor: "white" }}
          zIndex={3000}
        >
          {isOpen ? <CloseIcon boxSize="12px" color="gray.800" /> : <Icon2 />}
        </Button>
      </Box>

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
    date: "2026-05-18",
    isCompleted: false,
    textArr: [
      "카페 좋아요 + 모아보기 기능 예정",
      "스터디 기능 오픈 예정",
      "아이폰/안드로이드 앱 출시 예정",
    ],
  },
];

function FloatingMenuItem({
  icon,
  text,
  onClick,
}: {
  icon: React.ReactNode;
  text: string;
  onClick: () => void;
}) {
  return (
    <Flex
      as="button"
      type="button"
      align="center"
      gap={3}
      w="full"
      fontSize="14px"
      fontWeight={700}
      color="gray.900"
      lineHeight="1"
      onClick={onClick}
      py={2.5}
    >
      {icon}
      <Text ml={text === "이용 가이드" ? "3px" : text === "실시간 카공 피드" ? "3px" : "-1px"}>
        {text}
      </Text>
    </Flex>
  );
}

function UpdateIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="25px"
      viewBox="0 -960 960 960"
      width="25px"
      fill="var(--gray-800)"
    >
      <path d="M840-440h-80q-17 0-28.5-11.5T720-480q0-17 11.5-28.5T760-520h80q17 0 28.5 11.5T880-480q0 17-11.5 28.5T840-440ZM664-288q10-14 26-16t30 8l64 48q14 10 16 26t-8 30q-10 14-26 16t-30-8l-64-48q-14-10-16-26t8-30Zm120-424-64 48q-14 10-30 8t-26-16q-10-14-8-30t16-26l64-48q14-10 30-8t26 16q10 14 8 30t-16 26ZM200-360h-40q-33 0-56.5-23.5T80-440v-80q0-33 23.5-56.5T160-600h160l139-84q20-12 40.5 0t20.5 35v338q0 23-20.5 35t-40.5 0l-139-84h-40v120q0 17-11.5 28.5T240-200q-17 0-28.5-11.5T200-240v-120Zm360 14v-268q27 24 43.5 58.5T620-480q0 41-16.5 75.5T560-346Z" />
    </svg>
  );
}

function Icon2() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="19px"
      viewBox="0 -960 960 960"
      width="19px"
      fill="var(--gray-800)"
    >
      <path d="M260-320q47 0 91.5 10.5T440-278v-394q-41-24-87-36t-93-12q-36 0-71.5 7T120-692v396q35-12 69.5-18t70.5-6Zm260 42q44-21 88.5-31.5T700-320q36 0 70.5 6t69.5 18v-396q-33-14-68.5-21t-71.5-7q-47 0-93 12t-87 36v394Zm-66.5 93.5Q441-188 430-194q-39-23-82-34.5T260-240q-42 0-82.5 11T100-198q-21 11-40.5-1T40-234v-482q0-11 5.5-21T62-752q46-24 96-36t102-12q58 0 113.5 15T480-740q51-30 106.5-45T700-800q52 0 102 12t96 36q11 5 16.5 15t5.5 21v482q0 23-19.5 35t-40.5 1q-37-20-77.5-31T700-240q-45 0-88 11.5T530-194q-11 6-23.5 9.5T480-181q-14 0-26.5-3.5ZM280-494Zm280-115q0-9 6.5-18.5T581-640q29-10 58-15t61-5q20 0 39.5 2.5T778-651q9 2 15.5 10t6.5 18q0 17-11 25t-28 4q-14-3-29.5-4.5T700-600q-26 0-51 5t-48 13q-18 7-29.5-1T560-609Zm0 220q0-9 6.5-18.5T581-420q29-10 58-15t61-5q20 0 39.5 2.5T778-431q9 2 15.5 10t6.5 18q0 17-11 25t-28 4q-14-3-29.5-4.5T700-380q-26 0-51 4.5T601-363q-18 7-29.5-.5T560-389Zm0-110q0-9 6.5-18.5T581-530q29-10 58-15t61-5q20 0 39.5 2.5T778-541q9 2 15.5 10t6.5 18q0 17-11 25t-28 4q-14-3-29.5-4.5T700-490q-26 0-51 5t-48 13q-18 7-29.5-1T560-499Z" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="21px"
      viewBox="0 -960 960 960"
      width="21px"
      fill="var(--gray-800)"
    >
      <path d="M515.5-254.5Q530-269 530-290t-14.5-35.5Q501-340 480-340t-35.5 14.5Q430-311 430-290t14.5 35.5Q459-240 480-240t35.5-14.5ZM624-602q0-54-36.5-86T491-720q-45 0-79.5 18.5T357-648q-7 11-.5 24t20.5 19q12 5 25 .5t22-16.5q11-15 27.5-23t35.5-8q28 0 45.5 15t17.5 38q0 18-12 38t-36 40q-26 23-39 43t-17 47q-2 14 8.5 25.5T481-394q14 0 25.5-9.5T521-429q3-16 11-28.5t28-32.5q38-38 51-61t13-51ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Z" />
    </svg>
  );
}

export function BoardIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20px"
      viewBox="0 -960 960 960"
      width="20px"
      fill="var(--gray-800)"
    >
      <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm360-80h280v-480H520v480Zm-280-80h120q17 0 28.5-11.5T400-360q0-17-11.5-28.5T360-400H240q-17 0-28.5 11.5T200-360q0 17 11.5 28.5T240-320Zm0-120h120q17 0 28.5-11.5T400-480q0-17-11.5-28.5T360-520H240q-17 0-28.5 11.5T200-480q0 17 11.5 28.5T240-440Zm0-120h120q17 0 28.5-11.5T400-600q0-17-11.5-28.5T360-640H240q-17 0-28.5 11.5T200-600q0 17 11.5 28.5T240-560Zm360 240h120q17 0 28.5-11.5T760-360q0-17-11.5-28.5T720-400H600q-17 0-28.5 11.5T560-360q0 17 11.5 28.5T600-320Zm0-120h120q17 0 28.5-11.5T760-480q0-17-11.5-28.5T720-520H600q-17 0-28.5 11.5T560-480q0 17 11.5 28.5T600-440Zm0-120h120q17 0 28.5-11.5T760-600q0-17-11.5-28.5T720-640H600q-17 0-28.5 11.5T560-600q0 17 11.5 28.5T600-560Z" />
    </svg>
  );
}

export default GuideButton;
