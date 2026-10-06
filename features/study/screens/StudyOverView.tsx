import { Badge, Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";

import MainBadge from "@/components/atoms/MainBadge";
import StarRating from "@/components/atoms/StarRating";
import InfoBoxCol, { InfoBoxProps } from "@/components/molecules/InfoBoxCol";
import { getStudyBadge } from "@/features/study/lib/studyHelpers";
import { getPlaceScore } from "@/features/study/lib/studyUtils";
import { useUserCurrentLocation } from "@/hooks/custom/CurrentLocationHook";
import {
  StudyConfirmedMemberProps,
  StudyPlaceProps,
} from "@/types/models/studyTypes/study-entity.types";
import { StudyType } from "@/types/models/studyTypes/study-set.types";
import { getDistanceFromLatLonInKm } from "@/utils/mathUtils";
import { getPlaceBranch } from "@/utils/stringUtils";

interface IStudyOverview {
  placeInfo: StudyPlaceProps;
  studyType: StudyType;
  date: string;
  // 매칭 스터디(results) 상단의 인원·예정 시간에 쓴다.
  members?: StudyConfirmedMemberProps[];
}

const STUDY_CONFIRM_CNT = 4;

/** 멤버 시간이 모두 겹치는 구간. 겹치지 않으면 가장 이른 시작 ~ 가장 늦은 끝. */
const getStudyTimeText = (members?: StudyConfirmedMemberProps[]) => {
  const times = (members ?? [])
    .filter((m) => m?.time?.start && m?.time?.end)
    .map((m) => ({ start: dayjs(m.time.start), end: dayjs(m.time.end) }));
  if (!times.length) return null;
  const latestStart = times.reduce((a, t) => (t.start.isAfter(a) ? t.start : a), times[0].start);
  const earliestEnd = times.reduce((a, t) => (t.end.isBefore(a) ? t.end : a), times[0].end);
  const [start, end] = latestStart.isBefore(earliestEnd)
    ? [latestStart, earliestEnd]
    : [
        times.reduce((a, t) => (t.start.isBefore(a) ? t.start : a), times[0].start),
        times.reduce((a, t) => (t.end.isAfter(a) ? t.end : a), times[0].end),
      ];
  return `${start.format("HH:mm")} ~ ${end.format("HH:mm")}`;
};

function StudyOverview({ placeInfo, date, studyType, members }: IStudyOverview) {
  const { currentLocation } = useUserCurrentLocation();

  const dateStatus = dayjs(date).startOf("day").isAfter(dayjs())
    ? "future"
    : dayjs(date).isSame(dayjs(), "day")
    ? "current"
    : "prev";
  const { text: badgeText, colorScheme: badgeColorScheme } = getStudyBadge(studyType, dateStatus);

  // 매칭 스터디 상단: 언제 열리는지·몇 명인지·확정까지 몇 명 남았는지를 한눈에.
  const isExpected = studyType === "results" && dateStatus === "future";
  const memberCnt = members?.length ?? 0;
  const remainCnt = Math.max(STUDY_CONFIRM_CNT - memberCnt, 0);
  const studyTimeText = getStudyTimeText(members);
  const dateText = dayjs(date).locale("ko").format("M/D(ddd)");

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
          : isExpected
          ? "예정 시간"
          : "스터디 시간",
      text:
        studyType === "participations"
          ? "당일 오전 9시"
          : studyType === "soloRealTimes"
          ? "하루 공부가 끝나는 순간까지"
          : studyTimeText ?? "멤버 시간 확인 중",
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
          ? "설정한 매칭 범위 내 · 4명 이상의 멤버"
          : "설정한 매칭 범위 내 · 4명 이상의 멤버",
    },

    // {
    //   category: "스터디 혜택",
    //   text:
    //     studyType === "participations" ? "출석 시 최대 1,000 Point 획득" : "최대 500 Point 획득",
    // },
  ];

  return (
    <>
      <Box mx={5} mt={4}>
        {studyType !== "participations" && studyType !== "soloRealTimes" ? (
          <>
            <Box color="var(--gray-500)" fontSize="12px">
              <Flex mb={1} align="center">
                <Box mr={1}>
                  <MainBadge
                    text={
                      studyType !== "results"
                        ? "매칭 스터디"
                        : isExpected
                        ? `오픈 예정 · ${dateText}`
                        : dateStatus === "current"
                        ? "오늘의 스터디"
                        : `지난 스터디 · ${dateText}`
                    }
                  />
                </Box>
                <MainBadge
                  text={placeInfo && getPlaceBranch(placeInfo.location.address, true)}
                  type="sub"
                />
              </Flex>
            </Box>
            <Flex align="center" mb={studyType === "results" && memberCnt ? 1 : 3}>
              <Box mt={1} mr={2} fontSize="20px" fontWeight="bold">
                {placeInfo?.location?.name}
              </Box>
              <StarRating rating={getPlaceScore(placeInfo?.ratings).total} size="lg" />
            </Flex>
            {studyType === "results" && !!memberCnt && (
              <Box mb={3} fontSize="13px" color="gray.600">
                {isExpected ? (
                  <>
                    {memberCnt}명 신청
                    {remainCnt > 0 && (
                      <>
                        {" · "}
                        <Box as="span" color="mint" fontWeight={600}>
                          확정까지 {remainCnt}명
                        </Box>
                      </>
                    )}
                    {" · "}오전 9시에 확정돼요
                  </>
                ) : (
                  <>{memberCnt}명 참여</>
                )}
                {studyTimeText && (
                  <Box mt={0.5}>
                    {isExpected ? "예정 시간" : "스터디 시간"} {studyTimeText}
                  </Box>
                )}
              </Box>
            )}
          </>
        ) : (
          <Box mb={3}>
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
            <Box mt={1} mb={2} mr={2} fontSize="20px" fontWeight="bold">
              {studyType === "participations"
                ? "카공 스터디 라운지"
                : studyType === "soloRealTimes"
                ? "실시간 공부 인증"
                : placeInfo?.location.name}
            </Box>
            <InfoBoxCol infoBoxPropsArr={infoBoxPropsArr} />
            {/* <Flex as="button" align="center" fontSize="12px" color="gray.500" mt={2}>
              <Box mr={1}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <g clipPath="url(#clip0_2444_1052)">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M10 7.66671C9.73479 7.66671 9.48044 7.56135 9.2929 7.37381C9.10537 7.18628 9.00001 6.93192 9.00001 6.66671C9.00001 6.40149 9.10537 6.14714 9.2929 5.9596C9.48044 5.77206 9.73479 5.66671 10 5.66671C10.2652 5.66671 10.5196 5.77206 10.7071 5.9596C10.8947 6.14714 11 6.40149 11 6.66671C11 6.93192 10.8947 7.18628 10.7071 7.37381C10.5196 7.56135 10.2652 7.66671 10 7.66671ZM10.8333 13.8625C10.8333 14.0836 10.7455 14.2955 10.5893 14.4518C10.433 14.6081 10.221 14.6959 10 14.6959C9.779 14.6959 9.56704 14.6081 9.41076 14.4518C9.25447 14.2955 9.16668 14.0836 9.16668 13.8625V9.69587C9.16668 9.47486 9.25447 9.2629 9.41076 9.10662C9.56704 8.95034 9.779 8.86254 10 8.86254C10.221 8.86254 10.433 8.95034 10.5893 9.10662C10.7455 9.2629 10.8333 9.47486 10.8333 9.69587V13.8625ZM10 0.833374C4.93751 0.833374 0.833344 4.93754 0.833344 10C0.833344 15.0625 4.93751 19.1667 10 19.1667C15.0625 19.1667 19.1667 15.0625 19.1667 10C19.1667 4.93754 15.0625 0.833374 10 0.833374Z"
                      fill="var(--gray-400)"
                    />
                  </g>
                </svg>
              </Box>
              <u>스터디 신청 후에는 어떻게 하나요?</u>
            </Flex> */}
          </Box>
        )}
      </Box>
    </>
  );
}

export default StudyOverview;

{
  /* <Flex flexDir="column" borderRadius="8px">
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
                .map((review, idx) => (
                  <Box key={idx} pt={2} borderTop="var(--border)">
                    <StarRatingReviewBlock
                      rating={review.rating}
                      text={review.review}
                      size="sm"
                      user={review.isSecret ? { ...review.user, name: "익명" } : review.user}
                      date={review.createdAt}
                    />
                  </Box>
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
            </Flex> */
}
