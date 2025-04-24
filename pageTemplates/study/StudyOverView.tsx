import { Badge, Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";

import StarRating from "../../components/atoms/StarRating";
import InfoBoxCol, { InfoBoxProps } from "../../components/molecules/InfoBoxCol";
import StarRatingReviewBlock from "../../components/molecules/StarRatingReviewBlock";
import { ABOUT_USER_SUMMARY } from "../../constants/serviceConstants/userConstants";
import { STUDY_STATUS_TO_BADGE } from "../../constants/studyConstants";
import { useTypeToast } from "../../hooks/custom/CustomToast";
import { StudyStatus } from "../../types/models/studyTypes/baseTypes";
import { PlaceReviewProps } from "../../types/models/studyTypes/entityTypes";
import { dayjsToStr } from "../../utils/dateTimeUtils";

interface IStudyOverview {
  place: {
    name: string;
    address: string;
    branch: string;
    reviews?: PlaceReviewProps[];
  };
  distance: number;
  status: StudyStatus | "recruiting" | "expected";

  time: string;
}

function StudyOverview({
  place: { name, address, branch, reviews },
  distance,
  status,
  time,
}: IStudyOverview) {
  const typeToast = useTypeToast();
  const { text: badgeText, colorScheme: badgeColorScheme } = STUDY_STATUS_TO_BADGE[status];
  const infoBoxPropsArr: InfoBoxProps[] = [
    {
      category: status === "recruiting" || status === "expected" ? "매칭 시간" : "영업 시간",
      text: time !== "unknown" ? time : "정보 없음",
    },
    {
      category: "장소",
      text: address,
    },
  ];

  return (
    <>
      <Box mx={5} mt={4}>
        {status === "open" || status === "expected" ? (
          <>
            <Box color="var(--gray-500)" fontSize="12px">
              <Badge mr={2} size="lg" colorScheme={badgeColorScheme}>
                {badgeText}
              </Badge>
              <Box as="span">{branch}</Box>
              {distance && (
                <>
                  <Box as="span" color="var(--gray-400)">
                    ・
                  </Box>
                  <Box as="span">{distance}KM</Box>
                </>
              )}
            </Box>
            <Flex align="center" mb={3}>
              <Box mt={1} mr={2} fontSize="20px" fontWeight="bold">
                {name}
              </Box>
              <StarRating rating={4.5} size="lg" />
            </Flex>
            <Flex flexDir="column" borderRadius="8px">
              {[
                ...reviews,
                {
                  rating: 5,
                  review: "여러분의 리뷰를 기다리고 있습니다.",
                  user: ABOUT_USER_SUMMARY,
                  createdAt: dayjsToStr(dayjs()),
                  isSecret: true,
                },
                {
                  rating: 4.5,
                  review: "자리마다 콘센트가 있고, 공간도 넓어서 공부하기 좋아요!",
                  user: ABOUT_USER_SUMMARY,
                  createdAt: dayjsToStr(dayjs()),
                  isSecret: true,
                },
              ]
                ?.slice(0, 2)
                .map((review) => (
                  <>
                    <Box pt={2} borderTop="var(--border)">
                      <StarRatingReviewBlock
                        rating={review.rating}
                        text={review.review}
                        size="sm"
                        user={review.isSecret ? { ...review.user, name: "익명" } : review.user}
                        date={review.createdAt}
                      />
                    </Box>
                  </>
                ))}

              <Button
                mb={1}
                w="full"
                color="gray.500"
                h="40px"
                lineHeight="16px"
                borderRadius="8px"
                fontWeight="semibold"
                variant="nostyle"
                onClick={() => typeToast("inspection")}
              >
                모든 후기 보러가기
              </Button>
            </Flex>
          </>
        ) : (
          <Box mb={5}>
            <Box color="var(--gray-500)" fontSize="12px">
              <Badge mr={2} size="lg" colorScheme={badgeColorScheme}>
                {badgeText}
              </Badge>
              <Box as="span">{branch}</Box>
              {distance && (
                <>
                  <Box as="span" color="var(--gray-400)">
                    ・
                  </Box>
                  <Box as="span">{distance}KM</Box>
                </>
              )}
            </Box>

            <Box mt={1} mb={4} mr={2} fontSize="20px" fontWeight="bold">
              {name}
            </Box>

            <InfoBoxCol infoBoxPropsArr={infoBoxPropsArr} />
          </Box>
        )}
      </Box>
    </>
  );
}

export default StudyOverview;
