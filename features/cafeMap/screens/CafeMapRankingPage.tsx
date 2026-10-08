import { Box, Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

import Header from "@/components/layouts/Header";
import { usePlaceRankingQuery } from "@/features/study/hooks/queries";
import { RightReviewDrawer } from "@/features/study/screens/StudyReview";
import { StudyReviewDrawer } from "@/features/studyMap/components/StudyReviewDrawer";
import { RankingCafeCard } from "@/features/studyMap/components/TopNav";
import { useOverlayRouter } from "@/hooks/useOverlayRouter";
import { StudyPlaceProps } from "@/types/models/studyTypes/study-entity.types";
import { getSafeAreaBottom } from "@/utils/validationUtils";

// [임시·영상 촬영용] ?demo=1 일 때 왼쪽 아래 ▶ 버튼으로 목록을 일정한 속도로 아래로 스크롤한다.
const SCROLL_DEMO_DURATION_MS = 5000;
const SCROLL_DEMO_SPEED_PX_PER_SEC = 360;

export default function CafeMapRankingPage() {
  const router = useRouter();
  const { updateQuery } = useOverlayRouter();
  const modalParam = router.query.modal;

  const [reviewPlace, setReviewPlace] = useState<StudyPlaceProps | null>(null);

  // 리뷰 게시판은 ?modal= 로 히스토리에 쌓여 열린다. 열림 여부의 단일 기준도 이 쿼리여야
  // 뒤로가기(브라우저·안드로이드 하드웨어 모두 router.back())로 닫힌다.
  // reviewPlace 만 보고 렌더하면 쿼리가 빠져도 드로어가 그대로 남는다.
  const isReviewOpen = modalParam === "reviewPlace" || modalParam === "addReview";

  useEffect(() => {
    if (!isReviewOpen) setReviewPlace(null);
  }, [isReviewOpen]);

  const { data: rankingData } = usePlaceRankingQuery();

  // [임시·영상 촬영용] 스크롤 재생. 경과 시간 기준 절대 위치로 맞춰 프레임이 밀려도 속도가 일정하고,
  // 끝나면 시작 위치로 되돌려 같은 장면을 반복해서 찍을 수 있다.
  const isScrollDemo = router.query.demo !== undefined;
  const listRef = useRef<HTMLDivElement>(null);
  const scrollDemoRafRef = useRef(0);
  const [isScrollDemoRunning, setIsScrollDemoRunning] = useState(false);
  const startScrollDemo = () => {
    const list = listRef.current;
    if (!list) return;
    setIsScrollDemoRunning(true);
    const startTop = list.scrollTop;
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = Math.min(now - start, SCROLL_DEMO_DURATION_MS);
      list.scrollTop = startTop + (SCROLL_DEMO_SPEED_PX_PER_SEC * elapsed) / 1000;
      if (elapsed < SCROLL_DEMO_DURATION_MS) {
        scrollDemoRafRef.current = requestAnimationFrame(step);
      } else {
        list.scrollTop = startTop;
        setIsScrollDemoRunning(false);
      }
    };
    scrollDemoRafRef.current = requestAnimationFrame(step);
  };
  // 핫 리로드로 루프만 멈추고 state 가 남아 버튼이 숨겨진 채 굳지 않게 한다.
  useEffect(() => {
    setIsScrollDemoRunning(false);
    return () => cancelAnimationFrame(scrollDemoRafRef.current);
  }, []);

  return (
    <>
      {/* 페이지 본문 — pos="fixed" + zIndex가 stacking context를 만들므로
          drawer들은 반드시 이 Flex 밖(형제 노드)에 렌더링해야
          CafeBottomNav(z:600) 위에 올라올 수 있다 */}
      <Flex
        flexDir="column"
        pos="fixed"
        top={0}
        left={0}
        right={0}
        // 하단 탭바(CafeMapBottomNav) 높이만큼 비운다. 0이면 이 화면(z 500)이 탭바를 덮는다.
        bottom={getSafeAreaBottom(52)}
        zIndex={500}
        bg="white"
        maxW="var(--max-width)"
        mx="auto"
      >
        <Header title="카공 랭킹 TOP 100" isBack={false} isSlide={false} />

        <Box ref={listRef} flex={1} overflowY="auto" borderTop="var(--border-main)">
          <Flex flexDir="column" px={4}>
            {rankingData?.map((item, idx) => (
              <RankingCafeCard
                key={item.place._id}
                place={item.place}
                rank={idx + 1}
                totalScore={item.totalScore}
                onReviewClick={() => {
                  setReviewPlace(item.place as unknown as StudyPlaceProps);
                  updateQuery({ modal: "reviewPlace" });
                }}
              />
            ))}
          </Flex>
        </Box>
      </Flex>

      {isScrollDemo && !isScrollDemoRunning && (
        <Flex
          as="button"
          type="button"
          aria-label="스크롤 재생"
          pos="fixed"
          left="16px"
          bottom={getSafeAreaBottom(52 + 24)}
          zIndex={600}
          w="40px"
          h="40px"
          align="center"
          justify="center"
          borderRadius="full"
          bg="white"
          border="1px solid var(--gray-300)"
          boxShadow="0 1px 4px rgba(0, 0, 0, 0.12)"
          fontSize="14px"
          color="gray.800"
          onClick={startScrollDemo}
        >
          ▶
        </Flex>
      )}

      {/* drawer들은 fixed 컨테이너 밖 → 루트 stacking context에서 z-index 적용 */}
      {isReviewOpen && reviewPlace && (
        <StudyReviewDrawer
          placeInfo={reviewPlace}
          onClose={() => router.back()}
          zIndex={3000}
          handleClick={() => updateQuery({ modal: "addReview" })}
        />
      )}
      {modalParam === "addReview" && reviewPlace && (
        <RightReviewDrawer placeId={reviewPlace._id} onClose={() => router.back()} zIndex={4000} />
      )}
    </>
  );
}
