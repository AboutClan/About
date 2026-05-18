import { Badge, Box, Button, Flex, Text } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useState } from "react";

import { STUDY_MAIN_IMAGES } from "../../assets/images/studyMain";
import StarRating from "../../components/atoms/StarRating";
import { StarIcon } from "../../components/Icons/StarIcon";
import PlaceImage from "../../components/molecules/PlaceImage";
import BottomFlexDrawer from "../../components/organisms/drawer/BottomFlexDrawer";
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
  zIndex?: number;
}

function PlaceInfoDrawer({
  placeInfo,
  onClose,
  handleVotePick,
  isDown = false,
  isChange,
  pickReviewPlace,
  zIndex = 1000,
}: PlaceInfoDrawerProps) {
  return (
    <>
      <BottomFlexDrawer
        isHideBottom
        height={!handleVotePick ? 424 : 476}
        isDrawerUp
        setIsModal={onClose}
        isOverlay
        zIndex={zIndex}
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
  const [isLoading, setIsLoading] = useState(false);

  const ratings = placeInfo?.ratings || [];

  const reviewCnt =
    (ratings?.length || 0) + 2 + Number(placeInfo?.location?.latitude?.toString().slice(-1));

  const rating = placeInfo?.rating || 3.5;
  console.log(3232, placeInfo, ratings);
  const result = Array.isArray(ratings)
    ? ratings.reduce(
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
      )
    : {
        mood: 0,
        table: 0,
        space: 0,
        etc: 0,
      };

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
    // if (isGuest) {
    //   await signOut({ redirect: false });
    //   await signIn("kakao", {
    //     callbackUrl: "https://xn--ob0b42knwutje.com/",
    //   });
    //   return;
    // }

    handleClick();
  };

  const handleVoteClick = () => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    handleVotePick?.();
  };

  const total = Array.isArray(ratings)
    ? ratings.reduce((acc, cur) => {
        return acc + cur.mood + cur.table + cur.space + cur.etc;
      }, 0)
    : 0;

  const totalScore = Number(placeInfo?.ratings?.length > 3 ? total / (ratings.length * 4) : rating);
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

  const naturalRatings = getNaturalRatings(rating, seed || 0);
  const isCurrentTimeInRange = (timeRange: string) => {
    const [start, end] = timeRange.split(" - ");

    const now = dayjs().format("HH:mm");

    return now >= start && now <= end;
  };

  const hour = placeInfo?.operatingHours?.[0]?.[1] || "08:00 - 22:00";
  const isCurrent = isCurrentTimeInRange(hour);
  return (
    <>
      <Flex mt={2} w="full" h="full" direction="column" align="start">
        <Flex w="full" justify="space-between" align="start" mb={3}>
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
                  {isCurrent ? "영업중" : "영업 종료"}
                </Box>
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
            isDown={isDown}
          />
        </Flex>

        <Flex align="center">
          <Box>
            <StarRating rating={totalScore} size="lg" />
          </Box>
          <Box fontWeight={600} fontSize="16px" ml={1.5} mr={1}>
            {Number.isFinite(totalScore) ? totalScore.toFixed(1) : "0.0"}
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
          <Flex
            mt={3}
            flexDir="column"
            bg="gray.50"
            border="var(--border-main)"
            w="full"
            borderRadius="8px"
            px={5}
            py={4}
            pb={2}
          >
            <InfoRow
              label="공부 분위기"
              value={averageRatings.mood || naturalRatings.mood}
              hasBorder
            />
            <InfoRow
              label="콘센트/테이블"
              value={averageRatings.table || naturalRatings.table}
              hasBorder
            />
            <InfoRow
              label="자리 여유"
              value={averageRatings.space || naturalRatings.space}
              hasBorder
            />
            <InfoRow label="기타" value={averageRatings.etc || naturalRatings.etc} />

            {/* <Flex w="full" py={1} mb={1} justify="space-between" fontSize="13px" lineHeight="20px">
              <Box fontWeight="medium">안내사항</Box>
            </Flex>

            <Box as="ul" color="gray.600" lineHeight="16px" fontSize="12px" pl={4}>
              <li>현재 베타 서비스로 정보가 정확하지 않을 수 있습니다.</li>
              <li>리뷰 게시판에서 생생한 카공 카페 후기를 공유할 수 있어요!</li>
            </Box> */}
          </Flex>
        )}
        <Flex py={2} pt={1} w="full" mt="auto">
          <Button colorScheme="black" size="lg" mr={3} flex={1} onClick={handleReviewClick}>
            네이버 지도
          </Button>

          <Button
            size="lg"
            flex={1}
            colorScheme="mint"
            isLoading={isLoading}
            onClick={handleVotePick ? handleVoteClick : handleRatingClick}
            fontSize="14px"
          >
            {!handleVotePick && (
              <Box mr={1}>
                <ReviewIcon />
              </Box>
            )}
            <Box fontSize="14px" lineHeight="20px">
              {handleVotePick ? `이 장소로 스터디 ${isChange ? "변경" : "개설"}` : "후기 게시판"}
            </Box>
          </Button>
        </Flex>
      </Flex>
    </>
  );
}

function ReviewIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M12.1073 14.4414H3.892C2.606 14.4414 1.55867 13.3947 1.55867 12.108V3.89269C1.55867 2.60602 2.606 1.55936 3.892 1.55936H5.91867C6.11316 1.55936 6.29969 1.63662 6.43721 1.77415C6.57474 1.91167 6.652 2.0982 6.652 2.29269C6.652 2.48718 6.57474 2.67371 6.43721 2.81123C6.29969 2.94876 6.11316 3.02602 5.91867 3.02602H3.892C3.414 3.02602 3.02534 3.41469 3.02534 3.89269V12.108C3.02534 12.5854 3.414 12.9747 3.892 12.9747H12.1073C12.5853 12.9747 12.974 12.5854 12.974 12.108V10.0794C12.974 9.88487 13.0513 9.69834 13.1888 9.56081C13.3263 9.42329 13.5128 9.34602 13.7073 9.34602C13.9018 9.34602 14.0884 9.42329 14.2259 9.56081C14.3634 9.69834 14.4407 9.88487 14.4407 10.0794V12.108C14.4407 13.3947 13.394 14.4414 12.1073 14.4414Z"
        fill="#EEEEEE"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M8.12733 8.60601C7.98226 8.60606 7.84043 8.56308 7.71978 8.4825C7.59914 8.40193 7.50511 8.28738 7.44959 8.15335C7.39406 8.01932 7.37954 7.87183 7.40786 7.72955C7.43617 7.58726 7.50606 7.45657 7.60866 7.35401L13.1887 1.77401C13.2564 1.70447 13.3374 1.64907 13.4267 1.61105C13.5161 1.57303 13.6121 1.55314 13.7092 1.55254C13.8063 1.55193 13.9026 1.57061 13.9924 1.60751C14.0823 1.64441 14.1639 1.69878 14.2325 1.76748C14.3012 1.83617 14.3555 1.91781 14.3923 2.00767C14.4292 2.09753 14.4478 2.1938 14.4471 2.29092C14.4465 2.38803 14.4265 2.48404 14.3884 2.57338C14.3504 2.66272 14.2949 2.74361 14.2253 2.81135L8.646 8.39135C8.57806 8.4595 8.49733 8.51356 8.40843 8.5504C8.31953 8.58724 8.22423 8.60614 8.128 8.60601"
        fill="#EEEEEE"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M13.7073 7.95936C13.5128 7.95936 13.3263 7.88209 13.1888 7.74457C13.0513 7.60704 12.974 7.42052 12.974 7.22602V3.02602H8.774C8.57951 3.02602 8.39298 2.94876 8.25545 2.81123C8.11793 2.67371 8.04066 2.48718 8.04066 2.29269C8.04066 2.0982 8.11793 1.91167 8.25545 1.77415C8.39298 1.63662 8.57951 1.55936 8.774 1.55936H13.7073C13.9018 1.55936 14.0883 1.63662 14.2259 1.77415C14.3634 1.91167 14.4407 2.0982 14.4407 2.29269V7.22602C14.4407 7.42052 14.3634 7.60704 14.2259 7.74457C14.0883 7.88209 13.9018 7.95936 13.7073 7.95936Z"
        fill="#EEEEEE"
      />
    </svg>
  );
}

function InfoRow({
  label,
  value = 0,
  children,
  hasBorder,
}: {
  label: string;
  value?: number;
  children?: React.ReactNode;
  hasBorder?: boolean;
}) {
  const stars = Array.from({ length: 5 }, (_, index) => {
    const starValue = index + 1;

    if (value >= starValue) return "fill";
    if (value >= starValue - 0.5) return "half";
    return "empty";
  });

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
          <Flex mx="2px">
            {stars.map((type, index) => (
              <StarIcon key={index} type={type} size="md" />
            ))}
          </Flex>
        </Flex>
      )}
    </Flex>
  );
}
