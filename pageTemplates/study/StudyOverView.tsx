import { Badge, Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";

import StarRating from "../../components/atoms/StarRating";
import InfoBoxCol, { InfoBoxProps } from "../../components/molecules/InfoBoxCol";
import StarRatingReviewBlock from "../../components/molecules/StarRatingReviewBlock";
import { ABOUT_USER_SUMMARY } from "../../constants/serviceConstants/userConstants";
import { useUserCurrentLocation } from "../../hooks/custom/CurrentLocationHook";
import { useTypeToast } from "../../hooks/custom/CustomToast";
import { getStudyBadge } from "../../libs/study/studyHelpers";
import { StudyPlaceProps } from "../../types/models/studyTypes/study-entity.types";
import { StudyType } from "../../types/models/studyTypes/study-set.types";
import { dayjsToFormat, dayjsToStr } from "../../utils/dateTimeUtils";
import { getDistanceFromLatLonInKm } from "../../utils/mathUtils";
import { getPlaceBranch } from "../../utils/stringUtils";

interface IStudyOverview {
  placeInfo: StudyPlaceProps;
  studyType: StudyType;
  date: string;
}

function StudyOverview({ placeInfo, date, studyType }: IStudyOverview) {
  const { currentLocation } = useUserCurrentLocation();
  const typeToast = useTypeToast();
  const { text: badgeText, colorScheme: badgeColorScheme } = getStudyBadge(
    studyType,
    dayjs(date).startOf("day").isAfter(dayjs()),
  );
  console.log(52, studyType);
  const distance = getDistanceFromLatLonInKm(
    placeInfo?.location.latitude,
    placeInfo?.location.longitude,
    currentLocation?.lat,
    currentLocation?.lon,
  );

  const infoBoxPropsArr: InfoBoxProps[] = [
    {
      category:
        studyType === "participations"
          ? "매칭 시간"
          : studyType === "soloRealTimes"
          ? "영업 시간"
          : "확정 시간",
      text:
        studyType === "participations"
          ? dayjsToFormat(dayjs(date), "M월 D일(ddd) 오전 9시")
          : studyType === "soloRealTimes"
          ? "하루 공부가 끝나는 순간까지"
          : "정보 없음",
    },
    {
      category:
        studyType === "soloRealTimes"
          ? "공부 장소"
          : studyType === "participations"
          ? "매칭 기준"
          : "확정 기준",
      rightChildren:
        studyType === "soloRealTimes"
          ? "자유 카페 / 자유 공간"
          : studyType === "participations"
          ? "3명 이상의 멤버 참여"
          : "30분 이내 거리 + 3명 이상의 멤버 참여",
      // <BlurredLink isBlur={!isVoting} url="https://open.kakao.com/o/g6Wc70sh" />
    },
  ];

  return (
    <>
      <Box mx={5} mt={4}>
        {studyType !== "participations" && studyType !== "soloRealTimes" ? (
          <>
            <Box color="var(--gray-500)" fontSize="12px">
              <Badge mr={2} size="lg" colorScheme={badgeColorScheme}>
                {badgeText}
              </Badge>
              <Box as="span">{getPlaceBranch(placeInfo.location.address)}</Box>
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
                {placeInfo.location.name}
              </Box>
              <StarRating rating={4.5} size="lg" />
            </Flex>
            <Flex flexDir="column" borderRadius="8px">
              {[
                ...(placeInfo?.reviews ?? []).filter((review) => !!review?.user?.name),
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
              {studyType !== "participations" && studyType !== "soloRealTimes" && (
                <>
                  <Box as="span">
                    {studyType === "participations"
                      ? "스터디 매칭"
                      : studyType === "soloRealTimes"
                      ? "공부 인증"
                      : getPlaceBranch(placeInfo?.location.address)}
                  </Box>
                  {distance && (
                    <>
                      <Box as="span" color="var(--gray-400)">
                        ・
                      </Box>
                      <Box as="span">{distance}KM</Box>
                    </>
                  )}
                </>
              )}
            </Box>

            <Box mt={1} mb={4} mr={2} fontSize="20px" fontWeight="bold">
              {studyType === "participations"
                ? "스터디 매칭 라운지"
                : studyType === "soloRealTimes"
                ? "실시간 공부 인증"
                : placeInfo?.location.name}
            </Box>

            <InfoBoxCol infoBoxPropsArr={infoBoxPropsArr} />
          </Box>
        )}
      </Box>
    </>
  );
}

export default StudyOverview;
