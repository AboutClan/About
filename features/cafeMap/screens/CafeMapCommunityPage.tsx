import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useState } from "react";

import Header from "@/components/layouts/Header";
import { useCursorData, useScrollInfinite } from "@/features/cafeMap/screens/CafeMapFeedPage";
import { StudyReviewProps, useStudyReviewsQuery } from "@/features/study/hooks/queries";
import StarRatingReviewBlock2 from "@/features/user/components/StarRatingReviewBlock2";
import { useToast } from "@/hooks/custom/CustomToast";
import { getSafeAreaBottom } from "@/utils/validationUtils";

const COMMUNITY_TABS = ["자유게시판", "최근 후기"] as const;
type CommunityTab = (typeof COMMUNITY_TABS)[number];

// 자유게시판은 오픈 전이라 탭을 눌러도 전환하지 않고 안내만 띄운다.
const COMING_SOON_TABS: CommunityTab[] = ["자유게시판"];

export default function CafeMapCommunityPage() {
  const toast = useToast();
  const [communityTab, setCommunityTab] = useState<CommunityTab>("최근 후기");

  const reviews = useCursorData<StudyReviewProps>(useStudyReviewsQuery);

  const { loaderRef: reviewLoaderRef } = useScrollInfinite({
    isActive: communityTab === "최근 후기",
    isLoading: reviews.isLoading,
    firstLoad: reviews.firstLoad,
    hasMore: reviews.hasMore,
    onLoadMore: reviews.loadMore,
  });

  const handleTabClick = (tab: CommunityTab) => {
    if (COMING_SOON_TABS.includes(tab)) {
      toast("info", `${tab}은 9월 30일 오픈 예정이에요!`);
      return;
    }
    setCommunityTab(tab);
  };

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
      <Header title="커뮤니티" isBack={false} isSlide={false}></Header>

      {/* 탭 바 */}
      <Flex w="full" borderBottom="var(--border)" flexShrink={0}>
        {COMMUNITY_TABS.map((text, idx) => {
          const selected = communityTab === text;
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
              onClick={() => handleTabClick(text)}
            >
              {text}
            </Button>
          );
        })}
      </Flex>

      {/* 스크롤 영역 */}
      <Box flex={1} overflowY="auto">
        {communityTab === "최근 후기" && (
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
      </Box>
    </Flex>
  );
}
