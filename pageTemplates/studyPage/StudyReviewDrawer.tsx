import { Badge, Box, Flex, Text } from "@chakra-ui/react";
import dayjs from "dayjs";

import { STUDY_MAIN_IMAGES } from "../../assets/images/studyMain";
import Divider from "../../components/atoms/Divider";
import BottomNav from "../../components/layouts/BottomNav";
import PlaceImage from "../../components/molecules/PlaceImage";
import StarRatingReviewBlock2 from "../../components/molecules/StarRatingReviewBlock2";
import RightDrawer from "../../components/organisms/drawer/RightDrawer";
import { CAFE_REVIEW_ARR } from "../../constants/keys/queryKeys";
import { useUserInfo } from "../../hooks/custom/UserHooks";
import {
  StudyPlaceProps,
  StudyRatingProps,
} from "../../types/models/studyTypes/study-entity.types";
import { getTodayStr } from "../../utils/dateTimeUtils";
import { getRandomImage } from "../../utils/imageUtils";

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
  const temp: StudyRatingProps = {
    comment: "",
    etc: 4,
    mood: 5,
    space: 5,
    table: 4,
    user: "",
    createdAt: getTodayStr(),
  };
  const temp2: StudyRatingProps = {
    comment: "",
    etc: 4,
    mood: 5,
    space: 3,
    table: 5,
    user: "",
    createdAt: getTodayStr(),
  };
  const reviewArr = ratings?.length ? ratings : [temp, temp2];
  const isCurrentTimeInRange = (timeRange: string) => {
    const [start, end] = timeRange.split(" - ");

    const now = dayjs().format("HH:mm");

    return now >= start && now <= end;
  };
  const hour = placeInfo?.operatingHours?.[0]?.[1] || "08:00 - 22:00";
  const isCurrent = isCurrentTimeInRange(hour);

  return (
    <RightDrawer title="리뷰 게시판" zIndex={zIndex} onClose={onClose}>
      {/* position:relative + minHeight:100dvh로 BottomNav(position:absolute)의 기준을
          DrawerContent(100vh)에서 이 Box(dvh 기준)로 변경 — 모바일 웹 하단 툴바에 가려지는 문제 방지 */}
      <Box position="relative" minHeight="calc(100dvh - var(--header-h))">
      <Box mb={10}>
        <Flex w="full" justify="space-between" align="start" mb={4}>
          <Flex direction="column" flex={1} minW={0} mr={3}>
            <Box mb={2}>
              <Badge px={2} py={1} fontSize="11px" color="gray.500" bg="rgba(142,160,172,0.08)">
                {placeInfo?.registrant?.name || "어바웃"}님 PICK
              </Badge>
            </Box>

            <Box
              mb={2}
              fontSize="18px"
              fontWeight="semibold"
              lineHeight="28px"
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
            >
              {placeInfo.location.name}
            </Box>
            <Flex flexDir="column">
              <Flex align="center" mb={1} width="90%" minW={0}>
                <Text
                  fontSize="13px"
                  lineHeight="20px"
                  color="gray.600"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                  width="100%"
                >
                  {placeInfo.location.address}
                </Text>
              </Flex>
              <Flex fontSize="13px" lineHeight="20px" color="gray.600" align="center">
                {isCurrent ? "영업중" : "영업 종료"}
                <Box color="gray.400" fontWeight={400}>
                  ・
                </Box>
                <Box>{hour}</Box>
              </Flex>
            </Flex>
          </Flex>

          <PlaceImage
            imageProps={{
              image: placeInfo?.image || getRandomImage(STUDY_MAIN_IMAGES),
            }}
            size="lg2"
            hasToggleHeart
          />
        </Flex>
        <Divider />
        <Flex flexDir="column" borderRadius="8px" mt={2} mb={20}>
          {[...reviewArr]?.map((review, idx) => (
            <Box key={idx} pt={3} borderTop="var(--border)">
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
