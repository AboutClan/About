import { Badge, Box, Button, Flex } from "@chakra-ui/react";
import { signIn, signOut } from "next-auth/react";
import { useState } from "react";

import { STUDY_MAIN_IMAGES } from "../../assets/images/studyMain";
import Divider from "../../components/atoms/Divider";
import StarRating from "../../components/atoms/StarRating";
import { StarIcon } from "../../components/Icons/StarIcon";
import BottomNav from "../../components/layouts/BottomNav";
import PlaceImage from "../../components/molecules/PlaceImage";
import StarRatingReviewBlock2 from "../../components/molecules/StarRatingReviewBlock2";
import BottomFlexDrawer from "../../components/organisms/drawer/BottomFlexDrawer";
import RightDrawer from "../../components/organisms/drawer/RightDrawer";
import { useUserInfo } from "../../hooks/custom/UserHooks";
import {
  StudyPlaceProps,
  StudyRatingProps,
} from "../../types/models/studyTypes/study-entity.types";
import { getTodayStr } from "../../utils/dateTimeUtils";
import { getRandomImage } from "../../utils/imageUtils";
import { navigateExternalLink } from "../../utils/navigateUtils";
import { RightReviewDrawer } from "../study/StudyReview";

interface PlaceInfoDrawerProps {
  placeInfo: StudyPlaceProps;
  onClose: () => void;
  handleVotePick?: () => void;
  isDown?: boolean;
  isChange?: boolean;
}

function PlaceInfoDrawer({
  placeInfo,
  onClose,
  handleVotePick,
  isDown = false,
  isChange,
}: PlaceInfoDrawerProps) {
  const userInfo = useUserInfo();
  const [page, setPage] = useState<1 | 2 | 3>(1);

  const ratings = placeInfo?.ratings;

  const isCompleted = ratings?.some((r) => r?.user === userInfo?._id);

  return (
    <>
      <BottomFlexDrawer
        isHideBottom
        height={!handleVotePick ? 481 : 476}
        isDrawerUp
        setIsModal={onClose}
        isOverlay
        zIndex={page === 1 ? 3000 : 1000}
      >
        <PlaceInfoBox
          placeInfo={placeInfo}
          isDown={isDown}
          handleVotePick={handleVotePick}
          isChange={isChange}
          handleClick={() => setPage(2)}
        />
      </BottomFlexDrawer>{" "}
      {(page === 2 || page === 3) && (
        <RightReviewDrawer2
          placeInfo={placeInfo}
          onClose={() => setPage(1)}
          zIndex={2000}
          isCompleted={isCompleted}
          handleClick={() => {
            setPage(3);
          }}
        />
      )}
      {page === 3 && (
        <RightReviewDrawer placeId={placeInfo._id} onClose={() => setPage(2)} zIndex={3000} />
      )}
    </>
  );
}

export default PlaceInfoDrawer;

