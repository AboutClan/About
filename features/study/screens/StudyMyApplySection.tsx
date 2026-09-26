import { Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useMemo } from "react";

import { STUDY_MIN_MEMBER_COUNT } from "@/constants/serviceConstants/studyConstants/studyMatchConstant";
import {
  DEFAULT_RANGE_NUM,
  RANGE_TO_EPS,
} from "@/constants/serviceConstants/studyConstants/studyRangeConstant";
import { countMatchCandidates } from "@/features/study/lib/matchProgress";
import { StudyWeekSetProps } from "@/types/models/studyTypes/study-set.types";
import { dayjsToFormat } from "@/utils/dateTimeUtils";

interface StudyMyApplySectionProps {
  studySet: StudyWeekSetProps;
  myId: string;
  onEdit: () => void;
}

/**
 * 대기 중인 내 신청 요약. `vote2/mine`은 확정된 결과만 주므로
 * 주간 응답의 participations에서 내 것을 뽑아 쓴다.
 */
function StudyMyApplySection({ studySet, myId, onEdit }: StudyMyApplySectionProps) {
  const myApply = useMemo(() => {
    if (!studySet?.participations || !myId) return null;

    const mine = studySet.participations
      .map((participation) => ({
        date: participation.date,
        all: participation.study,
        study: participation.study.find((s) => s.user._id === myId),
      }))
      .filter((entry) => !!entry.study);

    if (!mine.length) return null;

    // 가장 가까운 신청 날짜로 진행 상황을 계산한다. participations는 오늘~+7일 순서로
    // 내려오고, 확정된 날짜는 participations가 비므로 mine[0]은 항상 아직 확정 전이다.
    const nearest = mine[0];

    return {
      dates: mine.map((entry) => entry.date),
      times: nearest.study.times,
      address: nearest.study.location?.address,
      nearestDate: nearest.date,
      candidateCount: countMatchCandidates({
        anchors: nearest.study.locations?.length
          ? nearest.study.locations
          : [nearest.study.location],
        eps: nearest.study.eps ?? RANGE_TO_EPS[DEFAULT_RANGE_NUM],
        participations: nearest.all,
        times: nearest.study.times,
        myId,
      }),
    };
  }, [studySet?.participations, myId]);

  if (!myApply) return null;

  const shortfall = STUDY_MIN_MEMBER_COUNT - myApply.candidateCount;

  const dateText = myApply.dates.map((date) => dayjsToFormat(dayjs(date), "M/D(ddd)")).join(", ");

  const timeText =
    myApply.times?.start && myApply.times?.end
      ? `${dayjsToFormat(dayjs(myApply.times.start), "HH:mm")} - ${dayjsToFormat(
          dayjs(myApply.times.end),
          "HH:mm",
        )}`
      : null;

  return (
    <Box p={4} borderRadius="14px" border="1px solid" borderColor="mint.100" bg="mint.50">
      <Flex justify="space-between" align="center" mb={2}>
        <Box fontSize="14px" fontWeight={700} color="gray.800">
          신청한 스터디
        </Box>
        <Button size="xs" variant="outline" borderRadius="full" bg="white" onClick={onEdit}>
          수정
        </Button>
      </Flex>

      <Flex direction="column" gap={1} fontSize="12.5px" color="gray.700">
        <Flex>
          <Box w="52px" flexShrink={0} color="gray.500">
            날짜
          </Box>
          <Box fontWeight={600}>{dateText}</Box>
        </Flex>
        {timeText && (
          <Flex>
            <Box w="52px" flexShrink={0} color="gray.500">
              시간
            </Box>
            <Box fontWeight={600}>{timeText}</Box>
          </Flex>
        )}
        {myApply.address && (
          <Flex>
            <Box w="52px" flexShrink={0} color="gray.500">
              기준 위치
            </Box>
            <Box fontWeight={600} isTruncated>
              {myApply.address}
            </Box>
          </Flex>
        )}
      </Flex>

      {/*
        진행 상황. "성사된다"고 말하지 않는다 — 서버 매칭은 인원·시간 외에
        "함께 갈 수 있는 카페가 실제로 있는지"까지 보므로 최소 인원을 넘겨도 보장되지 않는다.
        사실(현재 인원)과 기준(최소 인원)만 알려주고 판단은 사용자에게 맡긴다.
      */}
      <Box mt={3} pt={3} borderTop="1px solid" borderColor="mint.100">
        <Flex align="center" justify="space-between" fontSize="12.5px">
          <Box color="gray.600">
            {dayjsToFormat(dayjs(myApply.nearestDate), "M/D(ddd)")} 내 시간·범위와 겹치는 신청자
          </Box>
          <Box fontWeight={700} color={shortfall > 0 ? "gray.700" : "mint.600"}>
            {myApply.candidateCount}명
          </Box>
        </Flex>
        <Box mt={1} fontSize="11.5px" color="gray.500" lineHeight="16px">
          {shortfall > 0
            ? `최소 ${STUDY_MIN_MEMBER_COUNT}명이 모여야 매칭돼요. ${shortfall}명이 더 필요해요 — 범위를 넓히거나 시간을 늘려 보세요.`
            : `최소 인원 ${STUDY_MIN_MEMBER_COUNT}명은 넘었어요. 같이 갈 수 있는 카페까지 맞으면 오전 9시에 확정돼요.`}
        </Box>
      </Box>
    </Box>
  );
}

export default StudyMyApplySection;
