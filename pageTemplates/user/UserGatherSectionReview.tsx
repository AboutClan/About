import { Box, Button, Flex, Text } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useState } from "react";

import StarRatingReviewBlock2 from "../../components/molecules/StarRatingReviewBlock2";
import RightDrawer from "../../components/organisms/drawer/RightDrawer";
import { useToast } from "../../hooks/custom/CustomToast";
import { useCheckGuest } from "../../hooks/custom/UserHooks";
import { useMyPlaceQuery } from "../../hooks/study/queries";

function UserGatherSectionReview() {
  const toast = useToast();
  const isGuest = useCheckGuest();
  const [showCafeDrawer, setShowCafeDrawer] = useState(false);
  const [showReviewDrawer, setShowReviewDrawer] = useState(false);

  const { data } = useMyPlaceQuery({ enabled: !isGuest });

  const cafeCount = data?.registeredPlaces?.length ?? 0;
  const reviewCount = data?.myRatings?.length ?? 0;
  console.log(2, data);
  return (
    <>
      <Flex h="44px" bg="rgba(66,66,66,0.04)" mb={3}>
        {/* 등록한 카페 */}
        <Button
          flex={1}
          variant="unstyled"
          fontSize="12px"
          fontWeight="semibold"
          lineHeight="16px"
          color="gray.700"
          onClick={() => {
            if (!cafeCount) {
              toast("info", "등록한 카페가 없습니다.");
              return;
            }
            setShowCafeDrawer(true);
          }}
          pos="relative"
          rightIcon={
            <Flex
              justify="center"
              align="center"
              fontSize="10px"
              fontWeight="bold"
              lineHeight="12px"
              px="6px"
              h="16px"
              borderRadius="50%"
              bg="var(--color-mint-light)"
              color="mint"
            >
              {cafeCount}
            </Flex>
          }
        >
          등록한 카페
        </Button>

        <Box color="gray.300" fontWeight="light" fontSize="13px" w={1} h="20px" my="auto">
          |
        </Box>

        {/* 작성한 리뷰 */}
        <Button
          flex={1}
          variant="unstyled"
          fontSize="12px"
          fontWeight="semibold"
          lineHeight="16px"
          color="gray.700"
          onClick={() => {
            if (!reviewCount) {
              toast("info", "작성한 리뷰가 없습니다.");
              return;
            }
            setShowReviewDrawer(true);
          }}
          pos="relative"
          rightIcon={
            <Flex
              justify="center"
              align="center"
              fontSize="10px"
              fontWeight="bold"
              lineHeight="12px"
              px="6px"
              h="16px"
              borderRadius="50%"
              bg="var(--color-mint-light)"
              color="mint"
            >
              {reviewCount}
            </Flex>
          }
        >
          작성한 리뷰
        </Button>
      </Flex>

      {/* 내가 등록한 카페 Drawer */}
      {showCafeDrawer && (
        <RightDrawer title="내가 등록한 카페" onClose={() => setShowCafeDrawer(false)}>
          <Flex flexDir="column" pt={1}>
            {data?.registeredPlaces?.map((place, idx) => (
              <Box key={place._id ?? idx} borderBottom="var(--border)" px={1} pt={2} pb={3}>
                <Text fontSize="13px" fontWeight={600} color="gray.800" mb={0.5}>
                  {place.location?.name}
                </Text>
                {place.location?.address && (
                  <Text fontSize="12px" color="gray.500" mb={1} noOfLines={1}>
                    {place.location.address}
                  </Text>
                )}
                {place.registerDate && (
                  <Text fontSize="11px" color="gray.400">
                    {dayjs(place.registerDate).format("등록일: YYYY년 M월 D일")}
                  </Text>
                )}
              </Box>
            ))}
          </Flex>
        </RightDrawer>
      )}

      {/* 내가 작성한 리뷰 Drawer */}
      {showReviewDrawer && (
        <RightDrawer title="내가 작성한 리뷰" onClose={() => setShowReviewDrawer(false)}>
          <Flex flexDir="column" pt={1}>
            {data?.myRatings?.map((review, idx) => (
              <Box key={idx} pt={2} pb={3} borderBottom="var(--border)">
                <StarRatingReviewBlock2 review={review?.rating} idx={idx + 1} />
              </Box>
            ))}
          </Flex>
        </RightDrawer>
      )}
    </>
  );
}

export default UserGatherSectionReview;
