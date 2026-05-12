import { Badge, Box, Flex } from "@chakra-ui/react";

import { STUDY_MAIN_IMAGES } from "../../assets/images/studyMain";
import Divider from "../../components/atoms/Divider";
import BottomNav from "../../components/layouts/BottomNav";
import PlaceImage from "../../components/molecules/PlaceImage";
import StarRatingReviewBlock2 from "../../components/molecules/StarRatingReviewBlock2";
import RightDrawer from "../../components/organisms/drawer/RightDrawer";
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
  const isCompleted = placeInfo?.ratings?.some((r) => r.user === userInfo?._id);
  const temp: StudyRatingProps = {
    comment: "여러분의 리뷰를 기다리고 있어요!",
    etc: 5,
    mood: 5,
    space: 5,
    table: 5,
    user: "",
    createdAt: getTodayStr(),
  };
  const temp2: StudyRatingProps = {
    comment: "첫 번째 익명 리뷰를 남겨보세요! 200 Point 지급!",
    etc: 4,
    mood: 5,
    space: 3,
    table: 5,
    user: "",
    createdAt: getTodayStr(),
  };
  const reviewArr = [temp, temp2, ...ratings];
  return (
    <RightDrawer title="리뷰 게시판" zIndex={zIndex} onClose={onClose}>
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
              <Flex fontSize="13px" lineHeight="20px" color="gray.600" align="center" mb={1}>
                {placeInfo.location.address}
              </Flex>
              <Flex fontSize="13px" lineHeight="20px" color="gray.600" align="center">
                <Box color="gray.500" fontWeight={600}>
                  영업중
                </Box>
                <Box color="gray.400" fontWeight={400}>
                  ・
                </Box>
                <Box>08:00 - 24:00</Box>
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
      />
    </RightDrawer>
  );
}
