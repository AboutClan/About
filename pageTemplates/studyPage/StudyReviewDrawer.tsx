import { Box, Flex } from "@chakra-ui/react";

import Divider from "../../components/atoms/Divider";
import BottomNav from "../../components/layouts/BottomNav";
import StarRatingReviewBlock2 from "../../components/molecules/StarRatingReviewBlock2";
import RightDrawer from "../../components/organisms/drawer/RightDrawer";
import { CAFE_REVIEW_ARR } from "../../constants/keys/queryKeys";
import { useUserInfo } from "../../hooks/custom/UserHooks";
import { StudyPlaceProps } from "../../types/models/studyTypes/study-entity.types";
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
  console.log(25, placeInfo);
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

  const getNaturalRatings = (
    rating: number,
    seed: number,
  ): {
    mood: number;
    table: number;
    space: number;
    etc: number;
  } => {
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
      {/* position:relative + minHeight:100dvh로 BottomNav(position:absolute)의 기준을
          DrawerContent(100vh)에서 이 Box(dvh 기준)로 변경 — 모바일 웹 하단 툴바에 가려지는 문제 방지 */}
      <Box position="relative" minHeight="calc(100dvh - var(--header-h))">
        <Box mb={10}>
          <Box mb={3}>
            <PlaceInfoBox placeInfo={placeInfo} hasButton={false} isDown />
          </Box>
          <Divider />
          <Flex flexDir="column" borderRadius="8px" mt={2} mb={20}>
            {[...reviewArr]?.map((review, idx) => (
              <Box
                key={idx}
                py={3}
                borderBottom={idx !== reviewArr.length - 1 ? "var(--border)" : "none"}
              >
                <StarRatingReviewBlock2 review={review} idx={idx + 1} />
              </Box>
            ))}
          </Flex>{" "}
        </Box>

        <BottomNav
          text={isCompleted ? "별점 평가를 완료했어요!" : "카공 장소 별점 남기기"}
          isActive={!isCompleted}
          onClick={handleClick}
          isSlide={false}
        />
      </Box>
    </RightDrawer>
  );
}
