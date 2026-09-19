import { Box, Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

import Header from "@/components/layouts/Header";
import { usePlaceRankingQuery } from "@/features/study/hooks/queries";
import { RightReviewDrawer } from "@/features/study/screens/StudyReview";
import { StudyReviewDrawer } from "@/features/studyMap/components/StudyReviewDrawer";
import { RankingCafeCard } from "@/features/studyMap/components/TopNav";
import { useOverlayRouter } from "@/hooks/useOverlayRouter";
import { StudyPlaceProps } from "@/types/models/studyTypes/study-entity.types";
import { getSafeAreaBottom } from "@/utils/validationUtils";

// 일반 카페가 아닌 스터디카페·스터디라운지 브랜드는 랭킹에서 뺀다 (이름에 포함되면 제외)
const RANKING_EXCLUDED_NAME_KEYWORDS = ["카공족", "공태풍", "디딤돌"];

export default function CafeMapRankingPage() {
  const router = useRouter();
  const { updateQuery } = useOverlayRouter();
  const modalParam = router.query.modal;

  const [reviewPlace, setReviewPlace] = useState<StudyPlaceProps | null>(null);

  const { data: rankingData } = usePlaceRankingQuery();
  const rankingCafes = useMemo(
    () =>
      rankingData?.filter(
        (item) =>
          !RANKING_EXCLUDED_NAME_KEYWORDS.some((keyword) =>
            item.place.location?.name?.includes(keyword),
          ),
      ),
    [rankingData],
  );

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
        bottom={getSafeAreaBottom(52)}
        zIndex={500}
        bg="white"
        maxW="var(--max-width)"
        mx="auto"
      >
        <Header title="카공 랭킹 TOP 100" isBack={false} isSlide={false} />

        <Box flex={1} overflowY="auto" borderTop="var(--border-main)">
          <Box px={4} pt={3} pb={1} fontSize="12px" color="gray.500">
            스터디카페·라운지 등 일반 카페가 아닌 곳은 랭킹에서 제외
          </Box>
          <Flex flexDir="column" px={4}>
            {rankingCafes?.map((item, idx) => (
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

      {/* drawer들은 fixed 컨테이너 밖 → 루트 stacking context에서 z-index 적용 */}
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
    </>
  );
}
