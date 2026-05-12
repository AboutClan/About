import { Badge, Box, Button, Flex, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { signIn, signOut } from "next-auth/react";
import { useState } from "react";

import { STUDY_MAIN_IMAGES } from "../../assets/images/studyMain";
import StarRating from "../../components/atoms/StarRating";
import { StarIcon } from "../../components/Icons/StarIcon";
import PlaceImage from "../../components/molecules/PlaceImage";
import BottomFlexDrawer from "../../components/organisms/drawer/BottomFlexDrawer";
import { useUserInfo } from "../../hooks/custom/UserHooks";
import { StudyPlaceProps } from "../../types/models/studyTypes/study-entity.types";
import { getRandomImage } from "../../utils/imageUtils";
import { navigateExternalLink } from "../../utils/navigateUtils";

interface PlaceInfoDrawerProps {
  placeInfo: StudyPlaceProps;
  onClose: () => void;
  handleVotePick?: () => void;
  isDown?: boolean;
  isChange?: boolean;
  pickReviewPlace: (id: string) => void;
}

function PlaceInfoDrawer({
  placeInfo,
  onClose,
  handleVotePick,
  isDown = false,
  isChange,
  pickReviewPlace,
}: PlaceInfoDrawerProps) {
  return (
    <>
      <BottomFlexDrawer
        isHideBottom
        height={!handleVotePick ? 481 : 476}
        isDrawerUp
        setIsModal={onClose}
        isOverlay
        zIndex={1000}
      >
        <PlaceInfoBox
          placeInfo={placeInfo}
          isDown={isDown}
          handleVotePick={handleVotePick}
          isChange={isChange}
          handleClick={() => pickReviewPlace(placeInfo._id)}
        />
      </BottomFlexDrawer>{" "}
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
  isShort = false,
}: {
  placeInfo: StudyPlaceProps;
  isDown: boolean;
  handleVotePick?: () => void;
  isChange?: boolean;
  handleClick: () => void;
  isShort?: boolean;
}) {
  const router = useRouter();
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
    if (isGuest) {
      await signOut({ redirect: false });
      await signIn("kakao", { callbackUrl: router.pathname });
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

  const total =
    ratings?.reduce((acc, cur) => {
      return acc + cur.mood + cur.table + cur.space + cur.etc;
    }, 0) ?? 0;

  const totalScore = placeInfo?.ratings?.length > 3 ? total / (ratings.length * 4) : rating;

  return (
    <>
      <Flex mt={4} w="full" h="full" direction="column" align="start">
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
              width="100%"
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

        <Flex align="center" mb={isShort ? 0 : 3}>
          <Box>
            <StarRating rating={totalScore} size="lg" />
          </Box>
          <Box fontWeight={600} fontSize="16px" ml={1.5} mr={1}>
            {totalScore?.toFixed(1)}
          </Box>
          <Box color="gray.500" fontSize="13px">
            (총 {reviewCnt}명 평가 반영)
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

        {!isShort && (
          <>
            <InfoRow label="공부 분위기" value={averageRatings.mood || rating} hasBorder />
            <InfoRow label="콘센트/테이블" value={averageRatings.table || rating} hasBorder />
            <InfoRow label="자리 여유" value={averageRatings.space || rating} hasBorder />
            <InfoRow label="기타" value={averageRatings.etc || rating} hasBorder />

            <Flex w="full" py={1} mb={1} justify="space-between" fontSize="13px" lineHeight="20px">
              <Box fontWeight="medium">안내사항</Box>
            </Flex>

            <Box as="ul" color="gray.600" lineHeight="16px" fontSize="12px" pl={4}>
              <li>현재 베타 서비스로 정보가 정확하지 않을 수 있습니다.</li>
              <li>리뷰 게시판에서 생생한 카공 카페 후기를 공유할 수 있어요!</li>
            </Box>
          </>
        )}
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
            {handleVotePick ? `이 장소로 스터디 ${isChange ? "변경" : "개설"}` : "카공 리뷰 게시판"}
          </Button>
        </Flex>
      </Flex>
    </>
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
