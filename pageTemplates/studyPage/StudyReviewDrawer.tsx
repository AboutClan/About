import { Box, Button, Flex } from "@chakra-ui/react";

import Divider from "../../components/atoms/Divider";
import StarRatingReviewBlock2 from "../../components/molecules/StarRatingReviewBlock2";
import RightDrawer from "../../components/organisms/drawer/RightDrawer";
import { CAFE_REVIEW_ARR } from "../../constants/keys/queryKeys";
import { useUserInfo } from "../../hooks/custom/UserHooks";
import { StudyPlaceProps } from "../../types/models/studyTypes/study-entity.types";
import { getSafeAreaBottom } from "../../utils/validationUtils";
import { PlaceInfoBox } from "./PlaceInfoDrawer";

interface RightReviewDrawer2Props {
  placeInfo: StudyPlaceProps;
  onClose: () => void;
  handleClick: () => void;
  zIndex: number;
}

export function StudyReviewDrawer({
  placeInfo,
  onClose,
  handleClick,
  zIndex,
}: RightReviewDrawer2Props) {
  const userInfo = useUserInfo();
  const ratings = placeInfo?.ratings || [];

  const getSavedReviewIds = () => {
    if (typeof window === "undefined") return [];
    try {
      const savedIds = localStorage.getItem(CAFE_REVIEW_ARR);
      const parsedIds = savedIds ? JSON.parse(savedIds) : [];
      return Array.isArray(parsedIds) ? parsedIds : [];
    } catch {
      return [];
    }
  };

  const parsedIds = getSavedReviewIds();

  const isCompleted =
    parsedIds.includes(placeInfo._id) ||
    (userInfo?.role !== "guest" && placeInfo?.ratings?.some((r) => r.user === userInfo?._id));

  const getNaturalRatings = (rating: number, seed: number) => {
    const candidates = [
      [0, 0, 0, 0],
      [0.5, 0, 0, -0.5],
      [0.5, 0.5, -0.5, -0.5],
      [1, 0, -0.5, -0.5],
      [0.5, 0, 0, -0.5],
    ];
    const offsets = candidates[seed % candidates.length];
    return {
      mood: Math.min(5, Math.max(0, rating + offsets[0])),
      table: Math.min(5, Math.max(0, rating + offsets[1])),
      space: Math.min(5, Math.max(0, rating + offsets[2])),
      etc: Math.min(5, Math.max(0, rating + offsets[3])),
    };
  };

  const seed = Number(placeInfo?.location?.latitude?.toString().slice(-1));
  const naturalRatings = getNaturalRatings(4.5, seed || 0);
  const naturalRatings2 = getNaturalRatings(4, seed || 0);
  const reviewArr = ratings?.length ? ratings : [naturalRatings, naturalRatings2];

  return (
    <RightDrawer title="리뷰 게시판" zIndex={zIndex} onClose={onClose}>
      {/* flex 컬럼: 콘텐츠 스크롤 + 버튼 하단 고정 */}
      <Flex
        direction="column"
        h="calc(100dvh - var(--header-h))"
        overflow="hidden"
      >
        {/* 스크롤 영역 */}
        <Flex flex={1} overflowY="auto" direction="column" pb={4}>
          <Box mb={3}>
            <PlaceInfoBox placeInfo={placeInfo} hasButton={false} isDown />
          </Box>
          <Divider />
          <Flex flexDir="column" mt={2}>
            {[...reviewArr].map((review, idx) => (
              <Box
                key={idx}
                py={3}
                borderBottom={idx !== reviewArr.length - 1 ? "var(--border)" : "none"}
              >
                <StarRatingReviewBlock2 review={review} idx={idx + 1} />
              </Box>
            ))}
          </Flex>
        </Flex>

        {/* 하단 버튼 — 스크롤 밖에 고정 */}
        <Box
          borderTop="1px solid var(--gray-100)"
          bg="white"
          pt={3}
          sx={{ paddingBottom: getSafeAreaBottom(8) }}
        >
          <Button
            w="full"
            size="lg"
            borderRadius="12px"
            backgroundColor={isCompleted ? "gray.400" : "var(--color-mint)"}
            color="white"
            fontSize="14px"
            fontWeight={700}
            isDisabled={isCompleted}
            opacity={isCompleted ? "1 !important" : undefined}
            _focus={{ backgroundColor: isCompleted ? "gray.400" : "var(--color-mint)", color: "white" }}
            onClick={handleClick}
          >
            {isCompleted ? "별점 평가를 완료했어요!" : "카공 장소 별점 남기기"}
          </Button>
        </Box>
      </Flex>
    </RightDrawer>
  );
}