export function PlaceInfoBox({
  placeInfo,
  isDown,
  handleVotePick,
  isChange,
  handleClick,
}: {
  placeInfo: StudyPlaceProps;
  isDown: boolean;
  handleVotePick?: () => void;
  isChange?: boolean;
  handleClick?: () => void;
}) {
  const userInfo = useUserInfo();

  const [isLoading, setIsLoading] = useState(false);

  const isGuest = userInfo?.role === "guest";

  const ratings = placeInfo?.ratings || [];

  const reviewCnt =
    (ratings?.length || 0) + 2 + Number(placeInfo?.location?.latitude?.toString().slice(-1));

  const rating = placeInfo?.rating;

  const result = ratings?.reduce(
    (acc, cur) => {
      acc.mood += cur.mood;
      acc.table += cur.table;
      acc.space += cur.space;
      acc.etc += cur.etc;

      return acc;
    },
    {
      mood: 0,
      table: 0,
      space: 0,
      etc: 0,
    },
  );

  const count = ratings.length;

  const averageRatings = {
    mood: result.mood / count,
    table: result.table / count,
    space: result.space / count,
    etc: result.etc / count,
  };

  const handleReviewClick = () => {
    navigateExternalLink(`https://map.naver.com/p/search/${placeInfo.location.name}`);
  };

  const handleRatingClick = async () => {
    if (isDown || isGuest) {
      await signOut({ redirect: false });
      await signIn("kakao", { callbackUrl: "/studyPage" });

      return;
    }
    handleClick();
  };

  const handleVoteClick = () => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    handleVotePick?.();
  };

  return (
    <>
      <Flex mt={4} w="full" h="full" direction="column" align="start">
        <Flex w="full" justify="space-between" align="start" mb={4}>
          <Flex direction="column" flex={1} minW={0} mr={3}>
            <Box mb={2}>
              <Badge px={2} py={1} fontSize="11px" color="gray.500" bg="rgba(142,160,172,0.08)">
                카공 장소
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
            isDown={isDown}
          />
        </Flex>

        <Flex align="center" mb={3}>
          <Box>
            <StarRating rating={placeInfo?.rating} size="lg" />
          </Box>
          <Box fontWeight={600} fontSize="16px" ml={1.5} mr={1}>
            {placeInfo?.rating?.toFixed(1)}
          </Box>
          <Box color="gray.500" fontSize="13px">
            (총 {reviewCnt}명 평가)
          </Box>
        </Flex>
        {/* <InfoRow label="전체 평점" hasBorder>
        <Flex color="gray.600" fontWeight="regular" align="center">
          <Box mr={1}>
            <StarRating rating={placeInfo?.rating} size="lg" />
          </Box>
          {rating}
        </Flex>
      </InfoRow> */}

        <InfoRow label="공부 분위기" value={averageRatings.mood || rating} hasBorder />
        <InfoRow label="콘센트/테이블" value={averageRatings.table || rating} hasBorder />
        <InfoRow label="자리 여유" value={averageRatings.space || rating} hasBorder />
        <InfoRow label="기타" value={averageRatings.etc || rating} hasBorder />

        <Flex w="full" py={1} mb={1} justify="space-between" fontSize="13px" lineHeight="20px">
          <Box fontWeight="medium">안내사항</Box>
        </Flex>

        <Box as="ul" color="gray.600" lineHeight="16px" fontSize="12px" pl={4}>
          <li>현재 베타 서비스로 정보가 정확하지 않을 수 있습니다.</li>
          <li>후기 게시판에서 생생한 카공 카페 후기를 공유할 수 있어요!</li>
        </Box>

        <Flex py={2} w="full" mt="auto">
          <Button colorScheme="black" size="lg" mr={3} flex={1} onClick={handleReviewClick}>
            네이버 지도
          </Button>

          <Button
            size="lg"
            flex={1}
            colorScheme="mint"
            isLoading={isLoading}
            onClick={handleVotePick ? handleVoteClick : handleRatingClick}
          >
            {handleVotePick ? `이 장소로 스터디 ${isChange ? "변경" : "개설"}` : "카페 후기 게시판"}
          </Button>
        </Flex>
      </Flex>
    </>
  );
}

interface RightReviewDrawer2Props {
  placeInfo: StudyPlaceProps;
  onClose: () => void;
  handleClick: () => void;
  zIndex: number;
  isCompleted: boolean;
}

function RightReviewDrawer2({
  placeInfo,
  onClose,
  handleClick,
  zIndex,
  isCompleted,
}: RightReviewDrawer2Props) {
  const ratings = placeInfo?.ratings || [];

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
    <RightDrawer title="후기 게시판" zIndex={zIndex} onClose={onClose}>
      <Box mb={10}>
        <Flex w="full" justify="space-between" align="start" mb={4}>
          <Flex direction="column" flex={1} minW={0} mr={3}>
            <Box mb={2}>
              <Badge px={2} py={1} fontSize="11px" color="gray.500" bg="rgba(142,160,172,0.08)">
                카공 장소
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

function InfoRow({
  label,
  value,
  children,
  hasBorder,
}: {
  label: string;
  value?: number;
  children?: React.ReactNode;
  hasBorder?: boolean;
}) {
  return (
    <Flex
      w="full"
      py={1}
      mb={1}
      borderBottom={hasBorder ? "var(--border)" : undefined}
      justify="space-between"
      fontSize="13px"
      lineHeight="20px"
    >
      <Box fontWeight="medium">{label}</Box>

      {children || (
        <Flex color="gray.600" fontWeight="regular" align="center" lineHeight="20px">
          <Box mx="2px">
            <StarIcon type="fill" size="md" />
          </Box>
          {value.toFixed(1)}
        </Flex>
      )}
    </Flex>
  );
}
